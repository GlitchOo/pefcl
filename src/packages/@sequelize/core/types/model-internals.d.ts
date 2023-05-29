import type { IndexOptions } from './dialects/abstract/query-interface.js';
import type { Transactionable } from './model';
import type { Sequelize } from './sequelize';
export declare function _validateIncludedElements(options: any, tableNames?: any): any;
export declare function combineIncludes(a: any, b: any): any;
export declare function throwInvalidInclude(include: any): never;
export declare function setTransactionFromCls(options: Transactionable, sequelize: Sequelize): void;
export declare function conformIndex(index: IndexOptions): IndexOptions;
