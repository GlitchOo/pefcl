import type { RemoveIndexQueryOptions, TableNameOrModel } from '../abstract/query-generator-typescript';
import { MySqlQueryGenerator } from '../mysql/query-generator';
/**
 * Temporary class to ease the TypeScript migration
 */
export declare class SqliteQueryGeneratorTypeScript extends MySqlQueryGenerator {
    describeTableQuery(tableName: TableNameOrModel): string;
    showIndexesQuery(tableName: TableNameOrModel): string;
    removeIndexQuery(tableName: TableNameOrModel, indexNameOrAttributes: string | string[], options?: RemoveIndexQueryOptions): string;
}
