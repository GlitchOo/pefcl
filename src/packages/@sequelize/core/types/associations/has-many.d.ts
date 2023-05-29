import type { Model, CreateOptions, CreationAttributes, Filterable, FindOptions, InstanceUpdateOptions, Transactionable, ModelStatic, AttributeNames, Attributes } from '../model';
import type { AllowArray } from '../utils/types.js';
import type { MultiAssociationAccessors, MultiAssociationOptions, Association, AssociationOptions } from './base';
import { MultiAssociation } from './base';
import { BelongsTo } from './belongs-to.js';
import type { NormalizeBaseAssociationOptions } from './helpers';
/**
 * One-to-many association.
 * See {@link Model.hasMany}
 *
 * Like with {@link HasOne}, the foreign key will be defined on the target model.
 *
 * In the API reference below, add the name of the association to the method, e.g. for `User.hasMany(Project)` the getter will be `user.getProjects()`.
 * If the association is aliased, use the alias instead, e.g. `User.hasMany(Project, { as: 'jobs' })` will be `user.getJobs()`.
 *
 * @typeParam S The model on which {@link Model.hasMany} has been called, on which the association methods will be added.
 * @typeParam T The model passed to {@link Model.hasMany}. This model will receive the Foreign Key attribute.
 * @typeParam SourceKey The name of the attribute that the foreign key in the target model will reference.
 * @typeParam TargetKey The name of the Foreign Key attribute on the Target model.
 * @typeParam TargetPrimaryKey The name of the Primary Key attribute of the Target model. Used by {@link HasManySetAssociationsMixin} & others.
 */
export declare class HasMany<S extends Model = Model, T extends Model = Model, SourceKey extends AttributeNames<S> = any, TargetKey extends AttributeNames<T> = any, TargetPrimaryKey extends AttributeNames<T> = any> extends MultiAssociation<S, T, TargetKey, TargetPrimaryKey, NormalizedHasManyOptions<SourceKey, TargetKey>> {
    #private;
    accessors: MultiAssociationAccessors;
    get foreignKey(): TargetKey;
    /**
     * The column name of the foreign key (on the target model)
     */
    get identifierField(): string;
    /**
     * The name of the attribute the foreign key points to.
     *
     * This key is on the Source Model.
     * The {@link Association.foreignKey} is on the Target Model.
     */
    get sourceKey(): SourceKey;
    /**
     * @deprecated use {@link sourceKey}
     */
    get sourceKeyAttribute(): SourceKey;
    get sourceKeyField(): string;
    readonly inverse: BelongsTo<T, S, TargetKey, SourceKey>;
    constructor(secret: symbol, source: ModelStatic<S>, target: ModelStatic<T>, options: NormalizedHasManyOptions<SourceKey, TargetKey>, parent?: Association);
    static associate<S extends Model, T extends Model, SourceKey extends AttributeNames<S>, TargetKey extends AttributeNames<T>>(secret: symbol, source: ModelStatic<S>, target: ModelStatic<T>, options?: HasManyOptions<SourceKey, TargetKey>, parent?: Association<any>): HasMany<S, T, SourceKey, TargetKey>;
    /**
     * Get everything currently associated with this, using an optional where clause.
     *
     * @param instances source instances
     * @param options find options
     */
    get(instances: S, options?: HasManyGetAssociationsMixinOptions<T>): Promise<T[]>;
    get(instances: S[], options?: HasManyGetAssociationsMixinOptions<T>): Promise<Map<any, T[]>>;
    /**
     * Count everything currently associated with this, using an optional where clause.
     *
     * @param instance the source instance
     * @param options find & count options
     */
    count(instance: S, options?: HasManyCountAssociationsMixinOptions<T>): Promise<number>;
    /**
     * Check if one or more rows are associated with `this`.
     *
     * @param sourceInstance the source instance
     * @param targetInstances Can be an array of instances or their primary keys
     * @param options Options passed to getAssociations
     */
    has(sourceInstance: S, targetInstances: AllowArray<T | Exclude<T[TargetPrimaryKey], any[]>>, options?: HasManyHasAssociationsMixinOptions<T>): Promise<boolean>;
    /**
     * Set the associated models by passing an array of persisted instances or their primary keys. Everything that is not in the passed array will be un-associated
     *
     * @param sourceInstance source instance to associate new instances with
     * @param rawTargetInstances An array of persisted instances or primary key of instances to associate with this. Pass `null` to remove all associations.
     * @param options Options passed to `target.findAll` and `update`.
     */
    set(sourceInstance: S, rawTargetInstances: AllowArray<T | Exclude<T[TargetPrimaryKey], any[]>> | null, options?: HasManySetAssociationsMixinOptions<T>): Promise<void>;
    /**
     * Associate one or more target rows with `this`. This method accepts a Model / string / number to associate a single row,
     * or a mixed array of Model / string / numbers to associate multiple rows.
     *
     * @param sourceInstance the source instance
     * @param [rawTargetInstances] A single instance or primary key, or a mixed array of persisted instances or primary keys
     * @param [options] Options passed to `target.update`.
     */
    add(sourceInstance: S, rawTargetInstances: AllowArray<T | Exclude<T[TargetPrimaryKey], any[]>>, options?: HasManyAddAssociationsMixinOptions<T>): Promise<void>;
    /**
     * Un-associate one or several target rows.
     *
     * @param sourceInstance instance to un associate instances with
     * @param targetInstances Can be an Instance or its primary key, or a mixed array of instances and primary keys
     * @param options Options passed to `target.update`
     */
    remove(sourceInstance: S, targetInstances: AllowArray<T | Exclude<T[TargetPrimaryKey], any[]>>, options?: HasManyRemoveAssociationsMixinOptions<T>): Promise<void>;
    /**
     * Create a new instance of the associated model and associate it with this.
     *
     * @param sourceInstance source instance
     * @param values values for target model instance
     * @param options Options passed to `target.create`
     */
    create(sourceInstance: S, values?: CreationAttributes<T>, options?: HasManyCreateAssociationMixinOptions<T> | HasManyCreateAssociationMixinOptions<T>['fields']): Promise<T>;
}
export type NormalizedHasManyOptions<SourceKey extends string, TargetKey extends string> = NormalizeBaseAssociationOptions<HasManyOptions<SourceKey, TargetKey>>;
/**
 * Options provided when associating models with hasMany relationship
 */
