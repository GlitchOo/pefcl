import { singleton } from 'tsyringe';
import { Request } from '@typings/http';
import {
  CreateTransferInput,
  GetTransactionHistoryResponse,
  GetTransactionsInput,
  GetTransactionsResponse,
  TransactionInput,
  TransactionType,
  TransferType,
} from '@typings/Transaction';
import { sequelize } from '@server/utils/pool';
import { mainLogger } from '@server/sv_logger';
import { UserService } from '../user/user.service';
import { AccountDB } from '../account/account.db';
import { TransactionDB } from './transaction.db';
import { TransactionModel } from './transaction.model';
import { ExternalAccountService } from '@services/accountExternal/externalAccount.service';
import { ServerError } from '@utils/errors';
import { BalanceErrors, GenericErrors } from '@typings/Errors';
import { AccountRole } from '@typings/Account';
import { MS_ONE_WEEK } from '@utils/constants';
import { TransactionEvents } from '@typings/Events';
import { SharedAccountDB } from '../accountShared/sharedAccount.db';
import { Transaction as SequelizeTransaction } from 'sequelize/types';
import { logTransactionCreated, BalanceSnapshot } from '@server/utils/oxLogger';
import { assertPositiveMoney } from '@server/utils/money';

const logger = mainLogger.child({ module: 'transactionService' });

@singleton()
export class TransactionService {
  _accountDB: AccountDB;
  _sharedAccountDB: SharedAccountDB;
  _transactionDB: TransactionDB;
  _userService: UserService;
  _externalAccountService: ExternalAccountService;

  constructor(
    transactionDB: TransactionDB,
    userService: UserService,
    accountDB: AccountDB,
    sharedAccountDB: SharedAccountDB,
    externalAccountService: ExternalAccountService,
  ) {
    this._transactionDB = transactionDB;
    this._userService = userService;
    this._accountDB = accountDB;
    this._sharedAccountDB = sharedAccountDB;
    this._externalAccountService = externalAccountService;
  }

  private async getMyTransactions(req: Request<GetTransactionsInput>) {
    logger.silly('Getting transactions');
    logger.silly(req);

    const user = this._userService.getUser(req.source);
    const accounts = await this._accountDB.getAccountsByIdentifier(user.getIdentifier());
    const sharedAccounts = await this._sharedAccountDB.getSharedAccountsByIdentifier(
      user.getIdentifier(),
    );

    const sharedAccountIds = sharedAccounts.map(
      (account) => account.getDataValue('accountId') ?? 0,
    );
    const accountIds = accounts.map((account) => account.getDataValue('id') ?? 0);
    const allAccountIds = [...sharedAccountIds, ...accountIds];

    // When accountId is specified, filter to that account only (must be one the user has access to)
    const effectiveAccountIds =
      req.data.accountId && allAccountIds.includes(req.data.accountId)
        ? [req.data.accountId]
        : allAccountIds;

    const transactions = await this._transactionDB.getTransactionFromAccounts({
      ...req.data,
      accountIds: effectiveAccountIds,
    });

    const total = await this._transactionDB.getTotalTransactionsFromAccounts(effectiveAccountIds);

    logger.silly('Returned total of ' + total + ' transactions.');

    return {
      total: total,
      offset: req.data.offset,
      limit: req.data.limit,
      transactions: transactions,
    };
  }

  async handleGetMyTransactions(
    req: Request<GetTransactionsInput>,
  ): Promise<GetTransactionsResponse> {
    const data = await this.getMyTransactions(req);
    return {
      ...data,
      transactions: data.transactions.map((transaction) => transaction.toJSON()),
    };
  }

  private async handleInternalTransfer(req: Request<CreateTransferInput>) {
    logger.silly('Creating internal transfer');
    logger.silly(req);

    const user = this._userService.getUser(req.source);
    const identifier = user.getIdentifier();
    const { fromAccountId, toAccountId, amount, message } = req.data;
    const transferAmount = assertPositiveMoney(amount);

    const t = await sequelize.transaction();
    try {
      const myAccount = await this._accountDB.getAuthorizedAccountById(
        fromAccountId,
        identifier,
        t,
      );
      const sharedAccount = await this._sharedAccountDB.getAuthorizedSharedAccountById(
        fromAccountId,
        identifier,
        [AccountRole.Admin],
        t,
      );

      const fromAccount = myAccount ?? sharedAccount;
      const toAccount = await this._accountDB.getAccountById(toAccountId);

      if (!toAccount || !fromAccount) {
        throw new ServerError(GenericErrors.NotFound);
      }

      if (fromAccount.getDataValue('balance') < transferAmount) {
        throw new ServerError(BalanceErrors.InsufficentFunds);
      }

      await this._accountDB.transfer({
        amount: transferAmount,
        fromAccount,
        toAccount,
        transaction: t,
      });
      await this.handleCreateTransaction(
        {
          amount: transferAmount,
          message: message,
          toAccount: toAccount.toJSON(),
          type: TransactionType.Transfer,
          fromAccount: fromAccount.toJSON(),
        },
        t,
        req.source,
      );

      t.commit();
    } catch (e) {
      t.rollback();
      logger.silly('Failed to create internal transfer');
      logger.silly(e);
      throw e;
    }
  }

