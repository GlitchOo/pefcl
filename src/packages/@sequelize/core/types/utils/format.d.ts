import type { Attributes, NormalizedAttributeOptions, Model, ModelStatic, WhereOptions } from '..';
export type FinderOptions<TAttributes> = {
    attributes?: string[];
    where?: WhereOptions<TAttributes>;
};
export type MappedFinderOptions<TAttributes> = Omit<FinderOptions<TAttributes>, 'attributes'> & {
    attributes?: Array<[columnName: string, attributeName: string] | string>;
};
/**
 * Expand and normalize finder options.
 * Mutates the "options" parameter.
 *
 * @param options
 * @param Model
 */
export declare function mapFinderOptions<M extends Model, T extends FinderOptions<Attributes<M>>>(options: T, Model: ModelStatic<M>): MappedFinderOptions<Attributes<M>>;
/**
 * Used to map field names in attributes and where conditions.
 *
 * Mutates the "options" parameter.
 *
 * @param options
 * @param Model
 */
export declare function mapOptionFieldNames<M extends Model>(options: FinderOptions<Attributes<M>>, Model: ModelStatic): MappedFinderOptions<Attributes<M>>;
export declare function mapWhereFieldNames(where: Record<PropertyKey, any>, Model: ModelStatic<Model>): object;
/**
 * getComplexKeys
 *
 * @param obj
 * @returns All keys including operators
 * @private
 */
export declare function getComplexKeys(obj: object): Array<string | symbol>;
/**
 * getComplexSize
 *
 * @param obj
 * @returns Length of object properties including operators if obj is array returns its length
 * @private
 */
export declare function getComplexSize(obj: object | any[]): number;
/**
 * getOperators
 *
 * @param obj
 * @returns All operators properties of obj
 * @private
 */
export declare function getOperators(obj: object): symbol[];
export declare function combineTableNames(tableName1: string, tableName2: string): string;
/**
 * Used to map field names in values
 *
 * @param dataValues
 * @param attributeNames
 * @param ModelClass
 */
export declare function mapValueFieldNames(// TODO: rename to mapAttributesToColumNames? See https://github.com/sequelize/meetings/issues/17
dataValues: Record<string, any>, attributeNames: Iterable<string>, ModelClass: ModelStatic): Record<string, any>;
/**
 * Removes entries from `hash` whose value is either null or undefined, unless `omitNull` is false or `allowNull` includes that key.
 *
 * Keys ending with 'Id' are never removed.
 *
 * @param hash the object from which entries with nullish values will be removed.
 * @param omitNull if false, this method returns the object as-is
 * @param options
 * @param options.allowNull A list of keys that must be preserved even if their value is null or undefined.
 */
export declare function removeNullishValuesFromHash(hash: Record<string, any>, omitNull: boolean, options?: {
    allowNull?: string[];
}): Record<string, any>;
export declare function getColumnName(attribute: NormalizedAttributeOptions): string;
export declare function getAttributeName(model: ModelStatic, columnName: string): string | null;
