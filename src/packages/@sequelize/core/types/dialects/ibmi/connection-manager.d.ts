import type { Connection as OdbcConnection } from 'odbc';
import type { ConnectionOptions, Sequelize } from '../../sequelize.js';
import type { Connection } from '../abstract/connection-manager';
import { AbstractConnectionManager } from '../abstract/connection-manager';
import type { IBMiDialect } from './index.js';
export interface IBMiConnection extends Connection, OdbcConnection {
    isConnected: boolean;
}
export declare class IBMiConnectionManager extends AbstractConnectionManager<IBMiConnection> {
    private readonly lib;
    constructor(dialect: IBMiDialect, sequelize: Sequelize);
    connect(config: ConnectionOptions): Promise<IBMiConnection>;
    disconnect(connection: IBMiConnection): Promise<void>;
    validate(connection: IBMiConnection): boolean;
}
