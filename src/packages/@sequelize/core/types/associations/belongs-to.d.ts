import type { ModelStatic, Model, CreateOptions, CreationAttributes, FindOptions, SaveOptions, AttributeNames, Attributes } from '../model';
import type { AssociationOptions, SingleAssociationAccessors } from './base';
import { Association } from './base';
import type { NormalizeBaseAssociationOptions } from './helpers';
/**
 * One-to-one association
 * See {@link Model.belongsTo}
 *
 * This is almost the same as {@link HasOne}, but the foreign key will be defined on the source model.
 *
 * In the API reference below, add the name of the association to the method, e.g. for `User.belongsTo(Project)` the getter will be `user.getProject()`.
 *
 * @typeParam S The model on which {@link Model.belongsTo} has been called, on which the association methods, as well as the foreign key attribute, will be added.
 * @typeParam T The model passed to {@link Model.belongsTo}.
 * @typeParam SourceKey The name of the Foreign Key attribute on the Source model.
 * @typeParam TargetKey The name of the attribute that the foreign key in the source model will reference, typically the Primary Key.
 */
export declare class BelongsTo<S extends Model = Model, T extends Model = Model, SourceKey extends AttributeNames<S> = any, TargetKey extends AttributeNames<T> = any> extends Association<S, T, SourceKey, NormalizedBelongsToOptions<SourceKey, TargetKey>> {
    #private;
    readonly accessors: SingleAssociationAccessors;
    /**
     * The attribute name of the identifier
     *
     * @deprecated use {@link foreignKey} instead
     */
    get identifier(): string;
    foreignKey: SourceKey;
    /**
     * The column name of the foreign key
     */
    identifierField: string;
    /**
     * The name of the attribute the foreign key points to.
     * In belongsTo, this key is on the Target Model, instead of the Source Model  (unlike {@link HasOne.sourceKey}).
     * The {@link Association.foreignKey} is on the Source Model.
     */
    targetKey: TargetKey;
    /**
     * The column name of the target key
     */
    readonly targetKeyField: string;
    readonly targetKeyIsPrimary: boolean;
    /**
     * @deprecated use {@link BelongsTo.targetKey}
     */
    get targetIdentifier(): string;
    inverse: Association | undefined;
    constructor(secret: symbol, source: ModelStatic<S>, target: ModelStatic<T>, options: NormalizedBelongsToOptions<SourceKey, TargetKey>, parent?: Association);
    static associate<S extends Model, T extends Model, SourceKey extends AttributeNames<S>, TargetKey extends AttributeNames<T>>(secret: symbol, source: ModelStatic<S>, target: ModelStatic<T>, options?: BelongsToOptions<SourceKey, TargetKey>, parent?: Association<any>): BelongsTo<S, T, SourceKey, TargetKey>;
    protected inferForeignKey(): string;
    /**
     * Get the associated instance.
     *
     * See {@link BelongsToGetAssociationMixinOptions} for a full explanation of options.
     * This method is mixed-in the source model prototype. See {@link BelongsToGetAssociationMixin}.
     *
     * @param instances source instances
     * @param options find options
     */
    get(instances: S, options: BelongsToGetAssociationMixinOptions<T>): Promise<T | null>;
    get(instances: S[], options: BelongsToGetAssociationMixinOptions<T>): Promise<Map<any, T | null>>;
    /**
     * Set the associated model.
     *
     * @param sourceInstance the source instance
     * @param associatedInstance An persisted instance or the primary key of an instance to associate with this. Pass `null` to remove the association.
     * @param options options passed to `this.save`
     */
    set(sourceInstance: S, associatedInstance: T | T[TargetKey] | null, options?: BelongsToSetAssociationMixinOptions<T>): Promise<void>;
    /**
     * Create a new instance of the associated model and associate it with this.
     *
     * @param sourceInstance the source instance
     * @param values values to create associated model instance with
     * @param options Options passed to `target.create` and setAssociation.
     *
     * @returns The created target model
     */
    create(sourceInstance: S, values?: CreationAttributes<T>, options?: BelongsToCreateAssociationMixinOptions<T>): Promise<T>;
}
export type NormalizedBelongsToOptions<SourceKey extends string, TargetKey extends string> = NormalizeBaseAssociationOptions<BelongsToOptions<SourceKey, TargetKey>>;
/**
 * Options provided when associating models with belongsTo relationship
 *
 * @see Association class belongsTo method
 */
export interface BelongsToOptions<SourceKey extends string, TargetKey extends string> extends AssociationOptions<SourceKey> {
    /**
     * The name of the field to use as the key for the association in the target table. Defaults to the primary
     * key of the target table
     */
    targetKey?: TargetKey;
    inverse?: {
        type: 'hasMany' | 'hasOne';
        as?: string;
        scope?: AssociationOptions<any>['scope'];
    };
}
/**
 * The options for the getAssociation mixin of the belongsTo association.
 *
 * @see BelongsToGetAssociationMixin
 */
export interface BelongsToGetAssociationMixinOptions<T extends Model> extends FindOptions<Attributes<T>> {
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
 * The getAssociation mixin applied to models with belongsTo.
 * An example of usage is as follows:
 *
 * ```typescript
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *  declare getRole: BelongsToGetAssociationMixin<Role>;
 * }
 *
 * User.belongsTo(Role);
 * ```
 *
 * @see Model.belongsTo
 */
export type BelongsToGetAssociationMixin<T extends Model> = (options?: BelongsToGetAssociationMixinOptions<T>) => Promise<T | null>;
/**
 * The options for the setAssociation mixin of the belongsTo association.
 *
 * @see BelongsToSetAssociationMixin
 */
export interface BelongsToSetAssociationMixinOptions<T extends Model> extends SaveOptions<Attributes<T>> {
    /**
     * Skip saving this after setting the foreign key if false.
     */
    save?: boolean;
}
/**
 * The setAssociation mixin applied to models with belongsTo.
 * An example of usage is as follows:
 *
 * ```typescript
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *  declare setRole: BelongsToSetAssociationMixin<Role, Role['id']>;
 * }
 *
 * User.belongsTo(Role);
 * ```
 *
 * @see Model.belongsTo
 *
 * @typeParam TargetKeyType The type of the attribute that the foreign key references.
 */
export type BelongsToSetAssociationMixin<T extends Model, TargetKeyType> = (newAssociation?: T | TargetKeyType, options?: BelongsToSetAssociationMixinOptions<T>) => Promise<void>;
/**
 * The options for the createAssociation mixin of the belongsTo association.
 *
 * @see BelongsToCreateAssociationMixin
 */
export interface BelongsToCreateAssociationMixinOptions<T extends Model> extends CreateOptions<Attributes<T>>, BelongsToSetAssociationMixinOptions<T> {
}
/**
 * The createAssociation mixin applied to models with belongsTo.
 * An example of usage is as follows:
 *
 * ```typescript
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   declare createRole: BelongsToCreateAssociationMixin<Role>;
 * }
 *
 * User.belongsTo(Role);
 * ```
 *
 * @see Model.belongsTo
 */
export type BelongsToCreateAssociationMixin<T extends Model> = (values?: CreationAttributes<T>, options?: BelongsToCreateAssociationMixinOptions<T>) => Promise<T>;
