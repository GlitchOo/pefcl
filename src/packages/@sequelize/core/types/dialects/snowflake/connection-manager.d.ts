import type { Connection as SnowflakeSdkConnection } from 'snowflake-sdk';
import type { ConnectionOptions, Sequelize } from '../../sequelize.js';
import type { Connection } from '../abstract/connection-manager';
import { AbstractConnectionManager } from '../abstract/connection-manager';
import type { SnowflakeDialect } from './index.js';
export interface SnowflakeConnection extends Connection, SnowflakeSdkConnection {
}
export declare class SnowflakeConnectionManager extends AbstractConnectionManager<SnowflakeConnection> {
    private readonly lib;
    constructor(dialect: SnowflakeDialect, sequelize: Sequelize);
    /**
     * Connect with a snowflake database based on config, Handle any errors in connection
     * Set the pool handlers on connection.error
     * Also set proper timezone once connection is connected.
     *
     * @param config
     * @returns
     * @private
     */
    connect(config: ConnectionOptions): Promise<SnowflakeConnection>;
    disconnect(connection: SnowflakeConnection): Promise<void>;
    validate(connection: SnowflakeConnection): boolean;
}
