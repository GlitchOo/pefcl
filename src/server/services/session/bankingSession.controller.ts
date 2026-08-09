import { Controller } from '@decorators/Controller';
import { Event, EventListener, NetEvent } from '@decorators/Event';
import { BankingSessionService, BankingSessionType } from './bankingSession.service';
import { GeneralEvents, SessionEvents } from '@typings/Events';

@Controller('BankingSession')
@EventListener()
export class BankingSessionController {
  constructor(private readonly sessions: BankingSessionService) {}

  @NetEvent(SessionEvents.Open)
  onOpen(type: BankingSessionType) {
    const src = global.source as number;
    if (!src || (type !== 'bank' && type !== 'atm')) return;
    this.sessions.open(src, type);
  }

  @NetEvent(SessionEvents.Close)
  onClose() {
    const src = global.source as number;
    if (!src) return;
    this.sessions.close(src);
  }

  @NetEvent(GeneralEvents.CloseUI)
  onCloseUI() {
    const src = global.source as number;
    if (!src) return;
    this.sessions.close(src);
  }

  @Event('playerDropped')
  onDropped() {
    const src = global.source as number;
    if (!src) return;
    this.sessions.close(src);
  }
}
