import { AccountDB } from './account.db';
import { singleton } from 'tsyringe';
import { Request } from '@typings/http';
import {
  Account,
  AccountType,
  AddToSharedAccountInput,
  AtmInput,
  PreDBAccount,
  RenameAccountInput,
  AccountRole,
  RemoveFromSharedAccountInput,
  SharedAccountUser,
  UpdateBankBalanceInput,
  CreateBasicAccountInput,
  AddToUniqueAccountInput,
  RemoveFromUniqueAccountInput,
  UpdateBankBalanceByNumberInput,
} from '@typings/Account';
import { UserService } from '../user/user.service';
import { config } from '@utils/server-config';
import { mainLogger } from '../../sv_logger';
import { sequelize } from '../../utils/pool';
import { TransactionService } from '../transaction/transaction.service';
import { CashService } from '../cash/cash.service';
import i18next from '@utils/i18n';
import { TransactionType } from '@typings/Transaction';
import { AccountModel } from './account.model';
import { ServerError } from '@utils/errors';
import {
  AccountErrors,
  AuthorizationErrors,
  BalanceErrors,
  CardErrors,
  GenericErrors,
  UserErrors,
} from '@typings/Errors';
import { SharedAccountDB } from '@services/accountShared/sharedAccount.db';
import { AccountEvents, Broadcasts } from '@server/../../typings/Events';
import { getFrameworkExports, isFrameworkIntegrationActive } from '@server/utils/frameworkIntegration';
import { Transaction } from 'sequelize/types';
import { CardDB } from '../card/card.db';
import { assertPositiveMoney } from '@server/utils/money';

const logger = mainLogger.child({ module: 'accounts' });
const { syncInitialBankBalance = false, isCardsEnabled = false } = config.frameworkIntegration ?? {};
const { firstAccountStartBalance } = config.accounts ?? {};
const isFrameworkIntegrationEnabled = isFrameworkIntegrationActive();

@singleton()
export class AccountService {
  _cardDB: CardDB;
  _accountDB: AccountDB;
  _sharedAccountDB: SharedAccountDB;
  _cashService: CashService;
  _userService: UserService;
  _transactionService: TransactionService;
  /** Serializes withdraw/deposit per player to prevent concurrent race exploits. */
  private _sourceMoneyLocks = new Map<number, Promise<void>>();

  constructor(
    accountDB: AccountDB,
    sharedAccountDB: SharedAccountDB,
    userService: UserService,
    cashService: CashService,
    transactionService: TransactionService,
    cardDB: CardDB,
  ) {
    this._cardDB = cardDB;
    this._accountDB = accountDB;
    this._sharedAccountDB = sharedAccountDB;
    this._cashService = cashService;
    this._userService = userService;
    this._transactionService = transactionService;
  }

  private async withSourceMoneyLock<T>(source: number, fn: () => Promise<T>): Promise<T> {
    const previous = this._sourceMoneyLocks.get(source) ?? Promise.resolve();
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    this._sourceMoneyLocks.set(
      source,
      previous.then(() => gate),
    );
    await previous;
    try {
      return await fn();
    } finally {
      release();
    }
  }

  private async getMyAccounts(source: number) {
    const user = this._userService.getUser(source);
    const accounts = await this._accountDB.getAccountsByIdentifier(user.getIdentifier());
    return accounts;
  }

  private async getMySharedAccounts(source: number): Promise<Account[]> {
    const user = this._userService.getUser(source);
    const accounts = await this._sharedAccountDB.getSharedAccountsByIdentifier(
      user.getIdentifier(),
    );
    const mappedAccounts = accounts.map((sharedAccount) => {
      const acc = sharedAccount.getDataValue('account') as unknown as AccountModel;
      const sharedAcc = sharedAccount.toJSON();

      /* Override role by the shared one. */
      return {
        ...acc?.toJSON(),
        role: sharedAcc.role,
      };
    });

    return mappedAccounts;
  }

  async getAccountsByIdentifier(identifier: string): Promise<AccountModel[]> {
    return await this._accountDB.getAccountsByIdentifier(identifier);
  }

  async getTotalBankBalance(source: number): Promise<number> {
    const accounts = await this.getMyAccounts(source);
    const totalBalance = accounts.reduce((total, account) => {
      return total + account.getDataValue('balance');
    }, 0);

    return totalBalance;
  }

  async getTotalBankBalanceByIdentifier(identifier: string): Promise<number> {
    const accounts = await this.getAccountsByIdentifier(identifier);
    const totalBalance = accounts.reduce((total, account) => {
      return total + account.getDataValue('balance');
    }, 0);

    return totalBalance;
  }

  async getUniqueAccount(identifier: string) {
    const account = await this._accountDB.getUniqueAccountByIdentifier(identifier);
    return account?.toJSON();
  }

