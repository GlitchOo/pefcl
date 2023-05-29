import type { Client } from 'pg';
import type { TypeFormat, TypeId } from 'pg-types';
import { Sequelize } from '../../sequelize.js';
import type { ConnectionOptions } from '../../sequelize.js';
import type { Connection } from '../abstract/connection-manager';
import { AbstractConnectionManager } from '../abstract/connection-manager';
import type { PostgresDialect } from './index.js';
type TypeParser = (source: string) => unknown;
export interface PgConnection extends Connection, Client {
    _invalid?: boolean;
    standard_conforming_strings?: boolean;
    _ending?: boolean;
}
export declare class PostgresConnectionManager extends AbstractConnectionManager<PgConnection> {
    #private;
    private readonly lib;
    constructor(dialect: PostgresDialect, sequelize: Sequelize);
    connect(config: ConnectionOptions): Promise<PgConnection>;
    disconnect(connection: PgConnection): Promise<void>;
    validate(connection: PgConnection): boolean;
    getTypeParser(oid: TypeId, format?: TypeFormat): TypeParser;
    /**
     * Refreshes the local registry of Custom Types (e.g. enum) OIDs
     */
    refreshDynamicOids(): Promise<void>;
}
export {};
