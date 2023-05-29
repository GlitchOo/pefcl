import type { ModelStatic } from '../../model.js';
import type { Sequelize } from '../../sequelize.js';
import type { TableName, TableNameWithSchema } from './query-interface.js';
import type { AbstractDialect } from './index.js';
export type TableNameOrModel = TableName | ModelStatic;
export interface RemoveIndexQueryOptions {
    concurrently?: boolean;
    ifExists?: boolean;
    cascade?: boolean;
}
export declare const REMOVE_INDEX_QUERY_SUPPORTABLE_OPTIONS: Set<keyof RemoveIndexQueryOptions>;
export interface QueryGeneratorOptions {
    sequelize: Sequelize;
    dialect: AbstractDialect;
}
/**
 * This is a temporary class used to progressively migrate the AbstractQueryGenerator class to TypeScript by slowly moving its functions here.
 * Always use {@link AbstractQueryGenerator} instead.
 */
export declare class AbstractQueryGeneratorTypeScript {
    protected readonly dialect: AbstractDialect;
    protected readonly sequelize: Sequelize;
    constructor(options: QueryGeneratorOptions);
    protected get options(): import("../../sequelize.js").NormalizedOptions;
    describeTableQuery(tableName: TableNameOrModel): string;
    showIndexesQuery(_tableName: TableNameOrModel): string;
    removeIndexQuery(_tableName: TableNameOrModel, _indexNameOrAttributes: string | string[], _options?: RemoveIndexQueryOptions): string;
    extractTableDetails(tableNameOrModel: TableNameOrModel, options?: {
        schema?: string;
        delimiter?: string;
    }): TableNameWithSchema;
    /**
     * Quote table name with optional alias and schema attribution
     *
     * @param param table string or object
     * @param alias alias name
     */
    quoteTable(param: TableNameOrModel, alias?: boolean | string): string;
    /**
     * Adds quotes to identifier
     *
     * @param identifier
     * @param _force
     */
    quoteIdentifier(identifier: string, _force?: boolean): string;
    isSameTable(tableA: TableNameOrModel, tableB: TableNameOrModel): boolean;
}