export interface HasManyOptions<SourceKey extends string, TargetKey extends string> extends MultiAssociationOptions<TargetKey> {
    /**
     * The name of the field to use as the key for the association in the source table. Defaults to the primary
     * key of the source table
     */
    sourceKey?: SourceKey;
    inverse?: {
        as?: AssociationOptions<any>['as'];
        scope?: AssociationOptions<any>['scope'];
    };
}
/**
 * The options for the getAssociations mixin of the hasMany association.
 *
 * Can provide an optional where clause to limit the associated models through {@link HasManyGetAssociationsMixinOptions.where}.
 *
 * @see HasManyGetAssociationsMixin
 */
export interface HasManyGetAssociationsMixinOptions<T extends Model> extends FindOptions<Attributes<T>> {
    /**
     * Apply a scope on the related model, or remove its default scope by passing false.
     */
    scope?: string | string[] | boolean;
    /**
     * Apply a schema on the related model
     */
    schema?: string;
    schemaDelimiter?: string;
}
/**
 * The getAssociations mixin applied to models with hasMany.
 * An example of usage is as follows:
 *
 * ```typescript
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   declare getRoles: HasManyGetAssociationsMixin<Role>;
 * }
 *
 * User.hasMany(Role);
 * ```
 *
 * @see Model.hasMany
 */
export type HasManyGetAssociationsMixin<T extends Model> = (options?: HasManyGetAssociationsMixinOptions<T>) => Promise<T[]>;
/**
 * The options for the setAssociations mixin of the hasMany association.
 *
 * @see HasManySetAssociationsMixin
 */
export interface HasManySetAssociationsMixinOptions<T extends Model> extends FindOptions<Attributes<T>>, InstanceUpdateOptions<Attributes<T>> {
}
/**
 * The setAssociations mixin applied to models with hasMany.
 * An example of usage is as follows:
 *
 * ```typescript
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   declare setRoles: HasManySetAssociationsMixin<Role, Role['id']>;
 * }
 *
 * User.hasMany(Role);
 * ```
 *
 * @see Model.hasMany
 */
export type HasManySetAssociationsMixin<T extends Model, TModelPrimaryKey> = (newAssociations?: Array<T | TModelPrimaryKey>, options?: HasManySetAssociationsMixinOptions<T>) => Promise<void>;
/**
 * The options for the addAssociations mixin of the hasMany association.
 *
 * @see HasManyAddAssociationsMixin
 */
export interface HasManyAddAssociationsMixinOptions<T extends Model> extends InstanceUpdateOptions<Attributes<T>> {
}
/**
 * The addAssociations mixin applied to models with hasMany.
 * An example of usage is as follows:
 *
 * ```typescript
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   declare addRoles: HasManyAddAssociationsMixin<Role, Role['id']>;
 * }
 *
 * User.hasMany(Role);
 * ```
 *
 * @see Model.hasMany
 */
export type HasManyAddAssociationsMixin<T extends Model, TModelPrimaryKey> = (newAssociations?: Array<T | TModelPrimaryKey>, options?: HasManyAddAssociationsMixinOptions<T>) => Promise<void>;
/**
 * The options for the addAssociation mixin of the hasMany association.
 *
 * @see HasManyAddAssociationMixin
 */
export interface HasManyAddAssociationMixinOptions<T extends Model> extends HasManyAddAssociationsMixinOptions<T> {
}
/**
 * The addAssociation mixin applied to models with hasMany.
 * An example of usage is as follows:
 *
 * ```typescript
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   declare addRole: HasManyAddAssociationMixin<Role, Role['id']>;
 * }
 *
 * User.hasMany(Role);
 * ```
 *
 * @see Model.hasMany
 */
