/// <reference types="node" />
import dayjs from 'dayjs';
import type { Class } from 'type-fest';
import type { Falsy } from '../../generic/falsy';
import type { GeoJson, GeoJsonType } from '../../geo-json.js';
import type { NormalizedAttributeOptions, ModelStatic, Rangable } from '../../model.js';
import type { Sequelize } from '../../sequelize.js';
import type { HstoreRecord } from '../postgres/hstore.js';
import type { TableNameWithSchema } from './query-interface.js';
import type { AbstractDialect } from './index.js';
export type Constructed<T> = T extends abstract new () => infer Instance ? Instance : T;
export type AcceptableTypeOf<T extends DataType> = Constructed<T> extends AbstractDataType<infer Acceptable> ? Acceptable : never;
export type DataTypeInstance = AbstractDataType<any>;
export type DataTypeClass = Class<AbstractDataType<any>>;
export type DataTypeClassOrInstance = DataTypeInstance | DataTypeClass;
export type DataType = string | DataTypeClassOrInstance;
export interface ToSqlOptions {
    dialect: AbstractDialect;
}
export interface StringifyOptions {
    dialect: AbstractDialect;
    operation?: string;
    timezone?: string | undefined;
    field?: NormalizedAttributeOptions;
}
export interface BindParamOptions extends StringifyOptions {
    bindParam(value: unknown): string;
}
export type DataTypeUseContext = {
    model: ModelStatic;
    attributeName: string;
    sequelize: Sequelize;
} | {
    tableName: TableNameWithSchema;
    columnName: string;
    sequelize: Sequelize;
};
/**
 * A symbol that can be used as the key for a static property on a DataType class to uniquely identify it.
 */
declare const kDataTypeIdentifier: unique symbol;
/**
 * @category DataTypes
 */
export declare abstract class AbstractDataType<
/** The type of value we'll accept - ie for a column of this type, we'll accept this value as user input. */
AcceptedType> {
    #private;
    /**
     * This property is designed to uniquely identify the DataType.
     * Do not change this value in implementation-specific dialects, or they will not be mapped to their parent DataType properly!
     *
     * @hidden
     */
    static readonly [kDataTypeIdentifier]: string;
    static getDataTypeId(): string;
    getDataTypeId(): string;
    /**
     * Where this DataType is being used.
     */
    usageContext: DataTypeUseContext | undefined;
    protected _getDialect(): AbstractDialect;
    /**
     * @hidden
     */
    static get escape(): void;
    /**
     * @hidden
     */
    static get types(): void;
    /**
     * @hidden
     */
    static get key(): void;
    /**
     * @hidden
     */
    get types(): void;
    /**
     * @hidden
     */
    get key(): void;
    protected _construct<Constructor extends abstract new () => AbstractDataType<any>>(...args: ConstructorParameters<Constructor>): this;
    areValuesEqual(value: AcceptedType, originalValue: AcceptedType): boolean;
    /**
     * Called when a value is retrieved from the Database, and its DataType is specified.
     * Used to normalize values from the database.
     *
     * Note: It is also possible to do an initial parsing of a Database value using {@link AbstractDialect#registerDataTypeParser}.
     * That normalization uses the type ID from the database instead of a Sequelize Data Type to determine which parser to use,
     * and is called before this method.
     *
     * @param value The value to parse.
     */
    parseDatabaseValue(value: unknown): unknown;
    /**
     * Used to normalize a value when {@link Model#set} is called.
     * That is, when a user sets a value on a Model instance.
     *
     * @param value
     */
    sanitize(value: unknown): unknown;
    /**
     * Checks whether the JS value is compatible with (or can be converted to) the SQL data type.
     * Throws if that is not the case.
     *
     * @param value
     */
    validate(value: any): asserts value is AcceptedType;
    /**
     * Escapes a value for the purposes of inlining it in a SQL query.
     * The resulting value will be inlined as-is with no further escaping.
     *
     * @param value The value to escape.
     * @param options Options.
     */
    escape(value: AcceptedType, options: StringifyOptions): string;
    /**
     * This method is called when {@link AbstractQueryGenerator} needs to add a bind parameter to a query it is building.
     * This method allows for customizing both the SQL to add to the query, and convert the bind parameter value to a DB-compatible value.
     *
     * If you only need to prepare the bind param value, implement {@link toBindableValue} instead.
     *
     * This method must return the SQL to add to the query. You can obtain a bind parameter ID by calling {@link BindParamOptions#bindParam}
     * with the value associated to that bind parameter.
     *
     * An example of a data type that requires customizing the SQL is the {@link GEOMETRY} data type.
     *
     * @param value The value to bind.
     * @param options Options.
     */
    getBindParamSql(value: AcceptedType, options: BindParamOptions): string;
    /**
     * Converts a JS value to a value compatible with the connector library for this Data Type.
     * Unlike {@link escape}, this value does not need to be escaped. It is passed separately to the database, which
     * will handle escaping.
     *
     * @param value The value to convert.
     * @param _options Options.
     */
    toBindableValue(value: AcceptedType, _options: StringifyOptions): unknown;
    toString(): string;
    static toString(): string;
    /**
     * Returns a SQL declaration of this data type.
     * e.g. 'VARCHAR(255)', 'TEXT', etc…
     */
    abstract toSql(options: ToSqlOptions): string;
    /**
     * Override this method to emit an error or a warning if the Data Type, as it is configured, is not compatible
     * with the current dialect.
     *
     * @param dialect The dialect using this data type.
     */
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    belongsToDialect(dialect: AbstractDialect): boolean;
    /**
     * Returns this DataType, using its dialect-specific subclass.
     *
     * @param dialect
     */
    toDialectDataType(dialect: AbstractDialect): this;
    /**
     * Returns a copy of this DataType, without usage context.
     * Designed to re-use a DataType on another Model.
     */
    clone(): this;
    /**
     * @param usageContext
     * @private
     */
    attachUsageContext(usageContext: DataTypeUseContext): this;
}
export interface StringTypeOptions {
    /**
     * @default 255
     */
    length?: number | undefined;
    /**
     * @default false
     */
    binary?: boolean;
}
/**
 * Represents a variable length string type.
 *
 * __Fallback policy:__
 * - If the 'length' option is not supported by the dialect, a CHECK constraint will be added to ensure
 * the value remains within the specified length.
 * - If the 'binary' option is not supported by the dialect, a suitable binary type will be used instead.
 *   If none is available, an error will be raised instead.
 *
 * @example
 * ```ts
 * DataTypes.STRING(255)
 * ```
 *
 * @category DataTypes
 */
