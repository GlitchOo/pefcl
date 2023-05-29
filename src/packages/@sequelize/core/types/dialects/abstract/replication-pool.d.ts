import { Pool } from 'sequelize-pool';
import type { NormalizedPoolOptions, ConnectionOptions } from '../../sequelize.js';
export type ConnectionType = 'read' | 'write';
type ReplicationPoolConfig<Resource> = {
    readConfig: ConnectionOptions[] | null;
    writeConfig: ConnectionOptions;
    pool: Omit<NormalizedPoolOptions, 'validate'>;
    connect(options: ConnectionOptions): Promise<Resource>;
    disconnect(connection: Resource): Promise<void>;
    validate(connection: Resource): boolean;
};
export declare class ReplicationPool<Resource extends object> {
    /**
     * Replication read pool. Will only be used if the 'read' replication option has been provided,
     * otherwise the {@link write} will be used instead.
     */
    readonly read: Pool<Resource> | null;
    readonly write: Pool<Resource>;
    constructor(config: ReplicationPoolConfig<Resource>);
    acquire(queryType?: ConnectionType, useMaster?: boolean): Promise<Resource>;
    release(client: Resource): void;
    destroy(client: Resource): Promise<void>;
    destroyAllNow(): Promise<void>;
    drain(): Promise<void>;
    getPool(poolType: ConnectionType): Pool<Resource>;
    get size(): number;
    get available(): number;
    get using(): number;
    get waiting(): number;
}
export {};
