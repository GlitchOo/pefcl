import { singleton } from 'tsyringe';
import { Cash, ChangeCashInput } from '@typings/Cash';
import { config } from '@utils/server-config';
import { mainLogger } from '../../sv_logger';
import { UserService } from '../user/user.service';
import { CashDB } from './cash.db';
import { CashModel } from './cash.model';
import { Request } from '@typings/http';
import { ServerError } from '@utils/errors';
import { BalanceEvents } from '@typings/Events';
import { AuthorizationErrors, BalanceErrors, GenericErrors } from '@typings/Errors';
import { getFrameworkExports, isFrameworkIntegrationActive } from '@server/utils/frameworkIntegration';
import { assertPositiveMoney } from '@server/utils/money';

const logger = mainLogger.child({ module: 'cash' });
const useFrameworkIntegration = isFrameworkIntegrationActive();
const maxPlayerDistance = config?.frameworkIntegration?.maxPlayerDistance ?? 5.0;

const getDistanceBetweenSources = (a: number, b: number): number => {
  const pedA = GetPlayerPed(String(a));
  const pedB = GetPlayerPed(String(b));
  const [x1, y1, z1] = GetEntityCoords(pedA);
  const [x2, y2, z2] = GetEntityCoords(pedB);
  const dx = x1 - x2;
  const dy = y1 - y2;
  const dz = z1 - z2;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

@singleton()
export class CashService {
  _cashDB: CashDB;
  _userService: UserService;

  constructor(cashDB: CashDB, userService: UserService) {
    this._cashDB = cashDB;
    this._userService = userService;
  }

  private async getCashModel(source: number): Promise<CashModel | null> {
    const user = this._userService.getUser(source);
    return await this._cashDB.getCashByIdentifier(user?.getIdentifier() ?? '');
  }

  async getMyCash(source: number): Promise<number> {
    const user = this._userService.getUser(source);
    if (useFrameworkIntegration) {
      const exports = getFrameworkExports();
      return exports.getCash(user.getSource()) ?? 0;
    }

    const cash = await this.getCashModel(source);
    return cash?.getDataValue('amount') ?? 0;
  }

  async createInitialCash(src: number): Promise<Cash> {
    logger.debug(`Creating initial cash row for source: ${src}`);
    const user = this._userService.getUser(src);
    const cash = await this._cashDB.createInitial(user?.getIdentifier() ?? '');
    return cash.toJSON();
  }

  async giveCash(req: Request<ChangeCashInput>) {
    logger.debug(`source ${req.source}: Giving ${req.data.amount} to ${req.data.source}.`);

    const amount = assertPositiveMoney(req.data.amount);
    const targetSource = req.data.source;

    if (!targetSource || targetSource === req.source) {
      throw new ServerError(GenericErrors.BadInput);
    }

    const distance = getDistanceBetweenSources(req.source, targetSource);
    if (distance > maxPlayerDistance) {
      throw new ServerError(AuthorizationErrors.Forbidden);
    }

    const myCashAmount = await this.getMyCash(req.source);

    if (myCashAmount < amount) {
      throw new ServerError(BalanceErrors.InsufficentFunds);
    }

    // Remove first to avoid duplication if add succeeds and remove fails
    await this.handleRemoveCash(req.source, amount);
    try {
      await this.handleAddCash(targetSource, amount);
    } catch (err) {
      await this.handleAddCash(req.source, amount);
      throw err;
    }

    return true;
  }

  async handleRemoveCash(source: number, amount: number): Promise<CashModel | null> {
    logger.debug(`Taking ${amount} from ${source}`);
    const user = this._userService.getUser(source);
    const identifier = user.getIdentifier();

    if (useFrameworkIntegration) {
      const exports = getFrameworkExports();
      const ok = exports.removeCash(source, amount);
      if (ok === false) {
        throw new ServerError(BalanceErrors.InsufficentFunds);
      }
      return null;
    }

    const cash = await this._cashDB.getCashByIdentifier(identifier);
    if (!cash) {
      throw new ServerError(GenericErrors.NotFound);
    }
    const current = cash.getDataValue('amount') ?? 0;
    if (current < amount) {
      throw new ServerError(BalanceErrors.InsufficentFunds);
    }
    await cash.update({ amount: current - amount });
    emitNet(BalanceEvents.UpdateCashBalance, source, current - amount);
    return cash;
  }

  async handleAddCash(source: number, amount: number): Promise<CashModel | null> {
    logger.debug(`Giving ${amount} to ${source}`);
    const user = this._userService.getUser(source);
    const identifier = user.getIdentifier();

    if (useFrameworkIntegration) {
      const exports = getFrameworkExports();
      exports.addCash(source, amount);
      return null;
    }

    const cash = await this._cashDB.getCashByIdentifier(identifier);
    if (!cash) {
      throw new ServerError(GenericErrors.NotFound);
    }
    const current = cash.getDataValue('amount') ?? 0;
    await cash.update({ amount: current + amount });
    emitNet(BalanceEvents.UpdateCashBalance, source, current + amount);
    return cash;
  }
}
