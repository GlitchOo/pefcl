import { AbstractQueryGenerator } from '../abstract/query-generator';
import type { TableNameOrModel } from '../abstract/query-generator-typescript';
/**
 * Temporary class to ease the TypeScript migration
 */
export declare class SnowflakeQueryGeneratorTypeScript extends AbstractQueryGenerator {
    describeTableQuery(tableName: TableNameOrModel): string;
    showIndexesQuery(): string;
}