export declare class STRING extends AbstractDataType<string | Buffer> {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    readonly options: StringTypeOptions;
    constructor(length: number, binary?: boolean);
    constructor(options?: StringTypeOptions);
    /** @hidden */
    constructor(...args: [] | [length: number] | [length: number, binary: boolean] | [options: StringTypeOptions]);
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    toSql(_options: ToSqlOptions): string;
    validate(value: any): asserts value is string | Buffer;
    get BINARY(): this;
    static get BINARY(): STRING;
    escape(value: string | Buffer, options: StringifyOptions): string;
    toBindableValue(value: string | Buffer): unknown;
}
/**
 * Represents a fixed length string type.
 *
 * __Fallback policy:__
 * - If this DataType is not supported, an error will be raised.
 *
 * @example
 * ```ts
 * DataTypes.CHAR(1000)
 * ```
 *
 * @category DataTypes
 */
export declare class CHAR extends STRING {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    toSql(): string;
}
export type TextLength = 'tiny' | 'medium' | 'long';
export interface TextOptions {
    length?: TextLength | undefined;
}
/**
 * Represents an unlimited length string type.
 *
 * @example
 * ```ts
 * DataTypes.TEXT('tiny') // TINYTEXT
 * ```
 *
 * @category DataTypes
 */
export declare class TEXT extends AbstractDataType<string> {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    readonly options: TextOptions;
    /**
     * @param lengthOrOptions could be tiny, medium, long.
     */
    constructor(lengthOrOptions?: TextLength | TextOptions);
    toSql(): string;
    validate(value: any): asserts value is string;
}
/**
 * An unlimited length case-insensitive text column.
 * Original case is preserved but acts case-insensitive when comparing values (such as when finding or unique constraints).
 * Only available in Postgres and SQLite.
 *
 * __Fallback policy:__
 * - If this DataType is not supported, and no case-insensitive text alternative exists, an error will be raised.
 *
 * @example
 * ```ts
 * DataTypes.CITEXT
 * ```
 *
 * @category DataTypes
 */
export declare class CITEXT extends AbstractDataType<string> {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    toSql(): string;
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    validate(value: any): asserts value is string;
}
export interface NumberOptions {
    /**
     * Pad the value with zeros to the specified length.
     *
     * Currently useless for types that are returned as JS BigInts or JS Numbers.
     */
    zerofill?: boolean | undefined;
    /**
     * Is unsigned?
     */
    unsigned?: boolean | undefined;
}
export interface IntegerOptions extends NumberOptions {
    /**
     * In MariaDB: When specified, and {@link zerofill} is set, the returned value will be padded with zeros to the specified length.
     * In MySQL: This option is ignored.
     * This option is supported in no other dialect.
     * Currently useless for types that are returned as JS BigInts or JS Numbers.
     */
    length?: number;
}
export interface DecimalNumberOptions extends NumberOptions {
    /**
     * Total number of digits.
     *
     * {@link DecimalNumberOptions#scale} must be specified if precision is specified.
     */
    precision?: number | undefined;
    /**
     * Count of decimal digits in the fractional part.
     *
     * {@link DecimalNumberOptions#precision} must be specified if scale is specified.
     */
    scale?: number | undefined;
}
type AcceptedNumber = number | bigint | boolean | string | null;
/**
 * Base number type which is used to build other types
 */
