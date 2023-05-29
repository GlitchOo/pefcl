import type { Connection as LibConnection } from 'mariadb';
import type { Sequelize, ConnectionOptions } from '../../sequelize.js';
import type { Connection } from '../abstract/connection-manager';
import { AbstractConnectionManager } from '../abstract/connection-manager';
import type { MariaDbDialect } from './index.js';
export interface MariaDbConnection extends Connection, LibConnection {
}
/**
 * MariaDB Connection Manager
 *
 * Get connections, validate and disconnect them.
 * AbstractConnectionManager pooling use it to handle MariaDB specific connections
 * Use https://github.com/MariaDB/mariadb-connector-nodejs to connect with MariaDB server
 *
 * @private
 */
export declare class MariaDbConnectionManager extends AbstractConnectionManager<MariaDbConnection> {
    #private;
    private readonly lib;
    constructor(dialect: MariaDbDialect, sequelize: Sequelize);
    /**
     * Connect with MariaDB database based on config, Handle any errors in connection
     * Set the pool handlers on connection.error
     * Also set proper timezone once connection is connected.
     *
     * @param config
     * @returns
     * @private
     */
    connect(config: ConnectionOptions): Promise<MariaDbConnection>;
    disconnect(connection: MariaDbConnection): Promise<void>;
    validate(connection: MariaDbConnection): boolean;
}
