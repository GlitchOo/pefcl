import type { Sequelize } from '../../sequelize.js';
import { AbstractDialect } from '../abstract';
import { SqliteConnectionManager } from './connection-manager';
import { SqliteQuery } from './query';
import { SqliteQueryGenerator } from './query-generator';
import { SqliteQueryInterface } from './query-interface';
export declare class SqliteDialect extends AbstractDialect {
    static supports: import("../abstract").DialectSupports;
    readonly defaultVersion = "3.8.0";
    readonly Query: typeof SqliteQuery;
    readonly TICK_CHAR = "`";
    readonly TICK_CHAR_LEFT = "`";
    readonly TICK_CHAR_RIGHT = "`";
    readonly connectionManager: SqliteConnectionManager;
    readonly queryGenerator: SqliteQueryGenerator;
    readonly queryInterface: SqliteQueryInterface;
    readonly dataTypesDocumentationUrl = "https://www.sqlite.org/datatype3.html";
    constructor(sequelize: Sequelize);
    createBindCollector(): import("../abstract").BindCollector;
    getDefaultSchema(): string;
    static getDefaultPort(): number;
}