export declare class BaseNumberDataType<Options extends NumberOptions = NumberOptions> extends AbstractDataType<AcceptedNumber> {
    readonly options: Options;
    constructor(options?: Options);
    protected getNumberSqlTypeName(): string;
    toSql(_options: ToSqlOptions): string;
    protected _supportsNativeUnsigned(_dialect: AbstractDialect): boolean;
    validate(value: any): asserts value is number;
    escape(value: AcceptedNumber, options: StringifyOptions): string;
    toBindableValue(num: AcceptedNumber, _options: StringifyOptions): string;
    getBindParamSql(value: AcceptedNumber, options: BindParamOptions): string;
    get UNSIGNED(): this;
    get ZEROFILL(): this;
    static get UNSIGNED(): BaseNumberDataType<{
        unsigned: true;
    }>;
    static get ZEROFILL(): BaseNumberDataType<{
        zerofill: true;
    }>;
}
export declare class BaseIntegerDataType extends BaseNumberDataType<IntegerOptions> {
    constructor(optionsOrLength?: number | Readonly<IntegerOptions>);
    validate(value: unknown): void;
    sanitize(value: unknown): unknown;
    parseDatabaseValue(value: unknown): unknown;
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    protected _supportsNativeUnsigned(_dialect: AbstractDialect): boolean;
    toSql(options: ToSqlOptions): string;
}
/**
 * An 8-bit integer.
 *
 * __Fallback policy:__
 * - If this type or its unsigned option is unsupported by the dialect, it will be replaced by a SMALLINT or greater,
 *   with a CHECK constraint to ensure the value is withing the bounds of an 8-bit integer.
 * - If the zerofill option is unsupported by the dialect, an error will be raised.
 * - If the length option is unsupported by the dialect, it will be discarded.
 *
 * @example
 * ```ts
 * DataTypes.TINYINT
 * ```
 *
 * @category DataTypes
 */
export declare class TINYINT extends BaseIntegerDataType {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    protected getNumberSqlTypeName(): string;
}
/**
 * A 16-bit integer.
 *
 * __Fallback policy:__
 * - If this type or its unsigned option is unsupported by the dialect, it will be replaced by a MEDIUMINT or greater,
 *   with a CHECK constraint to ensure the value is withing the bounds of an 16-bit integer.
 * - If the zerofill option is unsupported by the dialect, an error will be raised.
 * - If the length option is unsupported by the dialect, it will be discarded.
 *
 * @example
 * ```ts
 * DataTypes.SMALLINT
 * ```
 *
 * @category DataTypes
 */
export declare class SMALLINT extends BaseIntegerDataType {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    protected getNumberSqlTypeName(): string;
}
/**
 * A 24-bit integer.
 *
 * __Fallback policy:__
 * - If this type or its unsigned option is unsupported by the dialect, it will be replaced by a INTEGER (32 bits) or greater,
 *   with a CHECK constraint to ensure the value is withing the bounds of an 32-bit integer.
 * - If the zerofill option is unsupported by the dialect, an error will be raised.
 * - If the length option is unsupported by the dialect, it will be discarded.
 *
 * @example
 * ```ts
 * DataTypes.MEDIUMINT
 * ```
 *
 * @category DataTypes
 */
export declare class MEDIUMINT extends BaseIntegerDataType {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    protected getNumberSqlTypeName(): string;
}
/**
 * A 32-bit integer.
 *
 * __Fallback policy:__
 * - When this type or its unsigned option is unsupported by the dialect, it will be replaced by a BIGINT,
 *   with a CHECK constraint to ensure the value is withing the bounds of an 32-bit integer.
 * - If the zerofill option is unsupported by the dialect, an error will be raised.
 * - If the length option is unsupported by the dialect, it will be discarded.
 *
 * @example
 * ```ts
 * DataTypes.INTEGER
 * ```
 *
 * @category DataTypes
 */
export declare class INTEGER extends BaseIntegerDataType {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    protected getNumberSqlTypeName(): string;
}
/**
 * A 64-bit integer.
 *
 * __Fallback policy:__
 * - If this type or its unsigned option is unsupported by the dialect, an error will be raised.
 * - If the zerofill option is unsupported by the dialect, an error will be raised.
 * - If the length option is unsupported by the dialect, it will be discarded.
 *
 * @example
 * ```ts
 * DataTypes.BIGINT
 * ```
 *
 * @category DataTypes
 */
