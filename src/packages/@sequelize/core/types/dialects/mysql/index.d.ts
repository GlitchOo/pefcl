import type { Sequelize } from '../../sequelize.js';
import { AbstractDialect } from '../abstract';
import { MySqlConnectionManager } from './connection-manager';
import { MySqlQuery } from './query';
import { MySqlQueryGenerator } from './query-generator';
import { MySqlQueryInterface } from './query-interface';
export declare class MysqlDialect extends AbstractDialect {
    static supports: import("../abstract").DialectSupports;
    readonly connectionManager: MySqlConnectionManager;
    readonly queryGenerator: MySqlQueryGenerator;
    readonly queryInterface: MySqlQueryInterface;
    readonly Query: typeof MySqlQuery;
    readonly dataTypesDocumentationUrl = "https://dev.mysql.com/doc/refman/5.7/en/data-types.html";
    readonly defaultVersion = "5.7.0";
    readonly TICK_CHAR = "`";
    readonly TICK_CHAR_LEFT = "`";
    readonly TICK_CHAR_RIGHT = "`";
    constructor(sequelize: Sequelize);
    createBindCollector(): import("../abstract").BindCollector;
    escapeString(value: string): string;
    canBackslashEscape(): boolean;
    getDefaultSchema(): string;
    static getDefaultPort(): number;
}
