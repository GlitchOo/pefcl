import * as _inflection from 'inflection';
import type { IndexOptions, TableName } from '../dialects/abstract/query-interface.js';
type Inflection = typeof _inflection;
export declare function useInflection(newInflection: Inflection): void;
export declare function camelizeIf(str: string, condition: boolean): string;
export declare function camelize(str: string): string;
export declare function underscoredIf(str: string, condition: boolean): string;
export declare function underscore(str: string): string;
export declare function spliceStr(str: string, index: number, count: number, add: string): string;
export declare function singularize(str: string): string;
export declare function pluralize(str: string): string;
type NameIndexIndex = {
    fields: Array<{
        name: string;
        attribute: string;
    }>;
    name: string;
};
/**
 *
 * @param index
 * @param index.fields
 * @param index.name
 * @param tableName
 *
 * @private
 */
export declare function nameIndex(index: NameIndexIndex, tableName: TableName): NameIndexIndex;
export declare function generateIndexName(tableName: TableName, index: IndexOptions): string;
export declare function removeTrailingSemicolon(str: string): string;
export {};
