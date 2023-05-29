import type { RemoveIndexQueryOptions, TableNameOrModel } from '../abstract/query-generator-typescript';
import { MySqlQueryGenerator } from '../mysql/query-generator.js';
/**
 * Temporary class to ease the TypeScript migration
 */
export declare class MariaDbQueryGeneratorTypeScript extends MySqlQueryGenerator {
    removeIndexQuery(tableName: TableNameOrModel, indexNameOrAttributes: string | string[], options?: RemoveIndexQueryOptions): string;
}
