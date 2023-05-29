/**
 * The classes declared in this files are the DataTypes available on the `DataTypes` namespace.
 * You can access them as follows:
 *
 * ```ts
 * import { DataTypes } from '@sequelize/core';
 *
 * DataTypes.STRING;
 * ```
 *
 * @module DataTypes
 */
import * as DataTypes from './dialects/abstract/data-types.js';
/** This is an alias of {@link <internal>~AbstractDataType}. */
export declare const ABSTRACT: typeof DataTypes.AbstractDataType;
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~STRING} for all available options. */
export declare const STRING: typeof DataTypes.STRING & ((...args: [] | [length: number] | [length: number, binary: boolean] | [options: DataTypes.StringTypeOptions]) => DataTypes.STRING);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~CHAR} for all available options. */
export declare const CHAR: typeof DataTypes.CHAR & ((...args: [] | [length: number] | [length: number, binary: boolean] | [options: DataTypes.StringTypeOptions]) => DataTypes.CHAR);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~TEXT} for all available options. */
export declare const TEXT: typeof DataTypes.TEXT & ((lengthOrOptions?: DataTypes.TextLength | DataTypes.TextOptions | undefined) => DataTypes.TEXT);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~TINYINT} for all available options. */
export declare const TINYINT: typeof DataTypes.TINYINT & ((optionsOrLength?: number | Readonly<DataTypes.IntegerOptions> | undefined) => DataTypes.TINYINT);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~SMALLINT} for all available options. */
export declare const SMALLINT: typeof DataTypes.SMALLINT & ((optionsOrLength?: number | Readonly<DataTypes.IntegerOptions> | undefined) => DataTypes.SMALLINT);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~MEDIUMINT} for all available options. */
export declare const MEDIUMINT: typeof DataTypes.MEDIUMINT & ((optionsOrLength?: number | Readonly<DataTypes.IntegerOptions> | undefined) => DataTypes.MEDIUMINT);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~INTEGER} for all available options. */
export declare const INTEGER: typeof DataTypes.INTEGER & ((optionsOrLength?: number | Readonly<DataTypes.IntegerOptions> | undefined) => DataTypes.INTEGER);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~BIGINT} for all available options. */
export declare const BIGINT: typeof DataTypes.BIGINT & ((optionsOrLength?: number | Readonly<DataTypes.IntegerOptions> | undefined) => DataTypes.BIGINT);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~FLOAT} for all available options. */
export declare const FLOAT: typeof DataTypes.FLOAT & ((...args: [] | [precision: number] | [precision: number, scale: number] | [options: DataTypes.DecimalNumberOptions]) => DataTypes.FLOAT);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~TIME} for all available options. */
export declare const TIME: typeof DataTypes.TIME & ((precisionOrOptions?: number | DataTypes.TimeOptions | undefined) => DataTypes.TIME);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~DATE} for all available options. */
export declare const DATE: typeof DataTypes.DATE & ((precisionOrOptions?: number | DataTypes.DateOptions | undefined) => DataTypes.DATE);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~DATEONLY} for all available options. */
export declare const DATEONLY: typeof DataTypes.DATEONLY & (() => DataTypes.DATEONLY);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~BOOLEAN} for all available options. */
export declare const BOOLEAN: typeof DataTypes.BOOLEAN & (() => DataTypes.BOOLEAN);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~NOW} for all available options. */
export declare const NOW: typeof DataTypes.NOW & (() => DataTypes.NOW);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~BLOB} for all available options. */
export declare const BLOB: typeof DataTypes.BLOB & ((lengthOrOptions?: DataTypes.BlobLength | DataTypes.BlobOptions | undefined) => DataTypes.BLOB);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~DECIMAL} for all available options. */
export declare const DECIMAL: typeof DataTypes.DECIMAL & ((...args: [] | [precision: number] | [precision: number, scale: number] | [options: DataTypes.DecimalNumberOptions]) => DataTypes.DECIMAL);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~UUID} for all available options. */
export declare const UUID: typeof DataTypes.UUID & (() => DataTypes.UUID);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~UUIDV1} for all available options. */
export declare const UUIDV1: typeof DataTypes.UUIDV1 & (() => DataTypes.UUIDV1);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~UUIDV4} for all available options. */
export declare const UUIDV4: typeof DataTypes.UUIDV4 & (() => DataTypes.UUIDV4);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~HSTORE} for all available options. */
export declare const HSTORE: typeof DataTypes.HSTORE & (() => DataTypes.HSTORE);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~JSON} for all available options. */
export declare const JSON: typeof DataTypes.JSON & (() => DataTypes.JSON);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~JSONB} for all available options. */
export declare const JSONB: typeof DataTypes.JSONB & (() => DataTypes.JSONB);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~VIRTUAL} for all available options. */
export declare const VIRTUAL: typeof DataTypes.VIRTUAL & ((...args: [returnType?: DataTypes.DataTypeClassOrInstance, attributeDependencies?: string[]] | [options?: DataTypes.VirtualOptions]) => DataTypes.VIRTUAL<unknown>);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~ARRAY} for all available options. */
export declare const ARRAY: typeof DataTypes.ARRAY & ((typeOrOptions: DataTypes.DataTypeClassOrInstance | DataTypes.ArrayOptions) => DataTypes.ARRAY<DataTypes.AbstractDataType<any>>);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~ENUM} for all available options. */
export declare const ENUM: typeof DataTypes.ENUM & ((...args: string[] | [options: DataTypes.EnumOptions<string>] | [members: string[]]) => DataTypes.ENUM<string>);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~RANGE} for all available options. */
export declare const RANGE: typeof DataTypes.RANGE & ((subtypeOrOptions: DataTypes.DataTypeClassOrInstance | DataTypes.RangeOptions) => DataTypes.RANGE<DataTypes.DATE | DataTypes.DATEONLY | DataTypes.BaseNumberDataType<DataTypes.NumberOptions>>);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~REAL} for all available options. */
export declare const REAL: typeof DataTypes.REAL & ((...args: [] | [precision: number] | [precision: number, scale: number] | [options: DataTypes.DecimalNumberOptions]) => DataTypes.REAL);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~DOUBLE} for all available options. */
export declare const DOUBLE: typeof DataTypes.DOUBLE & ((...args: [] | [precision: number] | [precision: number, scale: number] | [options: DataTypes.DecimalNumberOptions]) => DataTypes.DOUBLE);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~GEOMETRY} for all available options. */
export declare const GEOMETRY: typeof DataTypes.GEOMETRY & ((...args: [type: import("./geo-json.js").GeoJsonType, srid?: number] | [options: DataTypes.GeometryOptions]) => DataTypes.GEOMETRY);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~GEOGRAPHY} for all available options. */
export declare const GEOGRAPHY: typeof DataTypes.GEOGRAPHY & ((...args: [type: import("./geo-json.js").GeoJsonType, srid?: number] | [options: DataTypes.GeometryOptions]) => DataTypes.GEOGRAPHY);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~CIDR} for all available options. */
export declare const CIDR: typeof DataTypes.CIDR & (() => DataTypes.CIDR);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~INET} for all available options. */
export declare const INET: typeof DataTypes.INET & (() => DataTypes.INET);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~MACADDR} for all available options. */
export declare const MACADDR: typeof DataTypes.MACADDR & (() => DataTypes.MACADDR);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~CITEXT} for all available options. */
export declare const CITEXT: typeof DataTypes.CITEXT & (() => DataTypes.CITEXT);
/** This is a simple wrapper to make the DataType constructable without `new`. See {@link <internal>~TSVECTOR} for all available options. */
export declare const TSVECTOR: typeof DataTypes.TSVECTOR & (() => DataTypes.TSVECTOR);