export declare class BIGINT extends BaseIntegerDataType {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    protected getNumberSqlTypeName(): string;
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    sanitize(value: AcceptedNumber): AcceptedNumber;
}
export declare class BaseDecimalNumberDataType extends BaseNumberDataType<DecimalNumberOptions> {
    constructor(options?: DecimalNumberOptions);
    /**
     * @param precision defines precision
     * @param scale defines scale
     */
    constructor(precision: number, scale: number);
    /** @hidden */
    constructor(...args: [] | [precision: number] | [precision: number, scale: number] | [options: DecimalNumberOptions]);
    validate(value: any): asserts value is AcceptedNumber;
    isUnconstrained(): boolean;
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    toSql(options: ToSqlOptions): string;
}
/**
 * A single-floating point number with a 4-byte precision.
 * If single-precision floating-point format is not supported, a double-precision floating-point number may be used instead.
 *
 * __Fallback policy:__
 * - If the precision or scale options are unsupported by the dialect, they will be discarded.
 * - If the zerofill option is unsupported by the dialect, an error will be raised.
 * - If the unsigned option is unsupported, it will be replaced by a CHECK > 0 constraint.
 *
 * @example
 * ```ts
 * DataTypes.FLOAT
 * ```
 *
 * @category DataTypes
 */
export declare class FLOAT extends BaseDecimalNumberDataType {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    protected getNumberSqlTypeName(): string;
    protected _supportsNativeUnsigned(_dialect: AbstractDialect): boolean;
}
/**
 * @deprecated Use {@link FLOAT} instead.
 */
export declare class REAL extends BaseDecimalNumberDataType {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    protected _supportsNativeUnsigned(_dialect: AbstractDialect): boolean;
    protected getNumberSqlTypeName(): string;
}
/**
 * Floating point number (8-byte precision).
 * Throws an error when unsupported, instead of silently falling back to a lower precision.
 *
 * __Fallback policy:__
 * - If the precision or scale options are unsupported by the dialect, they will be discarded.
 * - If the zerofill option is unsupported by the dialect, an error will be raised.
 * - If the unsigned option is unsupported, it will be replaced by a CHECK > 0 constraint.
 *
 * @example
 * ```ts
 * DataTypes.DOUBLE
 * ```
 *
 * @category DataTypes
 */
export declare class DOUBLE extends BaseDecimalNumberDataType {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    protected _supportsNativeUnsigned(_dialect: AbstractDialect): boolean;
    protected getNumberSqlTypeName(): string;
}
/**
 * Arbitrary/exact precision decimal number.
 *
 * __Fallback policy:__
 * - If the precision or scale options are unsupported by the dialect, they will be ignored.
 * - If the precision or scale options are not specified, and the dialect does not support unconstrained decimals, an error will be raised.
 * - If the zerofill option is unsupported by the dialect, an error will be raised.
 * - If the unsigned option is unsupported, it will be replaced by a CHECK > 0 constraint.
 *
 * @example
 * ```ts
 * DataTypes.DECIMAL
 * ```
 *
 * @category DataTypes
 */
export declare class DECIMAL extends BaseDecimalNumberDataType {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    sanitize(value: AcceptedNumber): AcceptedNumber;
    protected _supportsNativeUnsigned(_dialect: AbstractDialect): boolean;
    protected getNumberSqlTypeName(): string;
}
/**
 * A boolean / tinyint column, depending on dialect
 *
 * __Fallback policy:__
 * - If a native boolean type is not available, a dialect-specific numeric replacement (bit, tinyint) will be used instead.
 *
 * @example
 * ```ts
 * DataTypes.BOOLEAN
 * ```
 *
 * @category DataTypes
 */
export declare class BOOLEAN extends AbstractDataType<boolean> {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    toSql(): string;
    validate(value: any): asserts value is boolean;
    parseDatabaseValue(value: unknown): boolean;
    escape(value: boolean | Falsy): string;
    toBindableValue(value: boolean | Falsy): unknown;
}
export interface TimeOptions {
    /**
     * The precision of the date.
     */
    precision?: string | number | undefined;
}
/**
 * A time column.
 *
 * __Fallback policy:__
 * If the dialect does not support this type natively, it will be replaced by a string type,
 * and a CHECK constraint to enforce a valid ISO 8601 time format.
 *
 * @example
 * ```ts
 * DataTypes.TIME(3)
 * ```
 *
 * @category DataTypes
 */
