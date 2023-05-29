/// <reference types="node" />
import type { Connection } from 'mysql2';
import type { ConnectionOptions, Sequelize } from '../../sequelize.js';
import type { Connection as AbstractConnection } from '../abstract/connection-manager';
import { AbstractConnectionManager } from '../abstract/connection-manager';
import type { AbstractDialect } from '../abstract/index.js';
export interface MySqlConnection extends Connection, AbstractConnection {
}
export interface MySqlTypeCastValue {
    type: string;
    length: number;
    db: string;
    table: string;
    name: string;
    string(): string;
    buffer(): Buffer;
    geometry(): unknown;
}
/**
 * MySQL Connection Manager
 *
 * Get connections, validate and disconnect them.
 * AbstractConnectionManager pooling use it to handle MySQL specific connections
 * Use https://github.com/sidorares/node-mysql2 to connect with MySQL server
 *
 * @private
 */
export declare class MySqlConnectionManager extends AbstractConnectionManager<MySqlConnection> {
    #private;
    private readonly lib;
    constructor(dialect: AbstractDialect, sequelize: Sequelize);
    /**
     * Connect with MySQL database based on config, Handle any errors in connection
     * Set the pool handlers on connection.error
     * Also set proper timezone once connection is connected.
     *
     * @param config
     * @returns
     * @private
     */
    connect(config: ConnectionOptions): Promise<MySqlConnection>;
    disconnect(connection: MySqlConnection): Promise<void>;
    validate(connection: MySqlConnection): boolean;
}
