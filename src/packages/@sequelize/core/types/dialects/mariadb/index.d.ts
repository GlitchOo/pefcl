import type { Sequelize } from '../../sequelize.js';
import { AbstractDialect } from '../abstract';
import { MySqlQueryInterface } from '../mysql/query-interface';
import { MariaDbConnectionManager } from './connection-manager';
import { MariaDbQuery } from './query';
import { MariaDbQueryGenerator } from './query-generator';
export declare class MariaDbDialect extends AbstractDialect {
    static supports: import("../abstract").DialectSupports;
    readonly TICK_CHAR = "`";
    readonly TICK_CHAR_LEFT = "`";
    readonly TICK_CHAR_RIGHT = "`";
    readonly defaultVersion = "10.1.44";
    readonly dataTypesDocumentationUrl = "https://mariadb.com/kb/en/library/resultset/#field-types";
    readonly queryGenerator: MariaDbQueryGenerator;
    readonly connectionManager: MariaDbConnectionManager;
    readonly queryInterface: MySqlQueryInterface;
    readonly Query: typeof MariaDbQuery;
    constructor(sequelize: Sequelize);
    createBindCollector(): import("../abstract").BindCollector;
    escapeString(value: string): string;
    canBackslashEscape(): boolean;
    getDefaultSchema(): string;
    static getDefaultPort(): number;
}
