import type { Connection as TediousConnection } from 'tedious';
import type { ConnectionOptions, Sequelize } from '../../sequelize.js';
import type { Connection } from '../abstract/connection-manager';
import { AbstractConnectionManager } from '../abstract/connection-manager';
import { AsyncQueue } from './async-queue';
import type { MssqlDialect } from './index.js';
type Lib = typeof import('tedious');
interface TediousConnectionState {
    name: string;
}
export interface MsSqlConnection extends Connection, TediousConnection {
    queue: AsyncQueue;
    lib: Lib;
    closed: boolean;
    loggedIn: boolean;
    state: TediousConnectionState;
    STATE: Record<string, TediousConnectionState>;
}
export declare class MsSqlConnectionManager extends AbstractConnectionManager<MsSqlConnection> {
    lib: Lib;
    constructor(dialect: MssqlDialect, sequelize: Sequelize);
    connect(config: ConnectionOptions): Promise<MsSqlConnection>;
    disconnect(connection: MsSqlConnection): Promise<void>;
    validate(connection: MsSqlConnection): boolean;
}
export {};