export declare class TIME extends AbstractDataType<string> {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    readonly options: TimeOptions;
    /**
     * @param precisionOrOptions precision to allow storing milliseconds
     */
    constructor(precisionOrOptions?: number | TimeOptions);
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    toSql(): string;
}
export interface DateOptions {
    /**
     * The precision of the date.
     */
    precision?: string | number | undefined;
}
type RawDate = Date | string | number;
export type AcceptedDate = RawDate | dayjs.Dayjs | number;
/**
 * A date and time.
 *
 * __Fallback policy:__
 * If the dialect does not support this type natively, it will be replaced by a string type,
 * and a CHECK constraint to enforce a valid ISO 8601 date-only format.
 *
 * @example
 * ```ts
 * DataTypes.DATE(3)
 * ```
 *
 * @category DataTypes
 */
export declare class DATE extends AbstractDataType<AcceptedDate> {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    readonly options: DateOptions;
    /**
     * @param precisionOrOptions precision to allow storing milliseconds
     */
    constructor(precisionOrOptions?: number | DateOptions);
    toSql(): string;
    validate(value: any): void;
    sanitize(value: unknown): unknown;
    parseDatabaseValue(value: unknown): unknown;
    areValuesEqual(value: AcceptedDate, originalValue: AcceptedDate): boolean;
    protected _applyTimezone(date: AcceptedDate, options: {
        timezone?: string | undefined;
    }): dayjs.Dayjs;
    toBindableValue(date: AcceptedDate, options: StringifyOptions): string;
}
/**
 * A date only column (no timestamp)
 *
 * __Fallback policy:__
 * If the dialect does not support this type natively, it will be replaced by a string type,
 * and a CHECK constraint to enforce a valid ISO 8601 datetime format.
 *
 * @example
 * ```ts
 * DataTypes.DATEONLY
 * ```
 *
 * @category DataTypes
 */
export declare class DATEONLY extends AbstractDataType<AcceptedDate> {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    toSql(): string;
    toBindableValue(date: AcceptedDate, _options: StringifyOptions): string;
    sanitize(value: unknown): unknown;
    areValuesEqual(value: AcceptedDate, originalValue: AcceptedDate): boolean;
}
/**
 * A key / value store column. Only available in Postgres.
 *
 * __Fallback policy:__
 * If the dialect does not support this type natively, an error will be raised.
 *
 * @example
 * ```ts
 * DataTypes.HSTORE
 * ```
 *
 * @category DataTypes
 */
export declare class HSTORE extends AbstractDataType<HstoreRecord> {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    validate(value: any): void;
    toSql(): string;
}
/**
 * A JSON string column.
 *
 * __Fallback policy:__
 * If the dialect does not support this type natively, but supports verifying a string as is valid JSON through CHECK constraints,
 * that will be used instead.
 * If neither are available, an error will be raised.
 *
 * @example
 * ```ts
 * DataTypes.JSON
 * ```
 *
 * @category DataTypes
 */
export declare class JSON extends AbstractDataType<any> {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    toBindableValue(value: any): string;
    toSql(): string;
}
/**
 * A binary storage JSON column. Only available in Postgres.
 *
 * __Fallback policy:__
 * If the dialect does not support this type natively, an error will be raised.
 *
 * @example
 * ```ts
 * DataTypes.JSONB
 * ```
 *
 * @category DataTypes
 */
export declare class JSONB extends JSON {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    toSql(): string;
}
/**
 * A default value of the current timestamp. Not a valid type.
 *
 * @example
 * ```ts
 * const User = sequelize.define('User', {
 *   registeredAt: {
 *     type: DataTypes.DATE,
 *     defaultValue: DataTypes.NOW,
 *   },
 * });
 * ```
 *
 * @category DataTypes
 */
export declare class NOW extends AbstractDataType<never> {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    toSql(): string;
}
export type AcceptedBlob = Buffer | string;
export type BlobLength = 'tiny' | 'medium' | 'long';
export interface BlobOptions {
    length?: BlobLength | undefined;
}
/**
 * Binary storage. BLOB is the "TEXT" of binary data: it allows data of arbitrary size.
 *
 * __Fallback policy:__
 * If this type is not supported, an error will be raised.
 *
 * @example
 * ```ts
 * const User = sequelize.define('User', {
 *   profilePicture: {
 *     type: DataTypes.BLOB,
 *   },
 * });
 * ```
 *
 * @category DataTypes
 */
