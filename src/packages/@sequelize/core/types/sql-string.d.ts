import type { AbstractDataType } from './dialects/abstract/data-types.js';
import type { AbstractDialect } from './dialects/abstract/index.js';
export declare function getTextDataTypeForDialect(dialect: AbstractDialect): AbstractDataType<any>;
export declare function escape(val: unknown, timeZone: string | undefined, dialect: AbstractDialect, format?: boolean): string;
