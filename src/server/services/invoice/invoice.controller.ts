import { ServerExports } from '@server/../../typings/exports/server';
import { Export, ExportListener } from '@server/decorators/Export';
import { InvoiceEvents } from '@typings/Events';
import { Request, Response } from '@typings/http';
import {
  Invoice,
  CreateInvoiceInput,
  InvoiceOnlineInput,
  PayInvoiceInput,
  GetInvoicesInput,
  GetInvoicesResponse,
} from '@typings/Invoice';
import { UserService } from 'services/user/user.service';
import { Controller } from '../../decorators/Controller';
import { NetPromise, PromiseEventListener } from '../../decorators/NetPromise';
import { InvoiceService } from './invoice.service';
import { assertPositiveMoney } from '@server/utils/money';

@Controller('Invoice')
@ExportListener()
@PromiseEventListener()
export class InvoiceController {
  private readonly _InvoiceService: InvoiceService;
  private readonly _userService: UserService;

  constructor(transactionService: InvoiceService, userService: UserService) {
    this._InvoiceService = transactionService;
    this._userService = userService;
  }

  @Export(ServerExports.GetInvoices)
  @NetPromise(InvoiceEvents.Get)
  async getInvoices(req: Request<GetInvoicesInput>, res: Response<GetInvoicesResponse>) {
    const data = await this._InvoiceService.getAllInvoicesBySource(req);
    return res({
      status: 'ok',
      data: {
        ...req.data,
        ...data,
      },
    });
  }

  @Export(ServerExports.GetUnpaidInvoices)
  @NetPromise(InvoiceEvents.CountUnpaid)
  async countUnpaid(req: Request<number>, res: Response<number>) {
    const count = await this._InvoiceService.countUnpaidInvoices(req.source);
    return res({
      status: 'ok',
      data: count,
    });
  }

  /** Trusted server scripts may set full identity fields. */
  @Export(ServerExports.CreateInvoice)
  async createInvoiceExport(req: Request<CreateInvoiceInput>, res: Response<Invoice>) {
    try {
      assertPositiveMoney(req.data.amount);
      const data = await this._InvoiceService.createInvoice(req.data);
      return res({ status: 'ok', data: data.toJSON() });
    } catch (err) {
      return res({ status: 'error', errorMsg: err.message });
    }
  }

  /** Client NetPromise — never trust client-supplied fromIdentifier / from name. */
  @NetPromise(InvoiceEvents.CreateInvoice)
  async createInvoice(req: Request<CreateInvoiceInput>, res: Response<Invoice>) {
    try {
      const fromUser = this._userService.getUser(req.source);
      assertPositiveMoney(req.data.amount);

      const data = await this._InvoiceService.createInvoice({
        ...req.data,
        from: fromUser.name,
        fromIdentifier: fromUser.getIdentifier(),
        // Clients cannot route payment into arbitrary society accounts
        receiverAccountIdentifier: undefined,
      });

      return res({ status: 'ok', data: data.toJSON() });
    } catch (err) {
      return res({ status: 'error', errorMsg: err.message });
    }
  }

  @NetPromise(InvoiceEvents.CreateOnlineInvoice)
  async createOnlineInvoice(req: Request<InvoiceOnlineInput>, res: Response<Invoice>) {
    try {
      assertPositiveMoney(req.data.amount);
      const toUser = this._userService.getUser(req.data.source);
      const fromUser = this._userService.getUser(req.source);

      const data = await this._InvoiceService.createInvoice({
        amount: req.data.amount,
        message: req.data.message,
        from: fromUser.name,
        to: toUser.name,
        toIdentifier: toUser.getIdentifier(),
        fromIdentifier: fromUser.getIdentifier(),
      });

      return res({ status: 'ok', data: data.toJSON() });
    } catch (err) {
      return res({ status: 'error', errorMsg: err.message });
    }
  }

  @Export(ServerExports.PayInvoice)
  @NetPromise(InvoiceEvents.PayInvoice)
  async payInvoice(req: Request<PayInvoiceInput>, res: Response<any>) {
    try {
      await this._InvoiceService.payInvoice(req);
      return res({ status: 'ok', data: {} });
    } catch (err) {
      return res({ status: 'error', errorMsg: err.message });
    }
  }
}
