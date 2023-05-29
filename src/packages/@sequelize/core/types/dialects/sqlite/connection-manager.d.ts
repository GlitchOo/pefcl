import type { Database } from 'sqlite3';
import type { Sequelize } from '../../sequelize.js';
import type { Connection, GetConnectionOptions } from '../abstract/connection-manager';
import { AbstractConnectionManager } from '../abstract/connection-manager';
import type { SqliteDialect } from './index.js';
interface SqliteConnection extends Connection, Database {
    filename: string;
}
export declare class SqliteConnectionManager extends AbstractConnectionManager<SqliteConnection> {
    private readonly lib;
    private readonly connections;
    constructor(dialect: SqliteDialect, sequelize: Sequelize);
    _onProcessExit(): Promise<void>;
    getConnection(options: GetConnectionOptions): Promise<SqliteConnection>;
    disconnect(_connection: SqliteConnection): Promise<void>;
    releaseConnection(connection: SqliteConnection, force?: boolean): Promise<void>;
}
export {};
