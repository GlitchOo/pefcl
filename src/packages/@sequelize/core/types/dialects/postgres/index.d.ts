/// <reference types="node" />
import type { Sequelize } from '../../sequelize.js';
import { AbstractDialect } from '../abstract';
import { PostgresConnectionManager } from './connection-manager';
import { PostgresQuery } from './query';
import { PostgresQueryGenerator } from './query-generator';
import { PostgresQueryInterface } from './query-interface';
export declare class PostgresDialect extends AbstractDialect {
    static readonly supports: import("../abstract").DialectSupports;
    readonly connectionManager: PostgresConnectionManager;
    readonly queryGenerator: PostgresQueryGenerator;
    readonly queryInterface: PostgresQueryInterface;
    readonly Query: typeof PostgresQuery;
    readonly dataTypesDocumentationUrl = "https://www.postgresql.org/docs/current/datatype.html";
    readonly defaultVersion = "11.0.0";
    readonly TICK_CHAR = "\"";
    readonly TICK_CHAR_LEFT = "\"";
    readonly TICK_CHAR_RIGHT = "\"";
    constructor(sequelize: Sequelize);
    createBindCollector(): import("../abstract").BindCollector;
    escapeBuffer(buffer: Buffer): string;
    escapeString(value: string): string;
    canBackslashEscape(): boolean;
    getDefaultSchema(): string;
    static getDefaultPort(): number;
}