  async getDefaultAccountBySource(source: number, t?: Transaction) {
    const user = this._userService.getUser(source);
    return await this._accountDB.getDefaultAccountByIdentifier(user.getIdentifier(), t);
  }

  async getDefaultAccountBalance(req: Request<number>) {
    const defaultAccount = await this.getDefaultAccountBySource(req.source);
    return defaultAccount?.getDataValue('balance');
  }

  async handleGetMyAccounts(source: number): Promise<Account[]> {
    logger.debug('Retrieving accounts');
    const accountModels = await this.getMyAccounts(source);
    const accounts = accountModels.map((account) => account.toJSON());
    const filteredAccounts = accounts.filter((account) => account.type !== AccountType.Shared);
    const sharedAccounts = await this.getMySharedAccounts(source);

    const accs = [...filteredAccounts, ...sharedAccounts];
    return accs.map((account) => {
      const date = new Date(account.createdAt ?? '');
      return {
        ...account,
        createdAt: date.toLocaleString(),
      };
    });
  }

  async addUserToShared(req: Request<AddToSharedAccountInput>) {
    const { name, identifier, role, accountId } = req.data;
    logger.silly(`Adding user src: ${req.source} to shared account.`);

    const t = await sequelize.transaction();
    try {
      const user = this._userService.getUserByIdentifier(identifier);
      const account = await this._sharedAccountDB.createSharedAccount(
        {
          name,
          userIdentifier: identifier,
          role,
          accountId,
        },
        t,
      );

      t.afterCommit(() => {
        emit(Broadcasts.NewSharedUser, account.toJSON());
        emitNet(Broadcasts.NewSharedUser, user?.getSource(), account.toJSON());
      });

      t.commit();
      return account;
    } catch (err) {
      t.rollback();
      logger.error('Failed to add user to shared account');
    }
  }

  async removeUserFromShared(req: Request<RemoveFromSharedAccountInput>) {
    const { identifier, accountId } = req.data;
    logger.silly(`Removing user. identifier: ${identifier} to shared account.`);
    const user = this._userService.getUserByIdentifier(identifier);
    const mySharedAccounts = await this._sharedAccountDB.getSharedAccountsByIdentifier(identifier);
    const account = mySharedAccounts.find(
      (account) => account?.getDataValue('account')?.id === accountId,
    );

    if (!account) {
      throw new ServerError(AccountErrors.NotFound);
    }

    const t = await sequelize.transaction();
    try {
      await account?.destroy({ transaction: t, force: true });

      t.afterCommit(() => {
        emit(Broadcasts.RemovedSharedUser, account.toJSON());
        if (user?.getSource())
          emitNet(Broadcasts.RemovedSharedUser, user?.getSource(), account.toJSON());
      });

      t.commit();
    } catch (error) {
      t.rollback();
      logger.error('Failed to remove user from shared account');
    }
  }

