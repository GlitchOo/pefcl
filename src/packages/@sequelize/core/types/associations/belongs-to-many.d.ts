import type { AttributeNames, Attributes, BulkCreateOptions, CreateOptions, CreationAttributes, Filterable, FindAttributeOptions, FindOptions, InstanceDestroyOptions, InstanceUpdateOptions, Model, ModelOptions, ModelStatic, Transactionable, WhereOptions } from '../model';
import type { AllowArray } from '../utils/types.js';
import type { Association, AssociationOptions, AssociationScope, ForeignKeyOptions, MultiAssociationAccessors, MultiAssociationOptions, NormalizedAssociationOptions } from './base';
import { MultiAssociation } from './base';
import type { BelongsTo } from './belongs-to';
import { HasMany } from './has-many';
import { HasOne } from './has-one';
import type { MaybeForwardedModelStatic } from './helpers';
/**
 * Many-to-many association with a join/through table.
 * See {@link Model.belongsToMany}
 *
 * When the join table has additional attributes, these can be passed in the options object:
 *
 * ```js
 * UserProject = sequelize.define('user_project', {
 *   role: DataTypes.STRING
 * });
 * User.belongsToMany(Project, { through: UserProject });
 * Project.belongsToMany(User, { through: UserProject });
 * // through is required!
 *
 * user.addProject(project, { through: { role: 'manager' }});
 * ```
 *
 * All methods allow you to pass either a persisted instance, its primary key, or a mixture:
 *
 * ```js
 * const project = await Project.create({ id: 11 });
 * await user.addProjects([project, 12]);
 * ```
 *
 * If you want to set several target instances, but with different attributes you have to set the attributes on the instance, using a property with the name of the through model:
 *
 * ```js
 * p1.UserProjects = {
 *   started: true
 * }
 * user.setProjects([p1, p2], { through: { started: false }}) // The default value is false, but p1 overrides that.
 * ```
 *
 * Similarly, when fetching through a join table with custom attributes, these attributes will be available as an object with the name of the through model.
 * ```js
 * const projects = await user.getProjects();
 * const p1 = projects[0];
 * p1.UserProjects.started // Is this project started yet?
 * ```
 *
 * In the API reference below, add the name of the association to the method, e.g. for `User.belongsToMany(Project)` the getter will be `user.getProjects()`.
 */
