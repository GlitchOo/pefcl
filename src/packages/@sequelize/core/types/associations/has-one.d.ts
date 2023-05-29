import { Model } from '../model';
import type { CreateOptions, CreationAttributes, FindOptions, SaveOptions, ModelStatic, AttributeNames, Attributes } from '../model';
import type { AssociationOptions, SingleAssociationAccessors } from './base';
import { Association } from './base';
import { BelongsTo } from './belongs-to.js';
import type { NormalizeBaseAssociationOptions } from './helpers';
/**
 * One-to-one association.
 * See {@link Model.hasOne}
 *
 * This is almost the same as {@link BelongsTo}, but the foreign key will be defined on the target model.
 *
 * In the API reference below, add the name of the association to the method, e.g. for `User.hasOne(Project)` the getter will be `user.getProject()`.
 *
 * @typeParam S The model on which {@link Model.hasOne} has been called, on which the association methods will be added.
 * @typeParam T The model passed to {@link Model.hasOne}. This model will receive the Foreign Key attribute.
 * @typeParam SourceKey The name of the attribute that the foreign key in the target model will reference.
 * @typeParam TargetKey The name of the Foreign Key attribute on the Target model.
 * @typeParam TargetPrimaryKey The name of the Primary Key attribute of the Target model. Used by {@link HasOneSetAssociationMixin}.
 */
export declare class HasOne<S extends Model = Model, T extends Model = Model, SourceKey extends AttributeNames<S> = any, TargetKey extends AttributeNames<T> = any, TargetPrimaryKey extends AttributeNames<T> = any> extends Association<S, T, TargetKey, NormalizedHasOneOptions<SourceKey, TargetKey>> {
    #private;
    get foreignKey(): TargetKey;
    /**
     * The column name of the foreign key (on the target model)
     */
    get identifierField(): string;
    /**
     * The name of the attribute the foreign key points to.
     * In HasOne, it is on the Source Model, instead of the Target Model (unlike {@link BelongsTo.targetKey}).
     * The {@link Association.foreignKey} is on the Target Model.
     */
    get sourceKey(): SourceKey;
    /**
     * The Column Name of the source key.
     */
    get sourceKeyField(): string;
    /**
     * @deprecated use {@link sourceKey}
     */
    get sourceKeyAttribute(): SourceKey;
    readonly inverse: BelongsTo<T, S, TargetKey, SourceKey>;
    readonly accessors: SingleAssociationAccessors;
    constructor(secret: symbol, source: ModelStatic<S>, target: ModelStatic<T>, options: NormalizedHasOneOptions<SourceKey, TargetKey>, parent?: Association);
    static associate<S extends Model, T extends Model, SourceKey extends AttributeNames<S>, TargetKey extends AttributeNames<T>>(secret: symbol, source: ModelStatic<S>, target: ModelStatic<T>, options?: HasOneOptions<SourceKey, TargetKey>, parent?: Association<any>): HasOne<S, T, SourceKey, TargetKey>;
    /**
     * Get the associated instance.
     *
     * See {@link HasOneGetAssociationMixinOptions} for a full explanation of options.
     * This method is mixed-in the source model prototype. See {@link HasOneGetAssociationMixin}.
     *
     * @param instances source instances
     * @param options find options
     */
    get(instances: S, options?: HasOneGetAssociationMixinOptions<T>): Promise<T | null>;
    get(instances: S[], options?: HasOneGetAssociationMixinOptions<T>): Promise<Map<any, T | null>>;
    /**
     * Set the associated model.
     *
     * @param sourceInstance the source instance
     * @param associatedInstanceOrPk An persisted instance or the primary key of an instance to associate with this. Pass `null` to remove the association.
     * @param options Options passed to getAssociation and `target.save`
     *
     * @returns The associated instance, or null if disassociated.
     */
    set(sourceInstance: S, associatedInstanceOrPk: T | T[TargetPrimaryKey], options?: HasOneSetAssociationMixinOptions<T>): Promise<T>;
    set(sourceInstance: S, associatedInstanceOrPk: null, options?: HasOneSetAssociationMixinOptions<T>): Promise<null>;
    /**
     * Create a new instance of the associated model and associate it with this.
     *
     * See {@link Model.create} for a full explanation of options.
     *
     * @param sourceInstance - the source instance
     * @param values - values to create associated model instance with
     * @param options - Options passed to `target.create` and setAssociation.
     *
     * @returns The created target model
     */
    create(sourceInstance: S, values?: CreationAttributes<T>, options?: HasOneCreateAssociationMixinOptions<T>): Promise<T>;
}
export type NormalizedHasOneOptions<SourceKey extends string, TargetKey extends string> = NormalizeBaseAssociationOptions<HasOneOptions<SourceKey, TargetKey>>;
/**
 * Options provided when associating models with hasOne relationship
 */
