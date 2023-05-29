import type { Sequelize } from '../../sequelize.js';
import { AbstractDialect } from '../abstract';
import { SnowflakeConnectionManager } from './connection-manager';
import { SnowflakeQuery } from './query';
import { SnowflakeQueryGenerator } from './query-generator';
import { SnowflakeQueryInterface } from './query-interface';
export declare class SnowflakeDialect extends AbstractDialect {
    static supports: import("../abstract").DialectSupports;
    readonly dataTypesDocumentationUrl = "https://docs.snowflake.com/en/sql-reference/data-types.html";
    readonly defaultVersion = "5.7.0";
    readonly Query: typeof SnowflakeQuery;
    readonly TICK_CHAR = "\"";
    readonly TICK_CHAR_LEFT = "\"";
    readonly TICK_CHAR_RIGHT = "\"";
    readonly connectionManager: SnowflakeConnectionManager;
    readonly queryGenerator: SnowflakeQueryGenerator;
    readonly queryInterface: SnowflakeQueryInterface;
    constructor(sequelize: Sequelize);
    createBindCollector(): import("../abstract").BindCollector;
    getDefaultSchema(): string;
    static getDefaultPort(): number;
}