export declare class BLOB extends AbstractDataType<AcceptedBlob> {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    readonly options: BlobOptions;
    /**
     * @param lengthOrOptions could be tiny, medium, long.
     */
    constructor(lengthOrOptions?: BlobLength | BlobOptions);
    toSql(): string;
    validate(value: any): void;
    sanitize(value: unknown): unknown;
    escape(value: string | Buffer, options: StringifyOptions): string;
    getBindParamSql(value: AcceptedBlob, options: BindParamOptions): string;
}
export interface RangeOptions {
    subtype?: DataTypeClassOrInstance;
}
/**
 * Range types are data types representing a range of values of some element type (called the range's subtype).
 * Only available in Postgres. See [the Postgres documentation](http://www.postgresql.org/docs/9.4/static/rangetypes.html) for more details
 *
 * __Fallback policy:__
 * If this type is not supported, an error will be raised.
 *
 * @example
 * ```ts
 * // A range of integers
 * DataTypes.RANGE(DataTypes.INTEGER)
 * // A range of bigints
 * DataTypes.RANGE(DataTypes.BIGINT)
 * // A range of decimals
 * DataTypes.RANGE(DataTypes.DECIMAL)
 * // A range of timestamps
 * DataTypes.RANGE(DataTypes.DATE)
 * // A range of dates
 * DataTypes.RANGE(DataTypes.DATEONLY)
 * ```
 *
 * @category DataTypes
 */
export declare class RANGE<T extends BaseNumberDataType | DATE | DATEONLY = INTEGER> extends AbstractDataType<Rangable<AcceptableTypeOf<T>> | AcceptableTypeOf<T>> {
    #private;
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    readonly options: {
        subtype: AbstractDataType<any>;
    };
    /**
     * @param subtypeOrOptions A subtype for range, like RANGE(DATE)
     */
    constructor(subtypeOrOptions: DataTypeClassOrInstance | RangeOptions);
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    toDialectDataType(dialect: AbstractDialect): this;
    parseDatabaseValue(value: unknown): unknown;
    sanitize(value: unknown): unknown;
    validate(value: any): void;
    toSql(): string;
}
/**
 * A column storing a unique universal identifier.
 * Use with `UUIDV1` or `UUIDV4` for default values.
 *
 * __Fallback policy:__
 * If this type is not supported, it will be replaced by a string type with a CHECK constraint to enforce a GUID format.
 *
 *
 * @example
 * ```ts
 * const User = sequelize.define('User', {
 *   id: {
 *     type: DataTypes.UUID,
 *   },
 * });
 * ```
 *
 * @category DataTypes
 */
export declare class UUID extends AbstractDataType<string> {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    validate(value: any): void;
    toSql(): string;
}
/**
 * A default unique universal identifier generated following the UUID v1 standard.
 * Cannot be used as a type, must be used as a default value instead.
 *
 * @example
 * ```ts
 * const User = sequelize.define('User', {
 *   id: {
 *     type: DataTypes.UUID,
 *     defaultValue: DataTypes.UUIDV1,
 *   },
 * });
 * ```
 *
 * @category DataTypes
 */
export declare class UUIDV1 extends AbstractDataType<string> {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    validate(value: any): void;
    toSql(): string;
}
/**
 * A default unique universal identifier generated following the UUID v4 standard.
 * Cannot be used as a type, must be used as a default value instead.
 *
 * @example
 * ```ts
 * const User = sequelize.define('User', {
 *   id: {
 *     type: DataTypes.UUID,
 *     defaultValue: DataTypes.UUIDV4,
 *   },
 * });
 * ```
 *
 * @category DataTypes
 */
export declare class UUIDV4 extends AbstractDataType<string> {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    validate(value: unknown): void;
    toSql(): string;
}
export interface VirtualOptions {
    returnType?: DataTypeClassOrInstance | undefined;
    attributeDependencies?: string[] | undefined;
}
export interface NormalizedVirtualOptions {
    returnType: DataTypeClassOrInstance | undefined;
    attributeDependencies: string[];
}
/**
 * A virtual value that is not stored in the DB. This could for example be useful if you want to provide a default value in your model that is returned to the user but not stored in the DB.
 *
 * You could also use it to validate a value before permuting and storing it. VIRTUAL also takes a return type and dependency fields as arguments
 * If a virtual attribute is present in `attributes` it will automatically pull in the extra fields as well.
 * Return type is mostly useful for setups that rely on types like GraphQL.
 *
 * @example Checking password length before hashing it
 * ```ts
 * sequelize.define('user', {
 *   password_hash: DataTypes.STRING,
 *   password: {
 *     type: DataTypes.VIRTUAL,
 *     set: function (val) {
 *        // Remember to set the data value, otherwise it won't be validated
 *        this.setDataValue('password', val);
 *        this.setDataValue('password_hash', this.salt + val);
 *      },
 *      validate: {
 *         isLongEnough: function (val) {
 *           if (val.length < 7) {
 *             throw new Error("Please choose a longer password")
 *          }
 *       }
 *     }
 *   }
 * })
 * ```
 *
 * In the above code the password is stored plainly in the password field so it can be validated, but is never stored in the DB.
 *
 * @example Virtual with dependency fields
 * ```ts
 * {
 *   active: {
 *     type: new DataTypes.VIRTUAL(DataTypes.BOOLEAN, ['createdAt']),
 *     get: function() {
 *       return this.get('createdAt') > Date.now() - (7 * 24 * 60 * 60 * 1000)
 *     }
 *   }
 * }
 * ```
 *
 * @category DataTypes
 */
