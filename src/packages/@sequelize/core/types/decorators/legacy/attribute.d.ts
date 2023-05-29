import type { DataType } from '../../dialects/abstract/data-types.js';
import type { AttributeIndexOptions, AttributeOptions } from '../../model.js';
import type { NonUndefined } from '../../utils/types.js';
import type { PropertyOrGetterDescriptor } from './decorator-utils.js';
type AttributeDecoratorOption = DataType | Partial<AttributeOptions>;
/**
 * The `@Attribute` decorator is used to add an attribute to a model. It is used on an instance property.
 *
 * @example
 * The simplest way to use it is to pass a data type as the parameter:
 * ```ts
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   @Attribute(DataTypes.STRING)
 *   declare firstName: string | null;
 * }
 * ```
 *
 * @example
 * `@Attribute` also accepts an option bag, {@link index~AttributeOptions}, which allows you to configure all available attribute definition options.
 * ```ts
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   @Attribute({
 *     type: DataTypes.STRING,
 *     allowNull: false,
 *   })
 *   declare firstName: string;
 * }
 * ```
 */
export declare const Attribute: import("./decorator-utils.js").RequiredParameterizedPropertyDecorator<AttributeDecoratorOption>;
/**
 * @param optionsOrDataType
 * @deprecated use {@link Attribute} instead.
 */
export declare function Column(optionsOrDataType: DataType | AttributeOptions): PropertyOrGetterDescriptor;
type UniqueOptions = NonNullable<AttributeOptions['unique']>;
/**
 * The `@Unique` decorator is used to make an attribute unique, it is a shortcut for setting the `unique` option of the {@link Attribute} decorator.
 * Learn more about unique constraints in our documentation.
 *
 * @example
 * This makes "firstName" unique
 * ```ts
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   @Attribute(DataTypes.STRING)
 *   @Unique
 *   declare firstName: string;
 * }
 * ```
 *
 * @example
 * This creates a composite unique on columns "firstName" and "lastName"
 * ```ts
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   @Attribute(DataTypes.STRING)
 *   @Unique('firstName-lastName')
 *   declare firstName: string;
 *
 *   @Attribute(DataTypes.STRING)
 *   @Unique('firstName-lastName')
 *   declare lastName: string;
 * }
 * ```
 */
export declare const Unique: import("./decorator-utils.js").OptionalParameterizedPropertyDecorator<UniqueOptions>;
/**
 * Makes the attribute accept null values. Opposite of {@link NotNull}.
 * It is a shortcut for setting the `allowNull` option of the {@link Attribute} decorator to true.
 *
 * @example
 * ```ts
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   @Attribute(DataTypes.STRING)
 *   @AllowNull
 *   declare firstName: string | null;
 * }
 * ```
 */
export declare const AllowNull: import("./decorator-utils.js").OptionalParameterizedPropertyDecorator<boolean>;
/**
 * Makes the attribute reject null values. Opposite of {@link AllowNull}.
 * It is a shortcut for setting the `allowNull` option of the {@link Attribute} decorator to false.
 *
 * @example
 * ```ts
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   @Attribute(DataTypes.STRING)
 *   @NotNull
 *   declare firstName: string;
 * }
 * ```
 */
export declare const NotNull: import("./decorator-utils.js").OptionalParameterizedPropertyDecorator<boolean>;
/**
 * The `@PrimaryKey` decorator is used to make an attribute a primary key,
 * it is a shortcut for setting the `primaryKey` option of the {@link Attribute} decorator to true.
 *
 * @example
 * ```ts
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   @Attribute(DataTypes.INTEGER)
 *   @PrimaryKey
 *   declare id: number;
 * }
 * ```
 */
export declare const PrimaryKey: import("./decorator-utils.js").OptionalParameterizedPropertyDecorator<boolean>;
/**
 * The `@AutoIncrement` decorator is used to make an attribute auto-increment,
 * it is a shortcut for setting the `autoIncrement` option of the {@link Attribute} decorator to true.
 *
 * Some dialects require the field to be a primary key.
 *
 * @example
 * ```ts
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   @Attribute(DataTypes.INTEGER)
 *   @PrimaryKey
 *   @AutoIncrement
 *   declare id: number;
 * }
 * ```
 */
export declare const AutoIncrement: import("./decorator-utils.js").OptionalParameterizedPropertyDecorator<boolean>;
/**
 * The `@Comment` decorator is used to set the comment on a column, it is a shortcut for setting the `comment` option of the {@link Attribute} decorator.
 *
 * This is only useful if you use {@link index~Sequelize#sync} to create your tables.
 */
export declare const Comment: import("./decorator-utils.js").RequiredParameterizedPropertyDecorator<string>;
/**
 * The `@Default` decorator is used to set a default value for an attribute, it is a shortcut for setting the `defaultValue` option of the {@link Attribute} decorator.
 *
 * @example
 * ```ts
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   @Attribute(DataTypes.STRING)
 *   @Default('John Doe')
 *   declare firstName: string;
 * }
 * ```
 */
export declare const Default: import("./decorator-utils.js").RequiredParameterizedPropertyDecorator<unknown>;
/**
 * Sets the name of the column (in the database) this attribute maps to.
 * It is a shortcut for setting the `columnName` option of the {@link Attribute} decorator.
 *
 * With a good naming strategy configured, you rarely need to use this decorator.
 * Learn about naming strategies in our documentation.
 *
 * @example
 * ```ts
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   @Attribute(DataTypes.STRING)
 *   @ColumnName('first_name')
 *   declare firstName: string;
 * }
 * ```
 */
export declare const ColumnName: import("./decorator-utils.js").RequiredParameterizedPropertyDecorator<string>;
export declare function createIndexDecorator(decoratorName: string, options?: Omit<AttributeIndexOptions, 'attribute'>): import("./decorator-utils.js").OptionalParameterizedPropertyDecorator<Omit<import("../../index.js").IndexField, "name">>;
type IndexDecoratorOptions = NonUndefined<AttributeOptions['index']>;
export declare const Index: import("./decorator-utils.js").OptionalParameterizedPropertyDecorator<IndexDecoratorOptions>;
export {};
