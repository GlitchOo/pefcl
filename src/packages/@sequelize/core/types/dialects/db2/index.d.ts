/// <reference types="node" />
import type { Sequelize } from '../../sequelize.js';
import { AbstractDialect } from '../abstract';
import { Db2ConnectionManager } from './connection-manager';
import { Db2Query } from './query';
import { Db2QueryGenerator } from './query-generator';
import { Db2QueryInterface } from './query-interface';
export declare class Db2Dialect extends AbstractDialect {
    static supports: import("../abstract").DialectSupports;
    readonly defaultVersion = "1.0.0";
    readonly dataTypesDocumentationUrl = "https://www.ibm.com/support/knowledgecenter/SSEPGG_11.1.0/com.ibm.db2.luw.sql.ref.doc/doc/r0008478.html";
    readonly connectionManager: Db2ConnectionManager;
    readonly queryGenerator: Db2QueryGenerator;
    readonly queryInterface: Db2QueryInterface;
    readonly Query: typeof Db2Query;
    /** @deprecated */
    readonly TICK_CHAR = "\"";
    readonly TICK_CHAR_LEFT = "\"";
    readonly TICK_CHAR_RIGHT = "\"";
    constructor(sequelize: Sequelize);
    createBindCollector(): import("../abstract").BindCollector;
    escapeBuffer(buffer: Buffer): string;
    getDefaultSchema(): string;
    static getDefaultPort(): number;
}
