import type { Class } from 'type-fest';
import type { Model, ModelStatic } from '../model';
import type { Sequelize } from '../sequelize';
import type { OmitConstructors } from '../utils/types.js';
import type { Association, AssociationOptions, ForeignKeyOptions, NormalizedAssociationOptions } from './base';
import type { ThroughOptions } from './belongs-to-many.js';
export declare function checkNamingCollision(source: ModelStatic<any>, associationName: string): void;
/**
 * Mixin (inject) association methods to model prototype
 *
 * @private
 *
 * @param association instance
 * @param mixinTargetPrototype Model prototype
 * @param methods Method names to inject
 * @param aliases Mapping between model and association method names
 */
export declare function mixinMethods<A extends Association, Aliases extends Record<string, string>>(association: A, mixinTargetPrototype: Model, methods: Array<keyof A | keyof Aliases>, aliases?: Aliases): void;
/**
 * Used to prevent users from instantiating Associations themselves.
 * Instantiating associations is not safe as it mutates the Model object.
 *
 * @private do not expose outside sequelize
 */
export declare const AssociationSecret: unique symbol;
export declare function getModel<M extends Model>(sequelize: Sequelize, model: string | ModelStatic<M>): ModelStatic<M> | null;
export declare function assertAssociationUnique(type: Class<Association>, source: ModelStatic<any>, target: ModelStatic<any>, options: NormalizedAssociationOptions<any>, parent: Association | undefined): void;
export declare function assertAssociationModelIsDefined(model: ModelStatic<any>): void;
export type AssociationStatic<T extends Association> = Class<T> & OmitConstructors<typeof Association>;
export declare function defineAssociation<T extends Association, RawOptions extends AssociationOptions<any>, CleanOptions extends NormalizedAssociationOptions<any>>(type: AssociationStatic<T>, source: ModelStatic<Model>, target: ModelStatic<Model>, options: RawOptions, parent: Association<any> | undefined, normalizeOptions: (type: AssociationStatic<T>, options: RawOptions, source: ModelStatic<Model>, target: ModelStatic<Model>) => CleanOptions, construct: (opts: CleanOptions) => T): T;
export type NormalizeBaseAssociationOptions<T> = Omit<T, 'as' | 'hooks' | 'foreignKey'> & {
    as: string;
    name: {
        singular: string;
        plural: string;
    };
    hooks: boolean;
    foreignKey: ForeignKeyOptions<any>;
};
export declare function normalizeBaseAssociationOptions<T extends AssociationOptions<any>>(associationType: AssociationStatic<any>, options: T, source: ModelStatic<Model>, target: ModelStatic<Model>): NormalizeBaseAssociationOptions<T>;
export declare function normalizeForeignKeyOptions<T extends string>(foreignKey: AssociationOptions<T>['foreignKey']): ForeignKeyOptions<any>;
export type MaybeForwardedModelStatic<M extends Model = Model> = ModelStatic<M> | ((sequelize: Sequelize) => ModelStatic<M>);
export declare function getForwardedModel(model: MaybeForwardedModelStatic, sequelize: Sequelize): ModelStatic;
export declare function isThroughOptions<M extends Model>(val: any): val is ThroughOptions<M>;