  private async handleExternalTransfer(req: Request<CreateTransferInput>) {
    const amount = assertPositiveMoney(req.data.amount);

    const user = this._userService.getUser(req.source);
    const identifier = user.getIdentifier();

    const t = await sequelize.transaction();
    try {
      const myAccount = await this._accountDB.getAuthorizedAccountById(
        req.data.fromAccountId,
        identifier,
        t,
      );
      const sharedAccount = await this._sharedAccountDB.getAuthorizedSharedAccountById(
        req.data.fromAccountId,
        identifier,
        [AccountRole.Admin],
        t,
      );

      const fromAccount = myAccount ?? sharedAccount;
      const toAccount = await this._externalAccountService.getAccountFromExternalAccount(
        req.data.toAccountId,
        t,
        identifier,
      );

      if (!toAccount || !fromAccount) {
        throw new ServerError(GenericErrors.NotFound);
      }

      if (fromAccount.getDataValue('balance') < amount) {
        throw new ServerError(BalanceErrors.InsufficentFunds);
      }

      await this._accountDB.transfer({ amount, fromAccount, toAccount, transaction: t });

      /*  Since this is a external "transfer", it's not actually a TransactionType.Transfer.
          But a seperate TransactionType.Incoming & TransactionType.Outgoing.
          
          For the person initializing the transfer, this is Outgoing.
      */

      const data = {
        amount,
        message: req.data.message,
        toAccount: toAccount.toJSON(),
        fromAccount: fromAccount.toJSON(),
      };
      await this.handleCreateTransaction({ ...data, type: TransactionType.Outgoing }, t, req.source);
      await this.handleCreateTransaction({ ...data, type: TransactionType.Incoming }, t, req.source);

      t.commit();
    } catch (e) {
      t.rollback();
      logger.silly('Failed to create external transfer');
      logger.silly(e);
      throw e;
    }
  }

  async handleTransfer(req: Request<CreateTransferInput>) {
    logger.debug(
      `Transfering ${req.data.amount} from account ${req.data.fromAccountId} to ${req.data.toAccountId} ...`,
    );

    const isExternalTransfer = req.data.type === TransferType.External;
    if (isExternalTransfer) {
      return await this.handleExternalTransfer(req);
    }

    return await this.handleInternalTransfer(req);
  }

  async handleCreateTransaction(
    input: TransactionInput,
    sequelizeTransaction: SequelizeTransaction,
    source?: number,
    balances?: BalanceSnapshot,
  ): Promise<TransactionModel | null> {
    logger.silly(`Created transaction.`);
    logger.silly(input);

    const transaction = await this._transactionDB.create(input, sequelizeTransaction);

    sequelizeTransaction.afterCommit(() => {
      logger.silly(`Emitting ${TransactionEvents.NewTransaction}`);
      emit(TransactionEvents.NewTransaction, { ...input, ...transaction.toJSON() });
      logTransactionCreated(source, input, balances);
    });

    return transaction;
  }

  async handleGetHistory(req: Request<void>): Promise<GetTransactionHistoryResponse> {
    const user = this._userService.getUser(req.source);
    const accounts = await this._accountDB.getAccountsByIdentifier(user.getIdentifier());

    const from = new Date(Date.now() - MS_ONE_WEEK);
    const accountIds = accounts.map((account) => account.getDataValue('id') ?? 0);
    const transactions = await this._transactionDB.getAllTransactionsFromAccounts(accountIds, from);

    const expenses = transactions.reduce((prev, curr) => {
      const type = curr.getDataValue('type');
      const amount = curr.getDataValue('amount');
      return type === TransactionType.Outgoing ? prev - amount : prev;
    }, 0);

    const income = transactions.reduce((prev, curr) => {
      const type = curr.getDataValue('type');
      const amount = curr.getDataValue('amount');
      return type === TransactionType.Incoming ? prev + amount : prev;
    }, 0);

    const lastWeek = transactions.reduce((prev, curr) => {
      const date = new Date(curr.getDataValue('createdAt') ?? '');
      const type = curr.getDataValue('type');
      const amount = curr.getDataValue('amount');
      const isIncoming = type === TransactionType.Incoming;
      const isOutgoing = type === TransactionType.Outgoing;

      const localeDate = date.toDateString();

      const { income = 0, expenses = 0 } = prev[localeDate] ?? {};
      const newIncome = isIncoming ? income + amount : income;
      const newExpenses = isOutgoing ? expenses - amount : expenses;

      return {
        ...prev,
        [localeDate]: {
          income: newIncome,
          expenses: newExpenses,
        },
      };
    }, {} as Record<string, { income: number; expenses: number }>);

    return {
      income,
      lastWeek,
      expenses: expenses,
    };
  }
}