export type HasManyAddAssociationMixin<T extends Model, TModelPrimaryKey> = (newAssociation?: T | TModelPrimaryKey, options?: HasManyAddAssociationMixinOptions<T>) => Promise<void>;
/**
 * The options for the createAssociation mixin of the hasMany association.
 *
 * @see HasManyCreateAssociationMixin
 */
export interface HasManyCreateAssociationMixinOptions<T extends Model> extends CreateOptions<Attributes<T>> {
}
/**
 * The createAssociation mixin applied to models with hasMany.
 * An example of usage is as follows:
 *
 * ```typescript
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   declare createRole: HasManyCreateAssociationMixin<Role>;
 * }
 *
 * User.hasMany(Role);
 * ```
 *
 * @see Model.hasMany
 */
export type HasManyCreateAssociationMixin<TModel extends Model, TForeignKey extends keyof CreationAttributes<TModel> = never, TScope extends keyof CreationAttributes<TModel> = never> = (values?: Omit<CreationAttributes<TModel>, TForeignKey | TScope>, options?: HasManyCreateAssociationMixinOptions<TModel>) => Promise<TModel>;
/**
 * The options for the removeAssociation mixin of the hasMany association.
 *
 * @see HasManyRemoveAssociationMixin
 */
export interface HasManyRemoveAssociationMixinOptions<T extends Model> extends HasManyRemoveAssociationsMixinOptions<T> {
}
/**
 * The removeAssociation mixin applied to models with hasMany.
 * An example of usage is as follows:
 *
 * ```typescript
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   declare removeRole: HasManyRemoveAssociationMixin<Role, Role['id']>;
 * }
 *
 * User.hasMany(Role);
 * ```
 *
 * @see Model.hasMany
 */
export type HasManyRemoveAssociationMixin<T extends Model, TModelPrimaryKey> = (oldAssociated?: T | TModelPrimaryKey, options?: HasManyRemoveAssociationMixinOptions<T>) => Promise<void>;
/**
 * The options for the removeAssociations mixin of the hasMany association.
 *
 * @see HasManyRemoveAssociationsMixin
 */
export interface HasManyRemoveAssociationsMixinOptions<T extends Model> extends InstanceUpdateOptions<Attributes<T>> {
}
/**
 * The removeAssociations mixin applied to models with hasMany.
 * An example of usage is as follows:
 *
 * ```typescript
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   declare removeRoles: HasManyRemoveAssociationsMixin<Role, Role['id']>;
 * }
 *
 * User.hasMany(Role);
 * ```
 *
 * @see Model.hasMany
 */
export type HasManyRemoveAssociationsMixin<T extends Model, TModelPrimaryKey> = (oldAssociateds?: Array<T | TModelPrimaryKey>, options?: HasManyRemoveAssociationsMixinOptions<T>) => Promise<void>;
/**
 * The options for the hasAssociation mixin of the hasMany association.
 *
 * @see HasManyHasAssociationMixin
 */
export interface HasManyHasAssociationMixinOptions<T extends Model> extends HasManyGetAssociationsMixinOptions<T> {
}
/**
 * The hasAssociation mixin applied to models with hasMany.
 * An example of usage is as follows:
 *
 * ```typescript
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   declare hasRole: HasManyHasAssociationMixin<Role, Role['id']>;
 * }
 *
 * User.hasMany(Role);
 * ```
 *
 * @see Model.hasMany
 */
export type HasManyHasAssociationMixin<TModel extends Model, TModelPrimaryKey> = (target: TModel | TModelPrimaryKey, options?: HasManyHasAssociationMixinOptions<TModel>) => Promise<boolean>;
/**
 * The options for the hasAssociations mixin of the hasMany association.
 *
 * @see HasManyHasAssociationsMixin
 */
export interface HasManyHasAssociationsMixinOptions<T extends Model> extends HasManyGetAssociationsMixinOptions<T> {
}
/**
 * The removeAssociations mixin applied to models with hasMany.
 * An example of usage is as follows:
 *
 * ```typescript
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   declare hasRoles: HasManyHasAssociationsMixin<Role, Role['id']>;
 * }
 *
 * User.hasMany(Role);
 * ```
 *
 * @see Model.hasMany
 */
export type HasManyHasAssociationsMixin<TModel extends Model, TModelPrimaryKey> = (targets: Array<TModel | TModelPrimaryKey>, options?: HasManyHasAssociationsMixinOptions<TModel>) => Promise<boolean>;
/**
 * The options for the countAssociations mixin of the hasMany association.
 *
 * @see HasManyCountAssociationsMixin
 */
export interface HasManyCountAssociationsMixinOptions<T extends Model> extends Transactionable, Filterable<Attributes<T>> {
    /**
     * Apply a scope on the related model, or remove its default scope by passing false.
     */
    scope?: string | boolean;
}
/**
 * The countAssociations mixin applied to models with hasMany.
 * An example of usage is as follows:
 *
 * ```typescript
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   declare countRoles: HasManyCountAssociationsMixin<Role>;
 * }
 *
 * User.hasMany(Role);
 * ```
 *
 * @see Model.hasMany
 */
export type HasManyCountAssociationsMixin<T extends Model> = (options?: HasManyCountAssociationsMixinOptions<T>) => Promise<number>;
