import { Controller } from '@decorators/Controller';
import { EventListener, Event, NetEvent } from '@decorators/Event';
import { NetPromise, PromiseEventListener } from '@decorators/NetPromise';
import { ServerExports } from '@server/../../typings/exports/server';
import { Export, ExportListener } from '@server/decorators/Export';
import { config } from '@server/utils/server-config';
import { isFrameworkIntegrationActive } from '@server/utils/frameworkIntegration';
import { GeneralEvents, UserEvents } from '@typings/Events';
import { Request, Response } from '@typings/http';
import { OnlineUser } from '@typings/user';
import { UserService } from './user.service';

@Controller('User')
@ExportListener()
@PromiseEventListener()
@EventListener()
export class UserController {
  private readonly _userService: UserService;

  constructor(userService: UserService) {
    this._userService = userService;
  }

  @Export(ServerExports.LoadPlayer)
  async loadPlayer(req: Request<OnlineUser>, res: Response<void>) {
    this._userService.loadPlayer(req.data);
    res({ status: 'ok' });
  }

  @Export(ServerExports.UnloadPlayer)
  async unloadPlayer(req: Request<number>, res: Response<void>) {
    this._userService.unloadPlayer(req.source);
    res({ status: 'ok' });
  }

  @NetPromise(UserEvents.GetUsers)
  async getUsers(_req: Request<void>, res: Response<OnlineUser[]>) {
    const src = source;

    await new Promise((resolve) => {
      setImmediate(resolve);
    });

    const srcPed = GetPlayerPed(src.toString());
    const srcCoords = GetEntityCoords(srcPed);
    const maxDistance = config.frameworkIntegration?.maxPlayerDistance ?? 10;

    const users = this._userService.getAllUsers();
    const list: OnlineUser[] = [];

    for (const user of users.values()) {
      const ped = GetPlayerPed(user.getSource().toString());
      const coords = GetEntityCoords(ped);
      const distance = Math.hypot(
        coords[0] - srcCoords[0],
        coords[1] - srcCoords[1],
        coords[2] - srcCoords[2],
      );

      if (distance > maxDistance) continue;

      list.push({
        name: user.name,
        source: user.getSource(),
        identifier: user.getIdentifier(),
      });
    }

    res({ status: 'ok', data: list });
  }

  @NetEvent(UserEvents.LoadClient)
  async loadClient() {
    const src = source;
    this._userService.loadClient(src);
  }

  @Event('playerJoining')
  playerJoining() {
    if (isFrameworkIntegrationActive()) return;

    const _source = global.source;
    this._userService.loadStandalonePlayer({ source: _source });
  }

  @Event('playerDropped')
  playerDropped() {
    if (isFrameworkIntegrationActive()) return;
    const _source = global.source;
    this._userService.deletePlayer(_source);
  }

  @Event(GeneralEvents.ResourceStarted)
  async onServerResourceStart() {
    if (isFrameworkIntegrationActive()) return;

    const players = getPlayers();
    players.forEach((player) => {
      this._userService.loadStandalonePlayer({ source: parseInt(player, 10) });
    });
  }
}