export declare class BelongsToMany<SourceModel extends Model = Model, TargetModel extends Model = Model, ThroughModel extends Model = Model, SourceKey extends AttributeNames<SourceModel> = any, TargetKey extends AttributeNames<TargetModel> = any> extends MultiAssociation<SourceModel, TargetModel, string, TargetKey, NormalizedBelongsToManyOptions<SourceKey, TargetKey, ThroughModel>> {
    #private;
    readonly accessors: MultiAssociationAccessors;
    get foreignKey(): string;
    /**
     * The name of the Foreign Key attribute, located on the through table, that points to the Target model.
     *
     * Not to be confused with @link {BelongsToMany.foreignKey}, which points to the Source model instead.
     */
    get otherKey(): string;
    /**
     * @deprecated use {@link BelongsToMany#foreignKey}
     */
    get identifier(): string;
    /**
     * The corresponding column name of {@link BelongsToMany#foreignKey}
     */
    get identifierField(): string;
    /**
     * The corresponding column name of {@link BelongsToMany#otherKey}
     */
    get foreignIdentifierField(): string;
    /**
     * The name of the Attribute that the {@link foreignKey} fk (located on the Through Model) will reference on the Source model.
     */
    get sourceKey(): SourceKey;
    /**
     * The name of the Column that the {@link foreignKey} fk (located on the Through Table) will reference on the Source model.
     */
    get sourceKeyField(): string;
    /**
     * The name of the Attribute that the {@link otherKey} fk (located on the Through Model) will reference on the Target model.
     */
    get targetKey(): TargetKey;
    /**
     * The name of the Column that the {@link otherKey} fk (located on the Through Table) will reference on the Target model.
     */
    get targetKeyField(): string;
    /**
     * The corresponding association this entity is paired with.
     */
    pairedWith: BelongsToMany<TargetModel, SourceModel, ThroughModel, TargetKey, SourceKey>;
    readonly fromSourceToThrough: HasMany<SourceModel, ThroughModel, SourceKey, any>;
    readonly fromSourceToThroughOne: HasOne<SourceModel, ThroughModel, SourceKey, any>;
    get fromThroughToSource(): BelongsTo<ThroughModel, SourceModel, any, SourceKey>;
    get fromTargetToThrough(): HasMany<TargetModel, ThroughModel, TargetKey, any>;
    get fromTargetToThroughOne(): HasOne<TargetModel, ThroughModel, TargetKey, any>;
    get fromThroughToTarget(): BelongsTo<ThroughModel, TargetModel, any, TargetKey>;
    get through(): NormalizedThroughOptions<ThroughModel>;
    get throughModel(): ModelStatic<ThroughModel>;
    constructor(secret: symbol, source: ModelStatic<SourceModel>, target: ModelStatic<TargetModel>, options: NormalizedBelongsToManyOptions<SourceKey, TargetKey, ThroughModel>, pair?: BelongsToMany<TargetModel, SourceModel, ThroughModel, TargetKey, SourceKey>, parent?: Association<any>);
    static associate<S extends Model, T extends Model, ThroughModel extends Model, SourceKey extends AttributeNames<S>, TargetKey extends AttributeNames<T>>(secret: symbol, source: ModelStatic<S>, target: ModelStatic<T>, options: BelongsToManyOptions<SourceKey, TargetKey, ThroughModel>, pair?: BelongsToMany<T, S, ThroughModel, TargetKey, SourceKey>, parent?: Association<any>): BelongsToMany<S, T, ThroughModel, SourceKey, TargetKey>;
    /**
     * Get everything currently associated with this, using an optional where clause.
     *
     * See {@link Model} for a full explanation of options
     *
     * @param instance instance
     * @param options find options
     */
    get(instance: SourceModel, options?: BelongsToManyGetAssociationsMixinOptions<TargetModel>): Promise<TargetModel[]>;
    /**
     * Count everything currently associated with this, using an optional where clause.
     *
     * @param instance instance
     * @param options find options
     */
    count(instance: SourceModel, options?: BelongsToManyCountAssociationsMixinOptions<TargetModel>): Promise<number>;
    /**
     * Check if one or more instance(s) are associated with this. If a list of instances is passed, the function returns true if _all_ instances are associated
     *
     * @param sourceInstance source instance to check for an association with
     * @param targetInstancesOrPks Can be an array of instances or their primary keys
     * @param options Options passed to getAssociations
     */
    has(sourceInstance: SourceModel, targetInstancesOrPks: AllowArray<TargetModel | Exclude<TargetModel[TargetKey], any[]>>, options?: BelongsToManyHasAssociationMixinOptions<TargetModel>): Promise<boolean>;
    /**
     * Set the associated models by passing an array of instances or their primary keys.
     * Everything that it not in the passed array will be un-associated.
     *
     * @param sourceInstance source instance to associate new instances with
     * @param newInstancesOrPrimaryKeys A single instance or primary key, or a mixed array of persisted instances or primary keys
     * @param options Options passed to `through.findAll`, `bulkCreate`, `update` and `destroy`
     */
    set(sourceInstance: SourceModel, newInstancesOrPrimaryKeys: AllowArray<TargetModel | Exclude<TargetModel[TargetKey], any[]>>, options?: BelongsToManySetAssociationsMixinOptions<TargetModel>): Promise<void>;
    /**
     * Associate one or several rows with source instance. It will not un-associate any already associated instance
     * that may be missing from `newInstances`.
     *
     * @param sourceInstance source instance to associate new instances with
     * @param newInstancesOrPrimaryKeys A single instance or primary key, or a mixed array of persisted instances or primary keys
     * @param options Options passed to `through.findAll`, `bulkCreate` and `update`
     */
    add(sourceInstance: SourceModel, newInstancesOrPrimaryKeys: AllowArray<TargetModel | Exclude<TargetModel[TargetKey], any[]>>, options?: BelongsToManyAddAssociationsMixinOptions<TargetModel>): Promise<void>;
    /**
     * Un-associate one or more instance(s).
     *
     * @param sourceInstance instance to un associate instances with
     * @param targetInstanceOrPks Can be an Instance or its primary key, or a mixed array of instances and primary keys
     * @param options Options passed to `through.destroy`
     */
    remove(sourceInstance: SourceModel, targetInstanceOrPks: AllowArray<TargetModel | Exclude<TargetModel[TargetKey], any[]>>, options?: BelongsToManyRemoveAssociationMixinOptions): Promise<void>;
    /**
     * Create a new instance of the associated model and associate it with this.
     *
     * @param sourceInstance source instance
     * @param values values for target model
     * @param options Options passed to create and add
     */
    create(sourceInstance: SourceModel, values?: CreationAttributes<TargetModel>, options?: BelongsToManyCreateAssociationMixinOptions<TargetModel> | BelongsToManyCreateAssociationMixinOptions<TargetModel>['fields']): Promise<TargetModel>;
}
/**
 * Used for the through table in n:m associations.
 *
 * Used in {@link BelongsToManyOptions.through}
 */