  async createInitialAccount(source: number): Promise<Account> {
    logger.silly(`Checking if default account exists for source: ${source}`);
    const user = this._userService.getUser(source);
    const identifier = user.getIdentifier();
    logger.silly(`Identifier: ${identifier}`);

    const defaultAccount = await this._accountDB.getDefaultAccountByIdentifier(identifier);

    if (defaultAccount) {
      logger.silly('Default account exists.');
      return defaultAccount.toJSON();
    }

    let balance = firstAccountStartBalance ?? 0;
    if (isFrameworkIntegrationEnabled && syncInitialBankBalance) {
      logger.info('Syncing initial bank balance from framework.');

      const exports = getFrameworkExports();
      balance = exports.getBank(source) ?? 0;

      logger.info('Moving bank balance from export to initial account.');
      logger.info({ identifier, balance });
    }

    logger.debug('Creating initial account .. ');
    const t = await sequelize.transaction();
    try {
      const initialAccount = await this._accountDB.createAccount(
        {
          isDefault: true,
          accountName: i18next.t('Personal account'),
          ownerIdentifier: user.getIdentifier(),
          type: AccountType.Personal,
          balance,
        },
        t,
      );

      if (balance > 0) {
        await this._transactionService.handleCreateTransaction(
          {
            amount: balance,
            message:
              isFrameworkIntegrationEnabled && syncInitialBankBalance
                ? 'Opening balance (synced)'
                : 'Opening balance',
            toAccount: initialAccount.toJSON(),
            type: TransactionType.Incoming,
          },
          t,
        );
      }

      await t.commit();
      logger.debug('Successfully created initial account.');
      return initialAccount.toJSON();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  async createAccount(req: Request<CreateBasicAccountInput>): Promise<Account> {
    const { type, name, identifier } = req.data;

    logger.silly('Creating an account ..');
    logger.silly(req);

    const account = await this._accountDB.createAccount({
      type,
      accountName: name,
      ownerIdentifier: identifier,
    });

    return account.toJSON();
  }

  async handleCreateAccount(req: Request<PreDBAccount>): Promise<Account | undefined> {
    logger.silly('Trying to create a new account ...');
    logger.silly(req);

    const user = this._userService.getUser(req.source);
    const userIdentifier = user.getIdentifier();
    const userName = user.name;
    const maxAccounts = config?.accounts?.maximumNumberOfAccounts ?? 4;

    const t = await sequelize.transaction();
    try {
      const userAccounts = await this._accountDB.getAccountsByIdentifier(userIdentifier);
      const isFirstSetup = userAccounts.length === 0;
      const isShared = req.data.isShared && !isFirstSetup;

      if (!isFirstSetup && userAccounts.length >= maxAccounts) {
        throw new ServerError(AccountErrors.MaxAccounts);
      }

      // Fee must be charged from an account the caller is allowed to debit
      const myFromAccount = await this._accountDB.getAuthorizedAccountById(
        req.data.fromAccountId,
        userIdentifier,
        t,
      );
      const sharedFromAccount = await this._sharedAccountDB.getAuthorizedSharedAccountById(
        req.data.fromAccountId,
        userIdentifier,
        [AccountRole.Admin],
        t,
      );
      const fromAccount = myFromAccount ?? sharedFromAccount;

      if (!fromAccount) {
        throw new ServerError(GenericErrors.NotFound);
      }

      const newAccountCost = config?.prices?.newAccount ?? 0;
      const canAfford = fromAccount.getDataValue('balance') >= newAccountCost;
      if (!canAfford && !isFirstSetup) {
        throw new ServerError(BalanceErrors.InsufficentFunds);
      }

      const defaultAccountName = isShared
        ? i18next.t('Shared account')
        : i18next.t('Personal account');

      // Additional accounts always start at 0 (never inherit otherAccountStartBalance free money)
      const account = await this._accountDB.createAccount(
        {
          ...req.data,
          accountName: req.data.accountName ?? defaultAccountName,
          type: isShared ? AccountType.Shared : AccountType.Personal,
          ownerIdentifier: userIdentifier,
          balance: 0,
        },
        t,
      );

      if (isShared) {
        await this._sharedAccountDB.createSharedAccount(
          {
            name: userName,
            accountId: account.getDataValue('id') ?? 0,
            userIdentifier: userIdentifier,
            role: AccountRole.Owner,
          },
          t,
        );
      }

      if (!isFirstSetup && newAccountCost > 0) {
        await this._accountDB.decrement(fromAccount, newAccountCost, t);
        await this._transactionService.handleCreateTransaction(
          {
            amount: newAccountCost,
            message: i18next.t('Opened a new account'),
            fromAccount: fromAccount.toJSON(),
            type: TransactionType.Outgoing,
          },
          t,
          req.source,
        );
      }

      emit(AccountEvents.NewAccountCreated, account.toJSON());

      await t.commit();
      return account.toJSON();
    } catch (e) {
      await t.rollback();
      logger.silly('Failed to create a new account');
      logger.silly(req);
      logger.error(e);
      throw e;
    }
  }

  async handleDeleteAccount(req: Request<{ accountId: number }>) {
    logger.silly('Trying to DELETE account ...');
    logger.silly(req);

    const { accountId } = req.data;

    const t = await sequelize.transaction();
    try {
      const user = this._userService.getUser(req.source);
      const defaultAccount = await this.getDefaultAccountBySource(req.source);

      // TODO #2: Is this the best we can do?
      const deletingAccount = await this._accountDB.getAuthorizedAccountById(
        accountId,
        user.getIdentifier(),
        t,
      );

      // TODO: Implement smarter way of doing this check. Generally you can't access other players accounts.
      if (!deletingAccount) {
        throw new ServerError(GenericErrors.NotFound);
      }

      if (!defaultAccount) {
        throw new ServerError(GenericErrors.MissingDefaultAccount);
      }

      const deletingAccountBalance = deletingAccount.getDataValue('balance');
      if (deletingAccountBalance < 0) {
        throw new ServerError('The balance of the account is too low. It cannot be deleted!');
      }

      await this._transactionService.handleCreateTransaction(
        {
          amount: deletingAccountBalance,
          message: i18next.t('Remaining funds from "{{deletedAccount}}"', {
            deletedAccount: deletingAccount.getDataValue('accountName'),
          }),
          type: TransactionType.Transfer,
          fromAccount: deletingAccount.toJSON(),
          toAccount: defaultAccount.toJSON(),
        },
        t,
      );

      await this._accountDB.increment(defaultAccount, deletingAccountBalance, t);
      await deletingAccount.destroy({ transaction: t, hooks: true });

      /* Delete matching shared accounts */
      /* TODO: This should not be needed via CASCADE .. */
      await this._sharedAccountDB.deleteSharedAccountsByAccountId(accountId);

      emit(AccountEvents.AccountDeleted, deletingAccount.toJSON());
      logger.silly('Successfully deleted account!');
      t.commit();
    } catch (e) {
      t.rollback();
      logger.silly('Failed to delete account');
      logger.silly(req);
      return;
    }

    logger.silly(req);
    return;
  }

  /**
   * Deposition from player. Framework integrated.
   * Will then update whatever player's main bank account in any framework.
   * @param req
   */
  async handleDepositMoney(req: Request<AtmInput>) {
    return this.withSourceMoneyLock(req.source, () => this._handleDepositMoney(req));
  }

  private async _handleDepositMoney(req: Request<AtmInput>) {
    logger.silly(
      `Source "${req.source}" depositing "${req.data.amount}" into "${
        req.data.accountId ?? 'DEFAULT'
      }"`,
    );
    const depositionAmount = assertPositiveMoney(req.data.amount);

    const t = await sequelize.transaction();
    let cashRemoved = false;
    try {
      const targetAccount = req.data.accountId
        ? await this._accountDB.getAccountById(req.data.accountId, t)
        : await this.getDefaultAccountBySource(req.source, t);

      if (!targetAccount) {
        throw new ServerError(GenericErrors.NotFound);
      }

      const userBalance = await this._cashService.getMyCash(req.source);
      const currentAccountBalance = targetAccount.getDataValue('balance');

      if (userBalance < depositionAmount) {
        logger.debug({ userBalance, depositionAmount, currentAccountBalance });
        throw new Error(BalanceErrors.InsufficentFunds);
      }

      await this._cashService.handleRemoveCash(req.source, depositionAmount);
      cashRemoved = true;

      await this._accountDB.increment(targetAccount, depositionAmount, t);

      await this._transactionService.handleCreateTransaction(
        {
          amount: depositionAmount,
          message: req.data.message,
          type: TransactionType.Incoming,
          toAccount: targetAccount.toJSON(),
        },
        t,
        req.source,
      );

      logger.silly(
        `Successfully deposited ${depositionAmount} into account ${targetAccount.getDataValue(
          'id',
        )}`,
      );
      logger.silly({ userBalance, depositionAmount, currentAccountBalance });
      await t.commit();
    } catch (err) {
      await t.rollback();
      if (cashRemoved) {
        try {
          await this._cashService.handleAddCash(req.source, depositionAmount);
        } catch (compensateErr) {
          logger.error(
            `Failed to restore cash after deposit failure for source ${req.source}`,
          );
          logger.error(compensateErr);
        }
      }
      logger.error(`Failed to deposit money into account`);
      logger.error(err);
      throw err;
    }
  }

  async handleWithdrawMoney(req: Request<AtmInput>) {
    return this.withSourceMoneyLock(req.source, () => this._handleWithdrawMoney(req));
  }

  private async _handleWithdrawMoney(req: Request<AtmInput>) {
    const { accountId, amount, cardId, cardPin, requireCard } = req.data;
    logger.silly(`"${req.source}" withdrawing "${amount}".`);

    const withdrawAmount = assertPositiveMoney(amount);

    const t = await sequelize.transaction();
    let bankDebited = false;
    let targetAccountId: number | undefined;
    try {
      const mustUseCard = Boolean(requireCard && isFrameworkIntegrationEnabled && isCardsEnabled);

      if (mustUseCard || (isFrameworkIntegrationEnabled && isCardsEnabled && cardId)) {
        if (mustUseCard && !cardId) {
          throw new ServerError(CardErrors.InvalidPin);
        }

        const exports = getFrameworkExports();
        const cards = exports.getCards(req.source);
        const selectedCard = cards?.find((card) => card.id === cardId);

        if (!selectedCard) {
          throw new Error('User does not have selected card in inventory.');
        }

        const card = await this._cardDB.getById(selectedCard.id);
        if (card?.getDataValue('pin') !== cardPin) {
          throw new Error(CardErrors.InvalidPin);
        }
      }

      const targetAccount = accountId
        ? await this._accountDB.getAccountById(accountId, t)
        : await this.getDefaultAccountBySource(req.source, t);

      if (!targetAccount) {
        throw new ServerError(GenericErrors.NotFound);
      }

      targetAccountId = targetAccount.getDataValue('id');
      const currentAccountBalance = targetAccount.getDataValue('balance');

      if (currentAccountBalance < withdrawAmount) {
        logger.debug({ withdrawAmount, currentAccountBalance });
        throw new Error(BalanceErrors.InsufficentFunds);
      }

      /* Debit bank first so concurrent withdraws cannot all pass the balance check. */
      await this._accountDB.decrement(targetAccount, withdrawAmount, t);

      await this._transactionService.handleCreateTransaction(
        {
          amount: withdrawAmount,
          message: req.data.message,
          type: TransactionType.Outgoing,
          fromAccount: targetAccount.toJSON(),
        },
        t,
        req.source,
      );

      logger.silly(`Withdrew ${withdrawAmount} from account ${accountId}`);
      logger.silly({ withdrawAmount, currentAccountBalance });
      await t.commit();
      bankDebited = true;
    } catch (err) {
      await t.rollback();
      logger.error(`Failed to withdraw money from account.`);
      logger.error(err);
      throw err;
    }

    try {
      await this._cashService.handleAddCash(req.source, withdrawAmount);
    } catch (err) {
      logger.error(
        `Cash grant failed after bank debit for account ${targetAccountId}; compensating.`,
      );
      logger.error(err);

      if (bankDebited && targetAccountId != null) {
        const compensateTx = await sequelize.transaction();
        try {
          const account = await this._accountDB.getAccountById(targetAccountId, compensateTx);
          if (account) {
            await this._accountDB.increment(account, withdrawAmount, compensateTx);
            await this._transactionService.handleCreateTransaction(
              {
                amount: withdrawAmount,
                message: 'Withdraw compensation (cash grant failed)',
                type: TransactionType.Incoming,
                toAccount: account.toJSON(),
              },
              compensateTx,
              req.source,
            );
          }
          await compensateTx.commit();
        } catch (compensateErr) {
          await compensateTx.rollback();
          logger.error(
            `Failed to compensate bank after cash grant failure for account ${targetAccountId}`,
          );
          logger.error(compensateErr);
        }
      }

      throw err;
    }
  }

  async handleSetDefaultAccount(req: Request<{ accountId: number }>) {
    const user = this._userService.getUser(req.source);
    logger.silly(
      `Changing default account for user ${user.getIdentifier()} to accountId ${
        req.data.accountId
      } ...`,
    );

    const t = await sequelize.transaction();
    try {
      const defaultAccount = await this._accountDB.getDefaultAccountByIdentifier(
        user?.getIdentifier() ?? '',
      );
      const newDefaultAccount = await this._accountDB.getAccountById(req.data.accountId);

      if (!newDefaultAccount) {
        throw new ServerError(GenericErrors.NotFound);
      }

      if (newDefaultAccount.getDataValue('type') === AccountType.Shared) {
        throw new Error('Cannot set shared account as default');
      }

      if (defaultAccount?.getDataValue('id') === req.data.accountId) {
        throw new Error('This is already the default account');
      }

      await defaultAccount?.update({ isDefault: false }, { transaction: t });
      await newDefaultAccount.update({ isDefault: true }, { transaction: t });

      t.afterCommit(() => {
        emit(AccountEvents.ChangedDefaultAccount, newDefaultAccount.toJSON());
      });

      t.commit();
      return newDefaultAccount;
    } catch (err) {
      logger.error(`Failed to change default account for ${user?.getIdentifier()}`);
      logger.error(err);

      t.rollback();
    }

    logger.silly(`Successfully changed default account to ${req.data.accountId}`);
    logger.silly({ accountId: req.data.accountId, userId: user?.getIdentifier() });
  }

  async handleRenameAccount(req: Request<RenameAccountInput>) {
    logger.silly(`Updating name, accountID: ${req.data.accountId}, name: ${req.data.name}`);
    const account = await this._accountDB.getAccountById(req.data.accountId);
    await account?.update({ accountName: req.data.name });
    return await account?.save();
  }

  async getUsersFromShared(req: Request<{ accountId: number }>): Promise<SharedAccountUser[]> {
    const sharedAccounts = await this._sharedAccountDB.getSharedAccountsById(req.data.accountId);
    return sharedAccounts.map((account) => ({
      name: account.getDataValue('name'),
      role: account.getDataValue('role'),
      userIdentifier: account.getDataValue('userIdentifier'),
    }));
  }

  async getAuthorizedAccount(source: number, accountId: number): Promise<AccountModel | null> {
    const user = this._userService.getUser(source);
    const account = await this._accountDB.getAuthorizedAccountById(accountId, user.getIdentifier());

    if (!account) {
      throw new ServerError(AuthorizationErrors.Forbidden);
    }

    return account;
  }

  async addMoney(req: Request<UpdateBankBalanceInput>) {
    logger.silly(`Adding money to ${req.source} ..`);
    const { amount, message, fromIdentifier } = req.data;

    if (amount <= 0) {
      throw new ServerError(GenericErrors.BadInput);
    }

    const user = this._userService.getUser(req.source);
    const t = await sequelize.transaction();

    try {
      let fromAccount = undefined;
      const account = await this._accountDB.getDefaultAccountByIdentifier(user.getIdentifier());

      if (!account) {
        throw new ServerError(GenericErrors.NotFound);
      }

      if (fromIdentifier) {
        logger.silly(`Adding money from ${fromIdentifier} ..`);
        fromAccount = await this._accountDB.getDefaultAccountByIdentifier(fromIdentifier);
        if (!fromAccount) {
          throw new ServerError(GenericErrors.NotFound);
        }
        await this._accountDB.decrement(fromAccount, amount, t);
      }
      await this._accountDB.increment(account, amount, t);

      const tx = {
        amount,
        message,
        fromAccount: fromAccount?.toJSON(),
        toAccount: account?.toJSON(),
      };
      // Dual rows so both source and destination appear in account histories
      if (fromAccount) {
        await this._transactionService.handleCreateTransaction(
          { ...tx, type: TransactionType.Outgoing },
          t,
        );
      }
      await this._transactionService.handleCreateTransaction(
        { ...tx, type: TransactionType.Incoming },
        t,
      );
      t.commit();
    } catch (err) {
      t.rollback();
      throw err;
    }
  }

  async addMoneyByIdentifier(req: Request<UpdateBankBalanceInput>) {
    logger.silly(`Adding money by identifier to ${req.data.identifier} ..`);
    const { amount, message, identifier, fromIdentifier } = req.data;
    if (amount <= 0) {
      throw new ServerError(GenericErrors.BadInput);
    }

    const t = await sequelize.transaction();
    try {
      let fromAccount = undefined;
      const account = await this._accountDB.getDefaultAccountByIdentifier(identifier ?? '');

      if (!account) {
        throw new ServerError(GenericErrors.NotFound);
      }

      if (fromIdentifier) {
        logger.silly(`Adding money from ${fromIdentifier} ..`);
        fromAccount = await this._accountDB.getDefaultAccountByIdentifier(fromIdentifier);
        if (!fromAccount) {
          throw new ServerError(GenericErrors.NotFound);
        }
        await this._accountDB.decrement(fromAccount, amount, t);
      }

      await this._accountDB.increment(account, amount, t);

      const tx = {
        amount,
        message,
        fromAccount: fromAccount?.toJSON(),
        toAccount: account?.toJSON(),
      };
      if (fromAccount) {
        await this._transactionService.handleCreateTransaction(
          { ...tx, type: TransactionType.Outgoing },
          t,
        );
      }
      await this._transactionService.handleCreateTransaction(
        { ...tx, type: TransactionType.Incoming },
        t,
      );
      t.commit();
    } catch (err) {
      t.rollback();
      throw err;
    }
  }

  async addMoneyByNumber(req: Request<UpdateBankBalanceByNumberInput>) {
    const { amount, accountNumber, message } = req.data;
    logger.silly(`Adding money by account number to ${accountNumber} ..`);
    if (amount <= 0) {
      throw new ServerError(GenericErrors.BadInput);
    }

    const t = await sequelize.transaction();
    try {
      const account = await this._accountDB.getAccountByNumber(accountNumber ?? '');

      if (!account) {
        throw new ServerError(GenericErrors.NotFound);
      }

      await this._accountDB.increment(account, amount, t);
      await this._transactionService.handleCreateTransaction(
        {
          amount,
          message,
          toAccount: account?.toJSON(),
          type: TransactionType.Incoming,
        },
        t,
      );
      t.commit();
    } catch (err) {
      t.rollback();
    }
  }

  async removeMoney(req: Request<UpdateBankBalanceInput>) {
    const { amount, message, toIdentifier } = req.data;
    logger.silly(`Removing ${amount} money from ${req.source}...`);

    if (amount <= 0) {
      throw new ServerError(GenericErrors.BadInput);
    }

    const user = this._userService.getUser(req.source);

    const t = await sequelize.transaction();
    try {
      let toAccount = undefined;
      const account = await this._accountDB.getDefaultAccountByIdentifier(user.getIdentifier());
      if (!account) {
        throw new ServerError(GenericErrors.NotFound);
      }

      if (toIdentifier) {
        logger.silly(`Adding money to ${toIdentifier} ..`);
        toAccount = await this._accountDB.getDefaultAccountByIdentifier(toIdentifier);
        if (!toAccount) {
          throw new ServerError(GenericErrors.NotFound);
        }
        // Credit the destination (previously incorrectly decremented)
        await this._accountDB.increment(toAccount, amount, t);
      }

      await account.update(
        {
          balance: account.getDataValue('balance') - amount,
        },
        { transaction: t },
      );

      const tx = {
        amount,
        message,
        fromAccount: account?.toJSON(),
        toAccount: toAccount?.toJSON(),
      };
      await this._transactionService.handleCreateTransaction(
        { ...tx, type: TransactionType.Outgoing },
        t,
      );
      if (toAccount) {
        await this._transactionService.handleCreateTransaction(
          { ...tx, type: TransactionType.Incoming },
          t,
        );
      }
      t.commit();
    } catch (err) {
      t.rollback();
      throw err;
    }
  }

  async removeMoneyByIdentifier(req: Request<UpdateBankBalanceInput>) {
    const { amount, identifier, message, toIdentifier } = req.data;
    logger.silly(`Removing ${amount} money by identifier from ${identifier} ..`);

    if (amount <= 0) {
      throw new ServerError(GenericErrors.BadInput);
    }

    const t = await sequelize.transaction();
    try {
      let toAccount = undefined;
      const account = await this._accountDB.getDefaultAccountByIdentifier(identifier ?? '');
      if (!account) {
        throw new ServerError(GenericErrors.NotFound);
      }

      if (toIdentifier) {
        logger.silly(`Adding money to ${toIdentifier} ..`);
        toAccount = await this._accountDB.getDefaultAccountByIdentifier(toIdentifier);
        if (!toAccount) {
          throw new ServerError(GenericErrors.NotFound);
        }
        // Credit the destination (previously incorrectly decremented)
        await this._accountDB.increment(toAccount, amount, t);
      }

      await this._accountDB.decrement(account, amount, t);

      const tx = {
        amount,
        message,
        fromAccount: account?.toJSON(),
        toAccount: toAccount?.toJSON(),
      };
      await this._transactionService.handleCreateTransaction(
        { ...tx, type: TransactionType.Outgoing },
        t,
      );
      if (toAccount) {
        await this._transactionService.handleCreateTransaction(
          { ...tx, type: TransactionType.Incoming },
          t,
        );
      }
      t.commit();
    } catch (err) {
      t.rollback();
      throw err;
    }
  }

  async removeMoneyByAccountNumber(req: Request<UpdateBankBalanceByNumberInput>) {
    const { amount, accountNumber, message } = req.data;
    logger.silly(
      `Removing ${req.data.amount} money by account number from ${req.data.accountNumber} ..`,
    );

    if (amount <= 0) {
      throw new ServerError(GenericErrors.BadInput);
    }

    const t = await sequelize.transaction();
    try {
      const account = await this._accountDB.getAccountByNumber(accountNumber ?? '');
      if (!account) {
        throw new ServerError(GenericErrors.NotFound);
      }

      await this._accountDB.decrement(account, amount, t);
      await this._transactionService.handleCreateTransaction(
        {
          amount,
          message,
          fromAccount: account?.toJSON(),
          type: TransactionType.Outgoing,
        },
        t,
      );
      t.commit();
    } catch {
      t.rollback();
    }
  }

  async setMoney(req: Request<{ amount: number; message?: string }>) {
    const { amount, message } = req.data;
    logger.silly(`Setting money to ${amount} for ${req.source} ..`);

    if (amount < 0) {
      throw new ServerError(GenericErrors.BadInput);
    }

    const user = this._userService.getUser(req.source);
    const account = await this._accountDB.getDefaultAccountByIdentifier(user.getIdentifier());
    if (!account) {
      throw new ServerError(GenericErrors.NotFound);
    }

    await this.applyAbsoluteBalance(account, amount, message ?? 'Balance adjustment');
  }

  async setMoneyByIdentifier(
    req: Request<{ amount: number; identifier: string; message?: string }>,
  ) {
    const { amount, identifier, message } = req.data;
    logger.silly(`Setting money by identifier to ${amount} for ${identifier} ..`);

    if (amount < 0) {
      throw new ServerError(GenericErrors.BadInput);
    }

    const account = await this._accountDB.getDefaultAccountByIdentifier(identifier);
    if (!account) {
      throw new ServerError(GenericErrors.NotFound);
    }

    await this.applyAbsoluteBalance(account, amount, message ?? 'Balance adjustment');
  }

  /** Absolute balance overwrite with a ledger row for the delta. */
  private async applyAbsoluteBalance(account: AccountModel, amount: number, message: string) {
    const previous = account.getDataValue('balance') ?? 0;
    const delta = amount - previous;

    const t = await sequelize.transaction();
    try {
      await account.update({ balance: amount }, { transaction: t });

      if (delta !== 0) {
        const abs = Math.abs(delta);
        const isIncrease = delta > 0;
        await this._transactionService.handleCreateTransaction(
          {
            amount: abs,
            message,
            ...(isIncrease
              ? { toAccount: account.toJSON(), type: TransactionType.Incoming }
              : { fromAccount: account.toJSON(), type: TransactionType.Outgoing }),
          },
          t,
          undefined,
          {
            oldBalance: previous,
            newBalance: amount,
            ...(isIncrease
              ? { toOldBalance: previous, toNewBalance: amount }
              : { fromOldBalance: previous, fromNewBalance: amount }),
          },
        );
      }

      t.commit();
    } catch (err) {
      t.rollback();
      throw err;
    }
  }

  async createUniqueAccount(req: Request<CreateBasicAccountInput>) {
    logger.debug('Creating unique account ..');

    const { identifier, name, type } = req.data;

    const existingAccount = await this._accountDB.getAccountsByIdentifier(req.data.identifier);

    if (existingAccount.length > 0) {
      logger.debug('Unique account already exists, not creating another one.');
      throw new ServerError(AccountErrors.AlreadyExists);
    }

    const account = await this._accountDB.createAccount({
      type,
      accountName: name,
      ownerIdentifier: identifier,
    });

    const json = account.toJSON();
    logger.debug('Created unique account!');
    logger.debug(json);
    return json;
  }

  async addUserToUniqueAccount(req: Request<AddToUniqueAccountInput>) {
    logger.debug('Adding user to unique account ..');

    const { accountIdentifier: identifier, source, userIdentifier, role } = req.data;

    if (!userIdentifier && !source) {
      logger.error('Missing userIdentifier or source. Cannot remove user.');
      throw new ServerError(GenericErrors.BadInput);
    }

    const user = userIdentifier
      ? this._userService.getUserByIdentifier(userIdentifier)
      : this._userService.getUser(source ?? 0);

    if (!user) {
      throw new ServerError(UserErrors.NotFound);
    }

    const existingAccount = await this._accountDB.getUniqueAccountByIdentifier(identifier);
    if (!existingAccount) {
      throw new ServerError(AccountErrors.NotFound);
    }

    const t = await sequelize.transaction();
    try {
      const sharedAccount = await this._sharedAccountDB.getSharedAccountByIds(
        userIdentifier ?? user.getIdentifier(),
        existingAccount.getDataValue('id'),
      );

      if (sharedAccount) {
        logger.debug('User already exists in shared account. (You can safely ignore this)');
        return;
      }

      const account = await this._sharedAccountDB.createSharedAccount(
        {
          role,
          name: user?.name ?? 'Unknown',
          userIdentifier: userIdentifier ?? '',
          accountId: existingAccount.getDataValue('id'),
        },
        t,
      );

      t.afterCommit(() => {
        emit(Broadcasts.NewSharedUser, account.toJSON());
        emitNet(Broadcasts.NewSharedUser, user?.getSource(), account.toJSON());
      });

      t.commit();
      return account;
    } catch (err) {
      t.rollback();
      logger.error('Failed to add user to unique account');
    }
  }

  async removeUserFromUniqueAccount(req: Request<RemoveFromUniqueAccountInput>) {
    logger.debug('Removing user from unique account ..');

    const { accountIdentifier, source, userIdentifier } = req.data;

    if (!userIdentifier && !source) {
      logger.error('Missing userIdentifier or source. Cannot remove user.');
      throw new ServerError(GenericErrors.BadInput);
    }

    const user = userIdentifier
      ? this._userService.getUserByIdentifier(userIdentifier)
      : this._userService.getUser(source ?? 0);

    if (!user) {
      throw new ServerError(UserErrors.NotFound);
    }

    const existingAccount = await this._accountDB.getUniqueAccountByIdentifier(accountIdentifier);
    if (!existingAccount) {
      logger.error('Missing account');
      throw new ServerError(AccountErrors.NotFound);
    }

    const t = await sequelize.transaction();
    try {
      const sharedAccount = await this._sharedAccountDB.getSharedAccountByIds(
        userIdentifier ?? user.getIdentifier(),
        existingAccount.getDataValue('id'),
      );

      if (!sharedAccount) {
        logger.error('Missing shared account.');
        throw new ServerError(AccountErrors.NotFound);
      }

      this.removeUserFromShared({
        source: source ?? 0,
        data: {
          identifier: userIdentifier ?? user.getIdentifier(),
          accountId: sharedAccount?.getDataValue('accountId') ?? 0,
        },
      });

      t.afterCommit(() => {
        emit(Broadcasts.RemovedSharedUser, sharedAccount?.toJSON());
        emitNet(Broadcasts.RemovedSharedUser, user?.getSource(), sharedAccount.toJSON());
      });

      t.commit();
      return sharedAccount;
    } catch (err) {
      t.rollback();
      logger.error('Failed to remove user from unique account');
    }
  }

  async getBankBalanceByIdentifier(identifier: string) {
    const account = await this._accountDB.getDefaultAccountByIdentifier(identifier ?? '');
    if (!account) {
      throw new ServerError(GenericErrors.NotFound);
    }
    return account.getDataValue('balance');
  }
}
