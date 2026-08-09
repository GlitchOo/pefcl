import { singleton } from 'tsyringe';
import { config } from '@utils/server-config';
import { mainLogger } from '../../sv_logger';
import { UserService } from '../user/user.service';
import { Request } from '@typings/http';
import { CardDB } from './card.db';
import { sequelize } from '@server/utils/pool';
import { AccountService } from '../account/account.service';
import {
  AuthorizationErrors,
  BalanceErrors,
  CardErrors,
  GenericErrors,
  UserErrors,
} from '@server/../../typings/Errors';
import i18next from '@utils/i18n';
import {
  BlockCardInput,
  Card,
  CreateCardInput,
  InventoryCard,
  UpdateCardPinInput,
  DeleteCardInput,
} from '@server/../../typings/BankCard';
import { AccountDB } from '../account/account.db';
import { PIN_CODE_LENGTH } from '@shared/constants';
import { GetAtmAccountResponse, GetAtmAccountInput } from '@server/../../typings/Account';
import { CardEvents } from '@server/../../typings/Events';
import { getFrameworkExports, isFrameworkIntegrationActive } from '@server/utils/frameworkIntegration';
import { AuthService } from '@services/auth/auth.service';
import { AccountRole } from '@typings/Account';
import { TransactionService } from '../transaction/transaction.service';
import { TransactionType } from '@typings/Transaction';

const logger = mainLogger.child({ module: 'card' });
const isFrameworkIntegrationEnabled = isFrameworkIntegrationActive();

const stripPin = <T extends { pin?: unknown }>(card: T): Omit<T, 'pin'> => {
  const { pin: _pin, ...safe } = card;
  return safe;
};

@singleton()
export class CardService {
  cardDB: CardDB;
  accountDB: AccountDB;
  userService: UserService;
  accountService: AccountService;
  authService: AuthService;
  transactionService: TransactionService;

  constructor(
    CardDB: CardDB,
    userService: UserService,
    accountService: AccountService,
    accountDB: AccountDB,
    authService: AuthService,
    transactionService: TransactionService,
  ) {
    this.cardDB = CardDB;
    this.accountDB = accountDB;
    this.userService = userService;
    this.accountService = accountService;
    this.authService = authService;
    this.transactionService = transactionService;
  }

  validateCardsConfig() {
    if (!isFrameworkIntegrationEnabled) {
      logger.error('Could not give card to player.');
      throw new Error('Phsyical cards are not available without FrameworkIntegration enabled.');
    }

    if (!config.frameworkIntegration?.isCardsEnabled) {
      logger.error('Cards are not enabled in the config.');
      throw new Error('Cards are not enabled in the config.');
    }
  }

  async getCards(req: Request<{ accountId: number }>) {
    await this.authService.isAuthorizedAccount(req.data.accountId, req.source, [
      AccountRole.Admin,
      AccountRole.Contributor,
      AccountRole.Owner,
    ]);

    const cards = await this.cardDB.getByAccountId(req.data.accountId);
    return cards.map((card) => stripPin(card.toJSON()));
  }

  async getInventoryCards(req: Request): Promise<InventoryCard[]> {
    this.validateCardsConfig();

    const user = this.userService.getUser(req.source);

    if (!user) {
      throw new Error(UserErrors.NotFound);
    }

    const exports = getFrameworkExports();
    return exports.getCards(user.getSource());
  }

  async getAccountByCard(req: Request<GetAtmAccountInput>): Promise<GetAtmAccountResponse> {
    this.validateCardsConfig();

    logger.silly('Getting account by card.');

    const { cardId, pin } = req.data;
    const card = await this.cardDB.getById(cardId);

    if (!card) {
      logger.error('Card not found');
      throw new Error(GenericErrors.NotFound);
    }

    if (card.getDataValue('isBlocked')) {
      logger.error('The card is blocked');
      throw new Error(CardErrors.Blocked);
    }

    if (pin !== card.getDataValue('pin')) {
      logger.error('Invalid pin');
      throw new Error(CardErrors.InvalidPin);
    }

    const exports = getFrameworkExports();
    const inventoryCards = exports.getCards(req.source) ?? [];
    const inInventory = inventoryCards.some((c) => c.id === cardId);
    if (!inInventory) {
      throw new Error(AuthorizationErrors.Forbidden);
    }

    const account = await this.accountDB.getAccountById(card.getDataValue('accountId') ?? -1);

    if (!account) {
      logger.error('Card is not bound to any account');
      throw new Error(GenericErrors.NotFound);
    }

    return { account: account.toJSON(), card: stripPin(card.toJSON()) as Card };
  }

  async giveCard(src: number, card: Card) {
    this.validateCardsConfig();

    const exports = getFrameworkExports();
    return exports.giveCard(src, card);
  }

