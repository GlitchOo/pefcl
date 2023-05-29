import type { Falsy } from '../../generic/falsy.js';
import * as BaseTypes from '../abstract/data-types.js';
export declare class UUID extends BaseTypes.UUID {
    toSql(): string;
}
export declare class BOOLEAN extends BaseTypes.BOOLEAN {
    escape(value: boolean | Falsy): string;
    toBindableValue(value: boolean | Falsy): unknown;
    toSql(): string;
}
export { STRING, CHAR, TEXT, TINYINT, SMALLINT, MEDIUMINT, INTEGER, BIGINT, FLOAT, DOUBLE, BLOB, DECIMAL, DATE, ENUM } from '../db2/data-types.js';
