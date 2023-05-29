import type { Association } from './associations/index.js';
import type { IndexOptions, TableNameWithSchema } from './dialects/abstract/query-interface.js';
import type { HookHandler } from './hooks.js';
import type { ModelHooks } from './model-hooks.js';
import type { BuiltModelOptions, InitOptions, AttributeOptions, ModelAttributes, ModelStatic, NormalizedAttributeOptions, NormalizedAttributeReferencesOptions, ModelOptions } from './model.js';
import type { Sequelize } from './sequelize.js';
import { MapView, SetView } from './utils/immutability.js';
export interface TimestampAttributes {
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
}
/**
 * The goal of this class is to store the definition of a model.
 *
 * It is part of the Repository Design Pattern.
 * See https://github.com/sequelize/sequelize/issues/15389 for more details.
 *
 * There is only one ModelDefinition instance per model per sequelize instance.
 */
export declare class ModelDefinition {
    #private;
    readonly options: BuiltModelOptions;
    get table(): TableNameWithSchema;
    readonly associations: {
        [associationName: string]: Association;
    };
    /**
     * The list of attributes that have *not* been normalized.
     * This list can be mutated. Call {@link refreshAttributes} to update the normalized attributes ({@link attributes)}.
     */
    readonly rawAttributes: {
        [attributeName: string]: AttributeOptions;
    };
    /**
     * The list of attributes that have been normalized.
     *
     * This map is fully frozen and cannot be modified directly.
     * Modify {@link rawAttributes} then call {@link refreshAttributes} instead.
     */
    readonly attributes: MapView<string, NormalizedAttributeOptions<import("./model.js").Model<any, any>>>;
    /**
     * The list of attributes that actually exist in the database, as opposed to {@link virtualAttributeNames}.
     */
    readonly physicalAttributes: MapView<string, NormalizedAttributeOptions<import("./model.js").Model<any, any>>>;
    readonly columns: MapView<string, NormalizedAttributeOptions<import("./model.js").Model<any, any>>>;
    readonly primaryKeysAttributeNames: SetView<string>;
    /**
     * List of attributes that cannot be modified by the user (read-only)
     */
    readonly readOnlyAttributeNames: SetView<string>;
    /**
     * Records which attributes are the different built-in timestamp attributes
     */
    readonly timestampAttributeNames: TimestampAttributes;
    get versionAttributeName(): string | undefined;
    readonly jsonAttributeNames: SetView<string>;
    /**
     * The list of attributes that do not really exist in the database.
     */
    readonly virtualAttributeNames: SetView<string>;
    readonly attributesWithGetters: SetView<string>;
    readonly attributesWithSetters: SetView<string>;
    /**
     * @deprecated Code should not rely on this as users can create custom attributes.
     */
    readonly booleanAttributeNames: SetView<string>;
    /**
     * @deprecated Code should not rely on this as users can create custom attributes.
     */
    readonly dateAttributeNames: SetView<string>;
    get autoIncrementAttributeName(): string | null;
    readonly defaultValues: MapView<string, () => unknown>;
    get modelName(): string;
    get underscored(): boolean;
    get sequelize(): Sequelize;
    get hooks(): HookHandler<ModelHooks>;
    constructor(attributesOptions: ModelAttributes, modelOptions: InitOptions, model: ModelStatic);
    /**
     * Normalizes all attribute definitions, using {@link rawAttributes} as the source.
     */
    refreshAttributes(): void;
    getIndexes(): readonly IndexOptions[];
    /**
     * Returns the column name corresponding to the given attribute name.
     *
     * @param attributeName
     */
    getColumnName(attributeName: string): string;
    /**
     * Returns the column name corresponding to the given attribute name if it exists, otherwise returns the attribute name.
     *
     * ⚠️ Using this method is highly discouraged. Users should specify column names & attribute names separately, to prevent any ambiguity.
     *
     * @param attributeName
     */
    getColumnNameLoose(attributeName: string): string;
}
export declare function registerModelDefinition(model: ModelStatic, modelDefinition: ModelDefinition): void;
export declare function hasModelDefinition(model: ModelStatic): boolean;
export declare function getModelDefinition(model: ModelStatic): ModelDefinition;
export declare function normalizeReference(references: AttributeOptions['references']): NormalizedAttributeReferencesOptions | undefined;
/**
 * This method mutates the first parameter.
 *
 * @param existingModelOptions
 * @param options
 * @param overrideOnConflict
 */
export declare function mergeModelOptions(existingModelOptions: ModelOptions, options: ModelOptions, overrideOnConflict: boolean): ModelOptions;