export interface ThroughOptions<ThroughModel extends Model> {
    /**
     * The model used to join both sides of the N:M association.
     * Can be a string if you want the model to be generated by sequelize.
     */
    model: MaybeForwardedModelStatic<ThroughModel> | string;
    /**
     * See {@link ModelOptions.timestamps}
     */
    timestamps?: ModelOptions['timestamps'];
    /**
     * See {@link ModelOptions.paranoid}
     */
    paranoid?: ModelOptions['paranoid'];
    /**
     * A key/value set that will be used for association create and find defaults on the through model.
     * (Remember to add the attributes to the through model)
     */
    scope?: AssociationScope;
    /**
     * If true a unique constraint will be added on the foreign key pair.
     * If set to a string, the generated unique key will use the string as its name.
     * If set to false, no unique constraint will be added.
     * Useful if you want to turn this off and create your own unique constraint when using scopes.
     *
     * This option only works if the model already has a Primary Key,
     * as the unique constraint will not be added if the foreign keys are already part of the composite primary key.
     *
     * @default true
     */
    unique?: boolean | string;
}
/**
 * Attributes for the join table
 */
export interface JoinTableAttributes {
    [attribute: string]: unknown;
}
type NormalizedBelongsToManyOptions<SourceKey extends string, TargetKey extends string, ThroughModel extends Model> = Omit<BelongsToManyOptions<SourceKey, TargetKey, ThroughModel>, 'through' | 'as' | 'hooks' | 'foreignKey'> & {
    through: NormalizedThroughOptions<ThroughModel>;
} & Pick<NormalizedAssociationOptions<string>, 'as' | 'name' | 'hooks' | 'foreignKey'>;
type NormalizedThroughOptions<ThroughModel extends Model> = Omit<ThroughOptions<ThroughModel>, 'model'> & {
    model: ModelStatic<ThroughModel>;
};
/**
 * Options provided when associating models with belongsToMany relationship.
 *
 * Used by {@link Model.belongsToMany}.
 */
export interface BelongsToManyOptions<SourceKey extends string = string, TargetKey extends string = string, ThroughModel extends Model = Model> extends MultiAssociationOptions<AttributeNames<ThroughModel>> {
    /**
     * Configures this association on the target model.
     */
    inverse?: {
        as?: AssociationOptions<string>['as'];
        scope?: MultiAssociationOptions<string>['scope'];
        foreignKeyConstraints?: AssociationOptions<string>['foreignKeyConstraints'];
    };
    /**
     * Should "ON UPDATE", "ON DELETE" and "REFERENCES" constraints be enabled on the foreign key?
     *
     * This only affects the foreign key that points to the source model.
     * to control the one that points to the target model, set the "foreignKeyConstraints" option in {@link BelongsToManyOptions.inverse}.
     */
    foreignKeyConstraints?: boolean;
    /**
     * The name of the table that is used to join source and target in n:m associations. Can also be a
     * sequelize model if you want to define the junction table yourself and add extra attributes to it.
     */
    through: MaybeForwardedModelStatic<ThroughModel> | string | ThroughOptions<ThroughModel>;
    /**
     * The name of the foreign key in the join table (representing the target model) or an object representing
     * the type definition for the other column (see `Sequelize.define` for syntax). When using an object, you
     * can add a `name` property to set the name of the colum. Defaults to the name of target + primary key of
     * target
     */
    otherKey?: AttributeNames<ThroughModel> | ForeignKeyOptions<AttributeNames<ThroughModel>>;
    /**
     * The name of the field to use as the key for the association in the source table. Defaults to the primary
     * key of the source table
     */
    sourceKey?: SourceKey;
    /**
     * The name of the field to use as the key for the association in the target table. Defaults to the primary
     * key of the target table
     */
    targetKey?: TargetKey;
}
/**
 * The options for the getAssociations mixin of the belongsToMany association.
 *
 * @see BelongsToManyGetAssociationsMixin
 */
export interface BelongsToManyGetAssociationsMixinOptions<T extends Model> extends FindOptions<Attributes<T>> {
    /**
     * A list of the attributes from the join table that you want to select.
     */
    joinTableAttributes?: FindAttributeOptions;
    /**
     * Apply a scope on the related model, or remove its default scope by passing false.
     */
    scope?: string | boolean;
    /**
     * Apply a schema on the related model
     */
    schema?: string;
    schemaDelimiter?: string;
    through?: {
        where?: WhereOptions;
        paranoid?: boolean;
    };
}
/**
 * The getAssociations mixin applied to models with belongsToMany.
 * An example of usage is as follows:
 *
 * ```typescript
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *  declare getRoles: BelongsToManyGetAssociationsMixin<Role>;
 * }
 *
 * User.belongsToMany(Role, { through: UserRole });
 * ```
 *
 * @see Model.belongsToMany
 */