  async blockCard(req: Request<BlockCardInput>) {
    this.validateCardsConfig();
    logger.silly('Blocking card ..');
    logger.silly(req.data);

    const user = this.userService.getUser(req.source);
    const { cardId } = req.data;

    const t = await sequelize.transaction();
    const card = await this.cardDB.getById(cardId, t);

    if (card?.getDataValue('holderCitizenId') !== user.getIdentifier()) {
      throw new Error(AuthorizationErrors.Forbidden);
    }

    if (!card) {
      throw new Error(GenericErrors.NotFound);
    }

    try {
      await card.update({ isBlocked: true });
      t.commit();
      logger.silly('Blocked card.');
      return true;
    } catch (error: unknown) {
      t.rollback();
      logger.error(error);
      return false;
    }
  }

  async deleteCard(req: Request<DeleteCardInput>) {
    this.validateCardsConfig();
    logger.silly('Deleting card ..');
    logger.silly(req.data);
    const user = this.userService.getUser(req.source);
    const { cardId } = req.data;

    const t = await sequelize.transaction();
    const card = await this.cardDB.getById(cardId, t);

    if (card?.getDataValue('holderCitizenId') !== user.getIdentifier()) {
      throw new Error(AuthorizationErrors.Forbidden);
    }

    if (!card) {
      throw new Error(GenericErrors.NotFound);
    }

    try {
      await card.destroy();
      t.commit();
      logger.silly('Deleted card.');
      return true;
    } catch (error: unknown) {
      t.rollback();
      logger.error(error);
      return false;
    }
  }

  async updateCardPin(req: Request<UpdateCardPinInput>): Promise<boolean> {
    this.validateCardsConfig();
    logger.silly('Updating pin for card ..');
    logger.silly(req.data);

    const user = this.userService.getUser(req.source);
    const { cardId, newPin } = req.data;

    const t = await sequelize.transaction();
    const card = await this.cardDB.getById(cardId, t);

    if (card?.getDataValue('holderCitizenId') !== user.getIdentifier()) {
      throw new Error(AuthorizationErrors.Forbidden);
    }

    if (!card) {
      throw new Error(GenericErrors.NotFound);
    }

    try {
      await card.update({ pin: newPin }, { transaction: t });
      t.commit();
      logger.silly('Updated pin.');
      return true;
    } catch (error) {
      logger.error(error);
      t.rollback();
      return false;
    }
  }

  async orderPersonalCard(req: Request<CreateCardInput>): Promise<Card | null> {
    this.validateCardsConfig();
    logger.silly('Ordering new card ..');
    logger.silly(req.data);

    const user = this.userService.getUser(req.source);
    const { accountId, paymentAccountId, pin } = req.data;

    const newCardCost = config.cards?.cost;

    if (!newCardCost) {
      logger.error('Missing "cards.cost" in config.json');
      throw new Error(CardErrors.MissingConfigCost);
    }

    if (pin.toString().length !== PIN_CODE_LENGTH) {
      logger.error('Pin is wrong length, should be: ' + PIN_CODE_LENGTH);
      throw new Error(GenericErrors.BadInput);
    }

    const t = await sequelize.transaction();
    try {
      const account = await this.accountService.getAuthorizedAccount(req.source, accountId);
      const paymentAccount = await this.accountService.getAuthorizedAccount(
        req.source,
        paymentAccountId,
      );

      if (!account || !paymentAccount) {
        throw new Error(GenericErrors.NotFound);
      }

      if (paymentAccount.getDataValue('balance') < newCardCost) {
        throw new Error(BalanceErrors.InsufficentFunds);
      }

      // Charge inside the same transaction — calling removeMoneyByAccountNumber here
      // opened a nested TX that deadlocked against this one (lock wait = multi-second hang).
      await this.accountDB.decrement(paymentAccount, newCardCost, t);
      await this.transactionService.handleCreateTransaction(
        {
          amount: newCardCost,
          message: i18next.t('Ordered new card'),
          fromAccount: paymentAccount.toJSON(),
          type: TransactionType.Outgoing,
        },
        t,
        req.source,
      );

      const card = await this.cardDB.create(
        {
          pin: pin,
          holder: user.name,
          holderCitizenId: user.getIdentifier(),
          accountId: account.getDataValue('id'),
        },
        t,
      );

      const cardJson = stripPin(card.toJSON()) as Card;

      t.afterCommit(() => {
        logger.silly(`Emitting ${CardEvents.NewCard}`);
        emit(CardEvents.NewCard, { ...cardJson });
      });

      await t.commit();

      // Inventory give after commit so we don't hold DB locks during framework calls
      await this.giveCard(req.source, cardJson);

      logger.silly('Ordered new card.');
      return cardJson;
    } catch (error: unknown) {
      logger.error(error);
      await t.rollback();
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(i18next.t('Failed to create new account'));
    }
  }
}
