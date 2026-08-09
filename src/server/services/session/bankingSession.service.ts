import { singleton } from 'tsyringe';
import { mainLogger } from '@server/sv_logger';
import { ServerError } from '@utils/errors';
import { AuthorizationErrors } from '@typings/Errors';

export type BankingSessionType = 'bank' | 'atm';

type Session = {
  type: BankingSessionType;
  openedAt: number;
};

const SESSION_TTL_MS = 30 * 60 * 1000;

const logger = mainLogger.child({ module: 'bankingSession' });

@singleton()
export class BankingSessionService {
  private sessions = new Map<number, Session>();

  open(source: number, type: BankingSessionType) {
    this.sessions.set(source, { type, openedAt: Date.now() });
    logger.debug(`Opened ${type} session for source ${source}`);
  }

  close(source: number) {
    this.sessions.delete(source);
    logger.debug(`Closed banking session for source ${source}`);
  }

  get(source: number): Session | undefined {
    const session = this.sessions.get(source);
    if (!session) return undefined;

    if (Date.now() - session.openedAt > SESSION_TTL_MS) {
      this.sessions.delete(source);
      return undefined;
    }

    return session;
  }

  /** Deposit/withdraw require an active bank or ATM UI session. */
  assertActiveSession(source: number, allowed: BankingSessionType[] = ['bank', 'atm']) {
    const session = this.get(source);
    if (!session || !allowed.includes(session.type)) {
      throw new ServerError(AuthorizationErrors.Forbidden);
    }
    return session;
  }
}