export type BelongsToManyGetAssociationsMixin<T extends Model> = (options?: BelongsToManyGetAssociationsMixinOptions<T>) => Promise<T[]>;
/**
 * The options for the setAssociations mixin of the belongsToMany association.
 *
 * @see BelongsToManySetAssociationsMixin
 */
export interface BelongsToManySetAssociationsMixinOptions<TargetModel extends Model> extends FindOptions<Attributes<TargetModel>>, BulkCreateOptions<Attributes<TargetModel>>, InstanceUpdateOptions<Attributes<TargetModel>>, InstanceDestroyOptions {
    /**
     * Additional attributes for the join table.
     */
    through?: JoinTableAttributes;
}
/**
 * The setAssociations mixin applied to models with belongsToMany.
 * An example of usage is as follows:
 *
 * ```typescript
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   declare setRoles: BelongsToManySetAssociationsMixin<Role, Role['id']>;
 * }
 *
 * User.belongsToMany(Role, { through: UserRole });
 * ```
 *
 * @see Model.belongsToMany
 */
export type BelongsToManySetAssociationsMixin<TModel extends Model, TModelPrimaryKey> = (newAssociations?: Array<TModel | TModelPrimaryKey>, options?: BelongsToManySetAssociationsMixinOptions<TModel>) => Promise<void>;
/**
 * The options for the addAssociations mixin of the belongsToMany association.
 *
 * @see BelongsToManyAddAssociationsMixin
 */
export interface BelongsToManyAddAssociationsMixinOptions<TModel extends Model> extends FindOptions<Attributes<TModel>>, BulkCreateOptions<Attributes<TModel>>, InstanceUpdateOptions<Attributes<TModel>>, InstanceDestroyOptions {
    through?: JoinTableAttributes;
}
/**
 * The addAssociations mixin applied to models with belongsToMany.
 * An example of usage is as follows:
 *
 * ```typescript
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   declare addRoles: BelongsToManyAddAssociationsMixin<Role, Role['id']>;
 * }
 *
 * User.belongsToMany(Role, { through: UserRole });
 * ```
 *
 * @see Model.belongsToMany
 */
export type BelongsToManyAddAssociationsMixin<T extends Model, TModelPrimaryKey> = (newAssociations?: Array<T | TModelPrimaryKey>, options?: BelongsToManyAddAssociationsMixinOptions<T>) => Promise<void>;
/**
 * The options for the addAssociation mixin of the belongsToMany association.
 *
 * @see BelongsToManyAddAssociationMixin
 */
export interface BelongsToManyAddAssociationMixinOptions<T extends Model> extends FindOptions<Attributes<T>>, BulkCreateOptions<Attributes<T>>, InstanceUpdateOptions<Attributes<T>>, InstanceDestroyOptions {
    through?: JoinTableAttributes;
}
/**
 * The addAssociation mixin applied to models with belongsToMany.
 * An example of usage is as follows:
 *
 * ```typescript
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   declare addRole: BelongsToManyAddAssociationMixin<Role, Role['id']>;
 * }
 *
 * User.belongsToMany(Role, { through: UserRole });
 * ```
 *
 * @see Model.belongsToMany
 */
export type BelongsToManyAddAssociationMixin<T extends Model, TModelPrimaryKey> = (newAssociation?: T | TModelPrimaryKey, options?: BelongsToManyAddAssociationMixinOptions<T>) => Promise<void>;
/**
 * The options for the createAssociation mixin of the belongsToMany association.
 *
 * @see BelongsToManyCreateAssociationMixin
 */
export interface BelongsToManyCreateAssociationMixinOptions<T extends Model> extends CreateOptions<Attributes<T>> {
    through?: JoinTableAttributes;
}
/**
 * The createAssociation mixin applied to models with belongsToMany.
 * An example of usage is as follows:
 *
 * ```typescript
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   declare createRole: BelongsToManyCreateAssociationMixin<Role>;
 * }
 *
 * User.belongsToMany(Role, { through: UserRole });
 * ```
 *
 * @see Model.belongsToMany
 */