export declare class VIRTUAL<T> extends AbstractDataType<T> {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    options: NormalizedVirtualOptions;
    constructor(returnType?: DataTypeClassOrInstance, attributeDependencies?: string[]);
    constructor(options?: VirtualOptions);
    /** @hidden */
    constructor(...args: [returnType?: DataTypeClassOrInstance, attributeDependencies?: string[]] | [options?: VirtualOptions]);
    toSql(): string;
    get returnType(): DataTypeClassOrInstance | undefined;
    get attributeDependencies(): string[];
}
export interface EnumOptions<Member extends string> {
    values: Member[];
}
/**
 * An enumeration, Postgres Only
 *
 * __Fallback policy:__
 * If this type is not supported, it will be replaced by a string type with a CHECK constraint to enforce a list of values.
 *
 * @example
 * ```ts
 * DataTypes.ENUM('value', 'another value')
 * DataTypes.ENUM(['value', 'another value'])
 * DataTypes.ENUM({
 *   values: ['value', 'another value'],
 * });
 * ```
 *
 * @category DataTypes
 */
export declare class ENUM<Member extends string> extends AbstractDataType<Member> {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    readonly options: EnumOptions<Member>;
    /**
     * @param options either array of values or options object with values array. It also supports variadic values.
     */
    constructor(options: EnumOptions<Member>);
    constructor(members: Member[]);
    constructor(...members: Member[]);
    /** @hidden */
    constructor(...args: [options: EnumOptions<Member>] | [members: Member[]] | [...members: Member[]]);
    validate(value: any): asserts value is Member;
    toSql(options: ToSqlOptions): string;
}
export interface ArrayOptions {
    type: DataTypeClassOrInstance;
}
interface NormalizedArrayOptions {
    type: AbstractDataType<any>;
}
/**
 * An array of `type`. Only available in Postgres.
 *
 * __Fallback policy:__
 * If this type is not supported, an error will be raised.
 *
 * @example
 * ```ts
 * DataTypes.ARRAY(DataTypes.DECIMAL)
 * ```
 *
 * @category DataTypes
 */
export declare class ARRAY<T extends AbstractDataType<any>> extends AbstractDataType<Array<AcceptableTypeOf<T>>> {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    readonly options: NormalizedArrayOptions;
    /**
     * @param typeOrOptions type of array values
     */
    constructor(typeOrOptions: DataTypeClassOrInstance | ArrayOptions);
    toSql(options: ToSqlOptions): string;
    validate(value: any): void;
    sanitize(value: unknown): unknown;
    parseDatabaseValue(value: unknown[]): unknown;
    toBindableValue(value: Array<AcceptableTypeOf<T>>, _options: StringifyOptions): unknown;
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    toDialectDataType(dialect: AbstractDialect): this;
    attachUsageContext(usageContext: DataTypeUseContext): this;
    static is<T extends AbstractDataType<any>>(obj: unknown, type: new () => T): obj is ARRAY<T>;
}
export interface GeometryOptions {
    type?: GeoJsonType | undefined;
    srid?: number | undefined;
}
/**
 * A column storing Geometry information.
 * It is only available in PostgreSQL (with PostGIS), MariaDB or MySQL.
 *
 * GeoJSON is accepted as input and returned as output.
 *
 * In PostGIS, the GeoJSON is parsed using the PostGIS function `STGeomFromGeoJSON`.
 * In MySQL it is parsed using the function `STGeomFromText`.
 *
 * Therefore, one can just follow the [GeoJSON spec](https://tools.ietf.org/html/rfc7946) for handling geometry objects.  See the following examples:
 *
 * __Fallback policy:__
 * If this type is not supported, an error will be raised.
 *
 * @example Defining a Geometry type attribute
 * ```ts
 * DataTypes.GEOMETRY
 * DataTypes.GEOMETRY('POINT')
 * DataTypes.GEOMETRY('POINT', 4326)
 * ```
 *
 * @example Create a new point
 * ```ts
 * const point = { type: 'Point', coordinates: [-76.984722, 39.807222]}; // GeoJson format: [lng, lat]
 *
 * User.create({username: 'username', geometry: point });
 * ```
 *
 * @example Create a new linestring
 * ```ts
 * const line = { type: 'LineString', 'coordinates': [ [100.0, 0.0], [101.0, 1.0] ] };
 *
 * User.create({username: 'username', geometry: line });
 * ```
 *
 * @example Create a new polygon
 * ```ts
 * const polygon = { type: 'Polygon', coordinates: [
 *                 [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
 *                   [100.0, 1.0], [100.0, 0.0] ]
 *                 ]};
 *
 * User.create({username: 'username', geometry: polygon });
 * ```
 *
 * @example Create a new point with a custom SRID
 * ```ts
 * const point = {
 *   type: 'Point',
 *   coordinates: [-76.984722, 39.807222], // GeoJson format: [lng, lat]
 *   crs: { type: 'name', properties: { name: 'EPSG:4326'} }
 * };
 *
 * User.create({username: 'username', geometry: point })
 * ```
 *
 * @see {@link <internal>~GEOGRAPHY}
 * @category DataTypes
 */
