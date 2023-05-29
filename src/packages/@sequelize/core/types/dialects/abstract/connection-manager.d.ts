import type { Dialect, Sequelize, ConnectionOptions } from '../../sequelize.js';
import { ReplicationPool } from './replication-pool.js';
import type { AbstractDialect } from './index.js';
export interface GetConnectionOptions {
    /**
     * Set which replica to use. Available options are `read` and `write`
     */
    type: 'read' | 'write';
    /**
     * Force master or write replica to get connection from
     */
    useMaster?: boolean;
    /**
     * ID of the connection.
     */
    uuid?: string | 'default';
}
export interface Connection {
    /** custom property we attach to different dialect connections */
    uuid?: string | undefined;
}
/**
 * Abstract Connection Manager
 *
 * Connection manager which handles pooling & replication.
 * Uses sequelize-pool for pooling
 *
 * @param connection
 * @private
 */
export declare class AbstractConnectionManager<TConnection extends Connection = Connection> {
    #private;
    protected readonly sequelize: Sequelize;
    protected readonly config: Sequelize['config'];
    protected readonly dialect: AbstractDialect;
    protected readonly dialectName: Dialect;
    readonly pool: ReplicationPool<TConnection>;
    constructor(dialect: AbstractDialect, sequelize: Sequelize);
    /**
     * Determine if a connection is still valid or not
     *
     * @param _connection
     */
    validate(_connection: TConnection): boolean;
    connect(_config: ConnectionOptions): Promise<TConnection>;
    disconnect(_connection: TConnection): Promise<void>;
    /**
     * Try to load dialect module from various configured options.
     * Priority goes like dialectModulePath > dialectModule > require(default)
     *
     * @param moduleName Name of dialect module to lookup
     *
     * @private
     */
    _loadDialectModule(moduleName: string): unknown;
    /**
     * Handler which executes on process exit or connection manager shutdown
     */
    _onProcessExit(): Promise<void>;
    /**
     * Drain the pool and close it permanently
     */
    close(): Promise<void>;
    /**
     * Get connection from pool. It sets database version if it's not already set.
     * Call pool.acquire to get a connection.
     *
     * @param options
     */
    getConnection(options?: GetConnectionOptions): Promise<TConnection>;
    _initDatabaseVersion(conn?: TConnection): Promise<void>;
    /**
     * Release a pooled connection so it can be utilized by other connection requests
     *
     * @param connection
     */
    releaseConnection(connection: TConnection): void;
    /**
     * Destroys a pooled connection and removes it from the pool.
     *
     * @param connection
     */
    destroyConnection(connection: TConnection): Promise<void>;
    /**
     * Call dialect library to get connection
     *
     * @param config Connection config
     */
    protected _connect(config: ConnectionOptions): Promise<TConnection>;
    /**
     * Call dialect library to disconnect a connection
     *
     * @param connection
     */
    protected _disconnect(connection: TConnection): Promise<void>;
}