export interface HasOneOptions<SourceKey extends string, TargetKey extends string> extends AssociationOptions<TargetKey> {
    /**
     * The name of the field to use as the key for the association in the source table.
     * Defaults to the primary key of the source table.
     *
     * This is the attribute the foreign key will target. Not to be confused with {@link AssociationOptions.foreignKey}.
     */
    sourceKey?: SourceKey;
    inverse?: {
        as?: AssociationOptions<any>['as'];
        scope?: AssociationOptions<any>['scope'];
    };
}
/**
 * The options for the getAssociation mixin of the hasOne association.
 *
 * @see HasOneGetAssociationMixin
 */
export interface HasOneGetAssociationMixinOptions<T extends Model> extends FindOptions<Attributes<T>> {
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
 * The getAssociation mixin applied to models with hasOne.
 * An example of usage is as follows:
 *
 * ```typescript
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   declare getRole: HasOneGetAssociationMixin<Role>;
 * }
 *
 * User.hasOne(Role);
 * ```
 *
 * @returns The associated model, or null if no model is associated. HasOne associations are always nullable because the foreign key is on the target model.
 *
 * @see Model.hasOne
 */
export type HasOneGetAssociationMixin<T extends Model> = (options?: HasOneGetAssociationMixinOptions<T>) => Promise<T | null>;
/**
 * The options for the setAssociation mixin of the hasOne association.
 *
 * @see HasOneSetAssociationMixin
 */
export interface HasOneSetAssociationMixinOptions<T extends Model> extends HasOneGetAssociationMixinOptions<T>, SaveOptions<Attributes<T>> {
}
/**
 * The setAssociation mixin applied to models with hasOne.
 * An example of usage is as follows:
 *
 * ```typescript
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   declare setRole: HasOneSetAssociationMixin<Role, Role['id']>;
 * }
 *
 * User.hasOne(Role);
 * ```
 *
 * @see Model.hasOne
 */
export type HasOneSetAssociationMixin<T extends Model, TModelPrimaryKey> = {
    (newAssociation: null, options?: HasOneSetAssociationMixinOptions<T>): Promise<null>;
    (newAssociation: T | TModelPrimaryKey, options?: HasOneSetAssociationMixinOptions<T>): Promise<T>;
};
/**
 * The options for the createAssociation mixin of the hasOne association.
 *
 * @see HasOneCreateAssociationMixin
 */
export interface HasOneCreateAssociationMixinOptions<T extends Model> extends Omit<HasOneSetAssociationMixinOptions<T>, 'fields'>, CreateOptions<Attributes<T>> {
}
/**
 * The createAssociation mixin applied to models with hasOne.
 * An example of usage is as follows:
 *
 * ```typescript
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *  declare createRole: HasOneCreateAssociationMixin<Role>;
 * }
 *
 * User.hasOne(Role);
 * ```
 *
 * @see Model.hasOne
 */
export type HasOneCreateAssociationMixin<T extends Model> = (values?: CreationAttributes<T>, options?: HasOneCreateAssociationMixinOptions<T>) => Promise<T>;
