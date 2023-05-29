import type { AbstractDialect, BindCollector } from '../dialects/abstract/index.js';
import type { BindOrReplacements } from '../sequelize.js';
type MapSqlOptions = {
    onPositionalReplacement?(): void;
};
/**
 * Maps bind parameters from Sequelize's format ($1 or $name) to the dialect's format.
 *
 * @param sqlString
 * @param dialect
 */
export declare function mapBindParameters(sqlString: string, dialect: AbstractDialect): {
    sql: string;
    bindOrder: string[] | null;
    parameterSet: Set<string>;
};
export declare function injectReplacements(sqlString: string, dialect: AbstractDialect, replacements: BindOrReplacements, opts?: MapSqlOptions): string;
/**
 * Collector for dialects that only support ordered parameters, and whose order matter in the SQL query. (e.g. dialects that use the "?" token for parameters)
 *
 * @param token The token to use as the bind parameter (e.g. '?' in mysql).
 */
export declare function createUnspecifiedOrderedBindCollector(token?: string): BindCollector;
/**
 * Collector for dialects that only support ordered parameters, but whose order does not matter in the SQL query (e.g. dialect that support parameters names like '$1')
 *
 * Parameter index starts at 1!
 *
 * @param prefix The prefix to place before the name of the bind parameter (e.g. @ for mssql, $ for sqlite/postgres)
 */
export declare function createSpecifiedOrderedBindCollector(prefix?: string): BindCollector;
/**
 * Collector for dialects that support named bind parameters (e.g. @name, $name, etc)
 *
 * @param parameterPrefix The prefix to place before the name of the bind parameter (e.g. @ for mssql, $ for sqlite/postgres)
 */
export declare function createNamedParamBindCollector(parameterPrefix: string): BindCollector;
export declare function assertNoReservedBind(bind: BindOrReplacements): void;
export declare function combineBinds(bindA: BindOrReplacements, bindB: {
    [key: string]: unknown;
}): {
    [x: string]: unknown;
};
export {};