export declare class GEOMETRY extends AbstractDataType<GeoJson> {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    readonly options: GeometryOptions;
    /**
     * @param {string} [type] Type of geometry data
     * @param {string} [srid] SRID of type
     */
    constructor(type: GeoJsonType, srid?: number);
    constructor(options: GeometryOptions);
    /** @hidden */
    constructor(...args: [type: GeoJsonType, srid?: number] | [options: GeometryOptions]);
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    validate(value: unknown): asserts value is GeoJson;
    toSql(): string;
}
/**
 * A geography datatype represents two dimensional spacial objects in an elliptic coord system.
 *
 * **The difference from geometry and geography type:**
 *
 * PostGIS 1.5 introduced a new spatial type called geography, which uses geodetic measurement instead of Cartesian measurement.
 * Coordinate points in the geography type are always represented in WGS 84 lon lat degrees (SRID 4326),
 * but measurement functions and relationships STDistance, STDWithin, STLength, and STArea always return answers in meters or assume inputs in meters.
 *
 * **What is best to use? It depends:**
 *
 * When choosing between the geometry and geography type for data storage, you should consider what you’ll be using it for.
 * If all you do are simple measurements and relationship checks on your data, and your data covers a fairly large area, then most likely you’ll be better off storing your data using the new geography type.
 * Although the new geography data type can cover the globe, the geometry type is far from obsolete.
 * The geometry type has a much richer set of functions than geography, relationship checks are generally faster, and it has wider support currently across desktop and web-mapping tools
 *
 * __Fallback policy:__
 * If this type is not supported, an error will be raised.
 *
 * @example Defining a Geography type attribute
 * ```ts
 * DataTypes.GEOGRAPHY
 * DataTypes.GEOGRAPHY('POINT')
 * DataTypes.GEOGRAPHY('POINT', 4326)
 * ```
 *
 * @category DataTypes
 */
export declare class GEOGRAPHY extends GEOMETRY {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    toSql(): string;
}
/**
 * The cidr type holds an IPv4 or IPv6 network specification. Takes 7 or 19 bytes.
 *
 * Only available for Postgres
 *
 * __Fallback policy:__
 * If this type is not supported, an error will be raised.
 *
 * @example
 * ```ts
 * DataTypes.CIDR
 * ```
 *
 * @category DataTypes
 */
export declare class CIDR extends AbstractDataType<string> {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    validate(value: any): void;
    toSql(): string;
}
/**
 * The INET type holds an IPv4 or IPv6 host address, and optionally its subnet. Takes 7 or 19 bytes
 *
 * Only available for Postgres
 *
 * __Fallback policy:__
 * If this type is not supported, an error will be raised.
 *
 * @example
 * ```ts
 * DataTypes.INET
 * ```
 *
 * @category DataTypes
 */
export declare class INET extends AbstractDataType<string> {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    validate(value: any): void;
    toSql(): string;
}
/**
 * The MACADDR type stores MAC addresses. Takes 6 bytes
 *
 * Only available for Postgres
 *
 * __Fallback policy:__
 * If this type is not supported, an error will be raised.
 *
 * @example
 * ```ts
 * DataTypes.MACADDR
 * ```
 *
 * @category DataTypes
 */
export declare class MACADDR extends AbstractDataType<string> {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    validate(value: any): void;
    toSql(): string;
}
/**
 * The TSVECTOR type stores text search vectors.
 *
 * Only available for Postgres
 *
 * __Fallback policy:__
 * If this type is not supported, an error will be raised.
 *
 * @example
 * ```ts
 * DataTypes.TSVECTOR
 * ```
 *
 * @category DataTypes
 */
export declare class TSVECTOR extends AbstractDataType<string> {
    /** @hidden */
    static readonly [kDataTypeIdentifier]: string;
    validate(value: any): void;
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    toSql(): string;
}
export {};
