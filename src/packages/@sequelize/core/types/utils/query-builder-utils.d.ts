import type { DataType } from '../dialects/abstract/data-types.js';
/**
 * Determine if the default value provided exists and can be described
 * in a db schema using the DEFAULT directive.
 *
 * @param value Any default value.
 * @private
 */
export declare function defaultValueSchemable(value: DataType): boolean;
/**
 * Returns true if a where clause is empty, even with Symbols
 *
 * @param obj
 */
export declare function isWhereEmpty(obj: object): boolean;
