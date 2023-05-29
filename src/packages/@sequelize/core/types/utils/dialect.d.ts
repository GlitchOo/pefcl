import type { AbstractDialect } from '../dialects/abstract';
export declare function toDefaultValue(value: unknown, dialect: AbstractDialect): unknown;
/**
 * @deprecated use {@link AbstractDialect#TICK_CHAR_LEFT} and {@link AbstractDialect#TICK_CHAR_RIGHT},
 * or {@link AbstractQueryGenerator#quoteIdentifier}
 */
export declare const TICK_CHAR = "`";
/**
 * @deprecated this is a bad way to quote identifiers and it should not be used anymore.
 * it mangles the input if the input contains identifier quotes, which should not happen.
 * Use {@link quoteIdentifier} instead
 *
 * @param s
 * @param tickChar
 * @returns
 */
export declare function addTicks(s: string, tickChar?: string): string;
/**
 * @deprecated this is a bad way to quote identifiers and it should not be used anymore.
 * Use {@link quoteIdentifier} instead
 *
 * @param s
 * @param tickChar
 * @returns
 */
export declare function removeTicks(s: string, tickChar?: string): string;
export declare function quoteIdentifier(identifier: string, leftTick: string, rightTick: string): string;
