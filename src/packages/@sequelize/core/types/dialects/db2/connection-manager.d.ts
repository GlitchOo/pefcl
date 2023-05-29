import type { Database as Db2LibDatabase } from 'ibm_db';
import type { Sequelize, ConnectionOptions } from '../../sequelize.js';
import type { Connection } from '../abstract/connection-manager';
import { AbstractConnectionManager } from '../abstract/connection-manager';
import type { Db2Dialect } from './index.js';
type Lib = typeof import('ibm_db');
export interface Db2Connection extends Connection, Db2LibDatabase {
    lib: Lib;
}
/**
 * DB2 Connection Manager
 *
 * Get connections, validate and disconnect them.
 * AbstractConnectionManager pooling use it to handle DB2 specific connections
 * Use https://github.com/ibmdb/node-ibm_db to connect with DB2 server
 *
 * @private
 */
export declare class Db2ConnectionManager extends AbstractConnectionManager<Db2Connection> {
    private readonly lib;
    constructor(dialect: Db2Dialect, sequelize: Sequelize);
    /**
     * Connect with DB2 database based on config, Handle any errors in connection
     * Set the pool handlers on connection.error
     *
     * @param config
     * @returns
     * @private
     */
    connect(config: ConnectionOptions): Promise<Db2Connection>;
    disconnect(connection: Db2Connection): Promise<void>;
    validate(connection: Db2Connection): boolean;
}
export {};
