import { singleton } from 'tsyringe';
import { Request } from '../../../../typings/http';
import {
  CreateInvoiceInput,
  GetInvoicesInput,
  InvoiceStatus,
  PayInvoiceInput,
} from '../../../../typings/Invoice';
import { sequelize } from '../../utils/pool';
import { mainLogger } from '../../sv_logger';
import { UserService } from '../user/user.service';
import { AccountDB } from '../account/account.db';
import { TransactionDB } from '../transaction/transaction.db';
import { InvoiceDB } from './invoice.db';
import i18n from '@utils/i18n';
import { TransactionType } from '@typings/Transaction';
import { ServerError } from '@utils/errors';
import {
  AccountErrors,
  AuthorizationErrors,
  BalanceErrors,
  GenericErrors,
} from '@typings/Errors';
import { TransactionService } from '../transaction/transaction.service';
import { Broadcasts } from '@server/../../typings/Events';
import { SharedAccountDB } from '../accountShared/sharedAccount.db';
import { AccountRole } from '@typings/Account';
import { assertPositiveMoney } from '@server/utils/money';

const logger = mainLogger.child({ module: 'invoice-service' });

@singleton()
export class InvoiceService {
  _accountDB: AccountDB;
  _invoiceDB: InvoiceDB;
  _transactionDB: TransactionDB;
  _userService: UserService;
  _sharedAccountDB: SharedAccountDB;
  transactionService: TransactionService;

  constructor(
    userService: UserService,
    invoiceDB: InvoiceDB,
    accountDB: AccountDB,
    transactionDB: TransactionDB,
    transactionService: TransactionService,
    sharedAccountDB: SharedAccountDB,
  ) {
    this._userService = userService;
    this._invoiceDB = invoiceDB;
    this._accountDB = accountDB;
    this._transactionDB = transactionDB;
    this.transactionService = transactionService;
    this._sharedAccountDB = sharedAccountDB;
  }

  async countUnpaidInvoices(source: number) {
    const user = this._userService.getUser(source);
    const total = await this._invoiceDB.getUnpaidInvoicesCount(user.getIdentifier());
    return total;
  }

  async countTotalInvoices(source: number) {
    const user = this._userService.getUser(source);
    const total = await this._invoiceDB.getReceivedInvoicesCount(user.getIdentifier());
    return total;
  }

  async getAllInvoicesBySource(req: Request<GetInvoicesInput>) {
    logger.silly('Fetching user invoices ..');
    const user = this._userService.getUser(req.source);
    const invoices = await this._invoiceDB.getAllReceivingInvoices(user.getIdentifier(), req.data);
    const total = await this.countTotalInvoices(req.source);
    const totalUnpaid = await this.countUnpaidInvoices(req.source);

    return {
      total,
      totalUnpaid: totalUnpaid,
      invoices: invoices.map((invoice) => invoice.toJSON()),
    };
  }

  async createInvoice(data: CreateInvoiceInput) {
    logger.silly('Creating invoice ..');
    logger.silly(data);

    assertPositiveMoney(data.amount);

    const invoice = await this._invoiceDB.createInvoice(data);
    logger.silly('Created invoice.');

    const toUser = this._userService.getUserByIdentifier(data.toIdentifier);
    const fromUser = this._userService.getUserByIdentifier(data.fromIdentifier);

    toUser && emitNet(Broadcasts.NewInvoice, toUser.getSource(), invoice.dataValues, true);
    fromUser && emitNet(Broadcasts.NewInvoice, fromUser.getSource(), invoice.dataValues, false);

    return invoice;
  }

  async payInvoice(req: Request<PayInvoiceInput>) {
    logger.silly('Paying invoice.');
    logger.silly(req);

    const user = this._userService.getUser(req.source);
    const identifier = user.getIdentifier();

    const t = await sequelize.transaction();
    try {
      const invoice = await this._invoiceDB.getInvoiceById(req.data.invoiceId, t);

      if (!invoice) {
        throw new ServerError(GenericErrors.NotFound);
      }

      if (invoice.getDataValue('toIdentifier') !== identifier) {
        throw new ServerError(AuthorizationErrors.Forbidden);
      }

      if (invoice.getDataValue('status') === InvoiceStatus.PAID) {
        throw new ServerError('This invoice is already paid. Tell author of resource to fix UI');
      }

      const expiresAt = invoice.get('expiresAt') as number | Date | string | null | undefined;
      const expiresAtMs =
        typeof expiresAt === 'number'
          ? expiresAt
          : expiresAt
            ? new Date(expiresAt).getTime()
            : null;
      if (expiresAtMs != null && !Number.isNaN(expiresAtMs) && expiresAtMs < Date.now()) {
        throw new ServerError('This invoice has expired');
      }

      const myAccount = await this._accountDB.getAuthorizedAccountById(
        req.data.fromAccountId,
        identifier,
        t,
      );
      const sharedAccount = await this._sharedAccountDB.getAuthorizedSharedAccountById(
        req.data.fromAccountId,
        identifier,
        [AccountRole.Admin, AccountRole.Contributor],
        t,
      );
      const fromAccount = myAccount ?? sharedAccount;

      /* Should we insert money to a specific account? */
      const receiverAccountIdentifier = invoice.getDataValue('receiverAccountIdentifier');
      const toAccountIdentifier = invoice.getDataValue('fromIdentifier');

      const toAccount = receiverAccountIdentifier
        ? await this._accountDB.getUniqueAccountByIdentifier(receiverAccountIdentifier, t)
        : await this._accountDB.getDefaultAccountByIdentifier(toAccountIdentifier ?? '', t);

      if (!fromAccount || !toAccount) {
        throw new ServerError(GenericErrors.NotFound);
      }

      if (fromAccount.getDataValue('id') === toAccount.getDataValue('id')) {
        throw new ServerError(AccountErrors.SameAccount);
      }

      const accountBalance = fromAccount.getDataValue('balance');
      const amount = assertPositiveMoney(invoice.getDataValue('amount'));

      if (accountBalance < amount) {
        throw new ServerError(BalanceErrors.InsufficentFunds);
      }

      await this._accountDB.transfer({
        amount,
        fromAccount,
        toAccount,
        transaction: t,
      });

      const marked = await this._invoiceDB.payInvoice(req.data.invoiceId, t);
      if (!marked) {
        throw new ServerError('This invoice is already paid. Tell author of resource to fix UI');
      }

      await this.transactionService.handleCreateTransaction(
        {
          amount: amount,
          message: i18n.t('Paid outgoing invoice to: {{to}}', {
            to: invoice.getDataValue('to'),
          }),
          fromAccount: fromAccount.toJSON(),
          toAccount: toAccount.toJSON(),
          type: TransactionType.Outgoing,
        },
        t,
        req.source,
      );

      await this.transactionService.handleCreateTransaction(
        {
          amount: amount,
          message: i18n.t('Received incoming invoice from: {{from}}', {
            from: invoice.getDataValue('from'),
          }),
          fromAccount: fromAccount.toJSON(),
          toAccount: toAccount.toJSON(),
          type: TransactionType.Incoming,
        },
        t,
        req.source,
      );

      await t.commit();
    } catch (err) {
      await t.rollback();
      logger.error(err);
      throw err;
    }
  }
}
