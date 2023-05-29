/// <reference types="node" />
import type { Sequelize } from '../../sequelize.js';
import { AbstractDialect } from '../abstract';
import { MsSqlConnectionManager } from './connection-manager';
import { MsSqlQueryGenerator } from './query-generator';
import { MsSqlQueryInterface } from './query-interface';
import { MsSqlQuery } from './query.js';
export declare class MssqlDialect extends AbstractDialect {
    static supports: import("../abstract").DialectSupports;
    readonly connectionManager: MsSqlConnectionManager;
    readonly queryGenerator: MsSqlQueryGenerator;
    readonly queryInterface: MsSqlQueryInterface;
    readonly Query: typeof MsSqlQuery;
    readonly dataTypesDocumentationUrl = "https://msdn.microsoft.com/en-us/library/ms187752%28v=sql.110%29.aspx";
    readonly defaultVersion = "14.0.1000";
    readonly TICK_CHAR = "\"";
    readonly TICK_CHAR_LEFT = "[";
    readonly TICK_CHAR_RIGHT = "]";
    constructor(sequelize: Sequelize);
    createBindCollector(): import("../abstract").BindCollector;
    escapeBuffer(buffer: Buffer): string;
    escapeString(value: string): string;
    getDefaultSchema(): string;
    static getDefaultPort(): number;
}