export type BelongsToManyCreateAssociationMixin<T extends Model> = (values?: CreationAttributes<T>, options?: BelongsToManyCreateAssociationMixinOptions<T>) => Promise<T>;
/**
 * The options for the removeAssociation mixin of the belongsToMany association.
 *
 * @see BelongsToManyRemoveAssociationMixin
 */
export interface BelongsToManyRemoveAssociationMixinOptions extends InstanceDestroyOptions {
}
/**
 * The removeAssociation mixin applied to models with belongsToMany.
 * An example of usage is as follows:
 *
 * ```typescript
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   declare removeRole: BelongsToManyRemoveAssociationMixin<Role, Role['id']>;
 * }
 *
 * User.belongsToMany(Role, { through: UserRole });
 * ```
 *
 * @see Model.belongsToMany
 */
export type BelongsToManyRemoveAssociationMixin<TModel, TModelPrimaryKey> = (oldAssociated?: TModel | TModelPrimaryKey, options?: BelongsToManyRemoveAssociationMixinOptions) => Promise<void>;
/**
 * The options for the removeAssociations mixin of the belongsToMany association.
 *
 * @see BelongsToManyRemoveAssociationsMixin
 */
export interface BelongsToManyRemoveAssociationsMixinOptions extends InstanceDestroyOptions, InstanceDestroyOptions {
}
/**
 * The removeAssociations mixin applied to models with belongsToMany.
 * An example of usage is as follows:
 *
 * ```typescript
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   declare removeRoles: BelongsToManyRemoveAssociationsMixin<Role, Role['id']>;
 * }
 *
 * User.belongsToMany(Role, { through: UserRole });
 * ```
 *
 * @see Model.belongsToMany
 */
export type BelongsToManyRemoveAssociationsMixin<TModel, TModelPrimaryKey> = (associationsToRemove?: Array<TModel | TModelPrimaryKey>, options?: BelongsToManyRemoveAssociationsMixinOptions) => Promise<void>;
/**
 * The options for the hasAssociation mixin of the belongsToMany association.
 *
 * @see BelongsToManyHasAssociationMixin
 */
export interface BelongsToManyHasAssociationMixinOptions<T extends Model> extends BelongsToManyGetAssociationsMixinOptions<T> {
}
/**
 * The hasAssociation mixin applied to models with belongsToMany.
 * An example of usage is as follows:
 *
 * ```typescript
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   declare hasRole: BelongsToManyHasAssociationMixin<Role, Role['id']>;
 * }
 *
 * User.belongsToMany(Role, { through: UserRole });
 * ```
 *
 * @see Model.belongsToMany
 */
export type BelongsToManyHasAssociationMixin<TModel extends Model, TModelPrimaryKey> = (target: TModel | TModelPrimaryKey, options?: BelongsToManyHasAssociationMixinOptions<TModel>) => Promise<boolean>;
/**
 * The options for the hasAssociations mixin of the belongsToMany association.
 *
 * @see BelongsToManyHasAssociationsMixin
 */
export interface BelongsToManyHasAssociationsMixinOptions<T extends Model> extends BelongsToManyGetAssociationsMixinOptions<T> {
}
/**
 * The removeAssociations mixin applied to models with belongsToMany.
 * An example of usage is as follows:
 *
 * ```typescript
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   declare hasRoles: BelongsToManyHasAssociationsMixin<Role, Role['id']>;
 * }
 *
 * User.belongsToMany(Role, { through: UserRole });
 * ```
 *
 * @see Model.belongsToMany
 */
export type BelongsToManyHasAssociationsMixin<TModel extends Model, TModelPrimaryKey> = (targets: Array<TModel | TModelPrimaryKey>, options?: BelongsToManyHasAssociationsMixinOptions<TModel>) => Promise<boolean>;
/**
 * The options for the countAssociations mixin of the belongsToMany association.
 *
 * @see BelongsToManyCountAssociationsMixin
 */
export interface BelongsToManyCountAssociationsMixinOptions<T extends Model> extends Transactionable, Filterable<Attributes<T>> {
    /**
     * Apply a scope on the related model, or remove its default scope by passing false.
     */
    scope?: string | boolean;
}
/**
 * The countAssociations mixin applied to models with belongsToMany.
 * An example of usage is as follows:
 *
 * ```typescript
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   declare countRoles: Sequelize.BelongsToManyCountAssociationsMixin;
 * }
 *
 * User.belongsToMany(Role, { through: UserRole });
 * ```
 *
 * @see Model.belongsToMany
 */
export type BelongsToManyCountAssociationsMixin<T extends Model> = (options?: BelongsToManyCountAssociationsMixinOptions<T>) => Promise<number>;
export {};
