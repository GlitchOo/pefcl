/// <reference types="node" />
import type { Sequelize } from '../../sequelize.js';
import { AbstractDialect } from '../abstract';
import { IBMiConnectionManager } from './connection-manager';
import { IBMiQuery } from './query';
import { IBMiQueryGenerator } from './query-generator';
import { IBMiQueryInterface } from './query-interface';
export declare class IBMiDialect extends AbstractDialect {
    static supports: import("../abstract").DialectSupports;
    readonly connectionManager: IBMiConnectionManager;
    readonly queryGenerator: IBMiQueryGenerator;
    readonly queryInterface: IBMiQueryInterface;
    readonly dataTypesDocumentationUrl = "https://www.ibm.com/support/knowledgecenter/en/ssw_ibm_i_73/db2/rbafzch2data.htm";
    readonly defaultVersion = "7.3.0";
    readonly Query: typeof IBMiQuery;
    readonly TICK_CHAR = "\"";
    readonly TICK_CHAR_LEFT = "\"";
    readonly TICK_CHAR_RIGHT = "\"";
    constructor(sequelize: Sequelize);
    createBindCollector(): import("../abstract").BindCollector;
    escapeBuffer(buffer: Buffer): string;
    getDefaultSchema(): string;
    static getDefaultPort(): number;
}
