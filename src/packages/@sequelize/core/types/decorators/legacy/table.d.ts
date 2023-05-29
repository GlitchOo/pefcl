import type { ModelOptions, Model, ModelStatic } from '../../model.js';
/**
 * The `@Table` decorator is used to configure a model. It is used on a model class, and takes an object as parameter.<br />
 * Using this decorator is completely optional, you only need to use it if you want to configure one of the options of your model.
 *
 * @example
 * ```ts
 * @Table({
 *   tableName: 'users',
 *   timestamps: false,
 * })
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {}
 * ```
 *
 * @param options
 */
export declare function Table<M extends Model = Model>(options: ModelOptions<M>): ClassDecorator;
export declare function Table(target: ModelStatic): void;
