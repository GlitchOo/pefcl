import { ModelDefinition } from './model-definition.js';
import type { Model } from './model.js';
import type { PartialBy } from './utils/types.js';
import type { ModelStatic, Sequelize, AbstractQueryGenerator, AbstractQueryInterface, IndexOptions, InitOptions, Attributes, BrandedKeysOf, ForeignKeyBrand, ModelAttributes, NormalizedAttributeOptions, BuiltModelOptions, AttributeOptions, Association, TableNameWithSchema } from '.';
/**
 * This is a temporary class used to progressively migrate the Model class to TypeScript by slowly moving its functions here.
 * Always use {@link Model} instead.
 */
export declare class ModelTypeScript {
    static get queryInterface(): AbstractQueryInterface;
    static get queryGenerator(): AbstractQueryGenerator;
    /**
     * A reference to the sequelize instance.
     */
    get sequelize(): Sequelize;
    /**
     * A reference to the sequelize instance.
     *
     * Accessing this property throws if the model has not been registered with a Sequelize instance yet.
     */
    static get sequelize(): Sequelize;
    /**
     * Returns the model definition of this model.
     * The model definition contains all metadata about this model.
     */
    static get modelDefinition(): ModelDefinition;
    /**
     * An object hash from alias to association object
     */
    static get associations(): {
        [associationName: string]: Association;
    };
    /**
     * The name of the primary key attribute (on the JS side).
     *
     * @deprecated This property doesn't work for composed primary keys. Use {@link primaryKeyAttributes} instead.
     */
    static get primaryKeyAttribute(): string | null;
    /**
     * The name of the primary key attributes (on the JS side).
     *
     * @deprecated use {@link modelDefinition}.
     */
    static get primaryKeyAttributes(): string[];
    /**
     * The column name of the primary key.
     *
     * @deprecated don't use this. It doesn't work with composite PKs. It may be removed in the future to reduce duplication.
     *  Use the. Use {@link Model.primaryKeys} instead.
     */
    static get primaryKeyField(): string | null;
    /**
     * Like {@link Model.rawAttributes}, but only includes attributes that are part of the Primary Key.
     */
    static get primaryKeys(): {
        [attribute: string]: NormalizedAttributeOptions;
    };
    /**
     * The options that the model was initialized with
     */
    static get options(): BuiltModelOptions;
    /**
     * The name of the database table
     *
     * @deprecated use {@link modelDefinition} or {@link table}.
     */
    static get tableName(): string;
    static get table(): TableNameWithSchema;
    /**
     * @deprecated use {@link modelDefinition}'s {@link ModelDefinition#rawAttributes} or {@link ModelDefinition#attributes} instead.
     */
    static get rawAttributes(): {
        [attribute: string]: AttributeOptions;
    };
    /**
     * @deprecated use {@link modelDefinition}'s {@link ModelDefinition#rawAttributes} or {@link ModelDefinition#attributes} instead.
     */
    get rawAttributes(): {
        [attribute: string]: AttributeOptions;
    };
    /**
     * @deprecated use {@link modelDefinition}'s {@link ModelDefinition#columns}.
     */
    static get fieldRawAttributesMap(): {
        [columnName: string]: NormalizedAttributeOptions;
    };
    /**
     * @deprecated use {@link modelDefinition}'s {@link ModelDefinition#physicalAttributes}.
     */
    static get tableAttributes(): {
        [attribute: string]: NormalizedAttributeOptions;
    };
    /**
     * A mapping of column name to attribute name
     *
     * @private
     */
    static get fieldAttributeMap(): {
        [columnName: string]: string;
    };
    static get hooks(): import("./hooks.js").HookHandler<import("./model-hooks.js").ModelHooks<Model<any, any>, any>>;
    static addHook: import("./hooks-legacy.js").LegacyAddAnyHookFunction<import("./model-hooks.js").ModelHooks<Model<any, any>, any>>;
    static hasHook: <HookName extends keyof import("./model-hooks.js").ModelHooks<Model<any, any>, any>>(this: {
        hooks: import("./hooks.js").HookHandler<import("./model-hooks.js").ModelHooks<Model<any, any>, any>>;
    }, hookName: HookName) => boolean;
    static hasHooks: <HookName extends keyof import("./model-hooks.js").ModelHooks<Model<any, any>, any>>(this: {
        hooks: import("./hooks.js").HookHandler<import("./model-hooks.js").ModelHooks<Model<any, any>, any>>;
    }, hookName: HookName) => boolean;
    static removeHook: <HookName extends keyof import("./model-hooks.js").ModelHooks<Model<any, any>, any>>(this: {
        /**
         * @deprecated use {@link modelDefinition}'s {@link ModelDefinition#rawAttributes} or {@link ModelDefinition#attributes} instead.
         */
        hooks: import("./hooks.js").HookHandler<import("./model-hooks.js").ModelHooks<Model<any, any>, any>>;
    }, hookName: HookName, listenerNameOrListener: string | import("./model-hooks.js").ModelHooks<Model<any, any>, any>[HookName]) => void;
    static runHooks: import("./hooks-legacy.js").LegacyRunHookFunction<import("./model-hooks.js").ModelHooks<Model<any, any>, any>, void>;
    static beforeValidate: import("./hooks-legacy.js").LegacyAddHookFunction<(instance: Model<any, any>, options: import("./instance-validator.js").ValidationOptions) => import("./hooks.js").AsyncHookReturn>;
    static afterValidate: import("./hooks-legacy.js").LegacyAddHookFunction<(instance: Model<any, any>, options: import("./instance-validator.js").ValidationOptions) => import("./hooks.js").AsyncHookReturn>;
    static validationFailed: import("./hooks-legacy.js").LegacyAddHookFunction<(instance: Model<any, any>, options: import("./instance-validator.js").ValidationOptions, error: unknown) => import("./hooks.js").AsyncHookReturn>;
    static beforeCreate: import("./hooks-legacy.js").LegacyAddHookFunction<(attributes: Model<any, any>, options: import("./model.js").CreateOptions<any>) => import("./hooks.js").AsyncHookReturn>;
    static afterCreate: import("./hooks-legacy.js").LegacyAddHookFunction<(attributes: Model<any, any>, options: import("./model.js").CreateOptions<any>) => import("./hooks.js").AsyncHookReturn>;
    static beforeDestroy: import("./hooks-legacy.js").LegacyAddHookFunction<(instance: Model<any, any>, options: import("./model.js").InstanceDestroyOptions) => import("./hooks.js").AsyncHookReturn>;
    static afterDestroy: import("./hooks-legacy.js").LegacyAddHookFunction<(instance: Model<any, any>, options: import("./model.js").InstanceDestroyOptions) => import("./hooks.js").AsyncHookReturn>;
    static beforeRestore: import("./hooks-legacy.js").LegacyAddHookFunction<(instance: Model<any, any>, options: import("./model.js").InstanceRestoreOptions) => import("./hooks.js").AsyncHookReturn>;
    static afterRestore: import("./hooks-legacy.js").LegacyAddHookFunction<(instance: Model<any, any>, options: import("./model.js").InstanceRestoreOptions) => import("./hooks.js").AsyncHookReturn>;
    static beforeUpdate: import("./hooks-legacy.js").LegacyAddHookFunction<(instance: Model<any, any>, options: import("./model.js").InstanceUpdateOptions<any>) => import("./hooks.js").AsyncHookReturn>;
    static afterUpdate: import("./hooks-legacy.js").LegacyAddHookFunction<(instance: Model<any, any>, options: import("./model.js").InstanceUpdateOptions<any>) => import("./hooks.js").AsyncHookReturn>;
    static beforeUpsert: import("./hooks-legacy.js").LegacyAddHookFunction<(attributes: Model<any, any>, options: import("./model.js").UpsertOptions<any>) => import("./hooks.js").AsyncHookReturn>;
    static afterUpsert: import("./hooks-legacy.js").LegacyAddHookFunction<(attributes: [Model<any, any>, boolean | null], options: import("./model.js").UpsertOptions<any>) => import("./hooks.js").AsyncHookReturn>;
    static beforeSave: import("./hooks-legacy.js").LegacyAddHookFunction<(instance: Model<any, any>, options: import("./model.js").CreateOptions<any> | import("./model.js").InstanceUpdateOptions<any>) => import("./hooks.js").AsyncHookReturn>;
    static afterSave: import("./hooks-legacy.js").LegacyAddHookFunction<(instance: Model<any, any>, options: import("./model.js").CreateOptions<any> | import("./model.js").InstanceUpdateOptions<any>) => import("./hooks.js").AsyncHookReturn>;
    static beforeBulkCreate: import("./hooks-legacy.js").LegacyAddHookFunction<(instances: Model<any, any>[], options: import("./model.js").BulkCreateOptions<any>) => import("./hooks.js").AsyncHookReturn>;
    static afterBulkCreate: import("./hooks-legacy.js").LegacyAddHookFunction<(instances: readonly Model<any, any>[], options: import("./model.js").BulkCreateOptions<any>) => import("./hooks.js").AsyncHookReturn>;
    static beforeBulkDestroy: import("./hooks-legacy.js").LegacyAddHookFunction<(options: import("./model.js").DestroyOptions<any>) => import("./hooks.js").AsyncHookReturn>;
    static afterBulkDestroy: import("./hooks-legacy.js").LegacyAddHookFunction<(options: import("./model.js").DestroyOptions<any>) => import("./hooks.js").AsyncHookReturn>;
    static beforeBulkRestore: import("./hooks-legacy.js").LegacyAddHookFunction<(options: import("./model.js").RestoreOptions<any>) => import("./hooks.js").AsyncHookReturn>;
    static afterBulkRestore: import("./hooks-legacy.js").LegacyAddHookFunction<(options: import("./model.js").RestoreOptions<any>) => import("./hooks.js").AsyncHookReturn>;
    static beforeBulkUpdate: import("./hooks-legacy.js").LegacyAddHookFunction<(options: import("./model.js").UpdateOptions<any>) => import("./hooks.js").AsyncHookReturn>;
    static afterBulkUpdate: import("./hooks-legacy.js").LegacyAddHookFunction<(options: import("./model.js").UpdateOptions<any>) => import("./hooks.js").AsyncHookReturn>;
    static beforeCount: import("./hooks-legacy.js").LegacyAddHookFunction<(options: import("./model.js").CountOptions<any>) => import("./hooks.js").AsyncHookReturn>;
    static beforeFind: import("./hooks-legacy.js").LegacyAddHookFunction<(options: import("./model.js").FindOptions<any>) => import("./hooks.js").AsyncHookReturn>;
    static beforeFindAfterExpandIncludeAll: import("./hooks-legacy.js").LegacyAddHookFunction<(options: import("./model.js").FindOptions<any>) => import("./hooks.js").AsyncHookReturn>;
    static beforeFindAfterOptions: import("./hooks-legacy.js").LegacyAddHookFunction<(options: import("./model.js").FindOptions<any>) => import("./hooks.js").AsyncHookReturn>;
    static afterFind: import("./hooks-legacy.js").LegacyAddHookFunction<(instancesOrInstance: Model<any, any> | readonly Model<any, any>[] | null, options: import("./model.js").FindOptions<any>) => import("./hooks.js").AsyncHookReturn>;
    static beforeSync: import("./hooks-legacy.js").LegacyAddHookFunction<(options: import("./sequelize.js").SyncOptions) => import("./hooks.js").AsyncHookReturn>;
    static afterSync: import("./hooks-legacy.js").LegacyAddHookFunction<(options: import("./sequelize.js").SyncOptions) => import("./hooks.js").AsyncHookReturn>;
    static beforeAssociate: import("./hooks-legacy.js").LegacyAddHookFunction<(data: import(".").BeforeAssociateEventData, options: import(".").AssociationOptions<any>) => import("./hooks.js").AsyncHookReturn>;
    static afterAssociate: import("./hooks-legacy.js").LegacyAddHookFunction<(data: import(".").AfterAssociateEventData, options: import(".").AssociationOptions<any>) => import("./hooks.js").AsyncHookReturn>;
    /**
     * Initialize a model, representing a table in the DB, with attributes and options.
     *
     * The table columns are defined by the hash that is given as the first argument.
     * Each attribute of the hash represents a column.
     *
     * @example
     * ```javascript
     * Project.init({
     *   columnA: {
     *     type: Sequelize.BOOLEAN,
     *     validate: {
     *       is: ['[a-z]','i'],        // will only allow letters
     *       max: 23,                  // only allow values <= 23
     *       isIn: {
     *         args: [['en', 'zh']],
     *         msg: "Must be English or Chinese"
     *       }
     *     },
     *     field: 'column_a'
     *     // Other attributes here
     *   },
     *   columnB: Sequelize.STRING,
     *   columnC: 'MY VERY OWN COLUMN TYPE'
     * }, {sequelize})
     * ```
     *
     * sequelize.models.modelName // The model will now be available in models under the class name
     *
     * @see https://sequelize.org/docs/v7/core-concepts/model-basics/
     * @see https://sequelize.org/docs/v7/core-concepts/validations-and-constraints/
     *
     * @param attributes An object, where each attribute is a column of the table. Each column can be either a
     *   DataType, a string or a type-description object.
     * @param options These options are merged with the default define options provided to the Sequelize constructor
     */
    static init<MS extends ModelStatic, M extends InstanceType<MS>>(this: MS, attributes: ModelAttributes<M, PartialBy<Attributes<M>, BrandedKeysOf<Attributes<M>, typeof ForeignKeyBrand>>>, options: InitOptions<M>): MS;
    static getIndexes(): readonly IndexOptions[];
    /**
     * Unique indexes that can be declared as part of a CREATE TABLE query.
     *
     * @deprecated prefer using {@link getIndexes}, this will eventually be removed.
     */
    static get uniqueKeys(): any;
    private static get _indexes();
    /**
     * Refreshes the Model's attribute definition.
     *
     * @deprecated use {@link modelDefinition}.
     */
    static refreshAttributes(): void;
    static assertIsInitialized(): void;
    static isInitialized(): boolean;
    /**
     * Get the table name of the model, taking schema into account. The method will an object with `tableName`, `schema` and `delimiter` properties.
     *
     * @deprecated use {@link modelDefinition} or {@link table}.
     */
    static getTableName(): TableNameWithSchema;
}
export declare function initModel(model: ModelStatic, attributes: ModelAttributes, options: InitOptions): void;
