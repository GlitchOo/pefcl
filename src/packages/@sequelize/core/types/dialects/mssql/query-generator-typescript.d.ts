import { AbstractQueryGenerator } from '../abstract/query-generator';
import type { RemoveIndexQueryOptions, TableNameOrModel } from '../abstract/query-generator-typescript';
/**
 * Temporary class to ease the TypeScript migration
 */
export declare class MsSqlQueryGeneratorTypeScript extends AbstractQueryGenerator {
    describeTableQuery(tableName: TableNameOrModel): string;
    showIndexesQuery(tableName: TableNameOrModel): string;
    removeIndexQuery(tableName: TableNameOrModel, indexNameOrAttributes: string | string[], options?: RemoveIndexQueryOptions): string;
}
