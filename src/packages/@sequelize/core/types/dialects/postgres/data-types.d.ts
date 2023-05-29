import type { Rangable } from '../../model.js';
import type { AcceptableTypeOf, StringifyOptions, BindParamOptions, AcceptedDate } from '../abstract/data-types';
import * as BaseTypes from '../abstract/data-types';
import type { AbstractDialect } from '../abstract/index.js';
export declare class DATEONLY extends BaseTypes.DATEONLY {
    toBindableValue(value: AcceptableTypeOf<BaseTypes.DATEONLY>, options: StringifyOptions): string;
    sanitize(value: unknown): unknown;
}
export declare class DECIMAL extends BaseTypes.DECIMAL {
}
export declare class TEXT extends BaseTypes.TEXT {
    protected _checkOptionSupport(dialect: AbstractDialect): void;
}
export declare class DATE extends BaseTypes.DATE {
    toSql(): string;
    validate(value: any): void;
    toBindableValue(value: AcceptedDate, options: StringifyOptions): string;
    sanitize(value: unknown): unknown;
}
export declare class TINYINT extends BaseTypes.TINYINT {
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    toSql(): string;
}
export declare class SMALLINT extends BaseTypes.SMALLINT {
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    toSql(): string;
}
export declare class MEDIUMINT extends BaseTypes.MEDIUMINT {
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    toSql(): string;
}
export declare class INTEGER extends BaseTypes.INTEGER {
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    toSql(): string;
}
export declare class BIGINT extends BaseTypes.BIGINT {
    protected _checkOptionSupport(dialect: AbstractDialect): void;
}
export declare class DOUBLE extends BaseTypes.DOUBLE {
}
export declare class FLOAT extends BaseTypes.FLOAT {
    protected getNumberSqlTypeName(): string;
}
export declare class BLOB extends BaseTypes.BLOB {
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    toSql(): string;
}
export declare class GEOMETRY extends BaseTypes.GEOMETRY {
    toSql(): string;
    parse(value: string): {};
    toBindableValue(value: AcceptableTypeOf<BaseTypes.GEOMETRY>, options: StringifyOptions): string;
    getBindParamSql(value: AcceptableTypeOf<BaseTypes.GEOMETRY>, options: BindParamOptions): string;
}
export declare class GEOGRAPHY extends BaseTypes.GEOGRAPHY {
    toSql(): string;
    toBindableValue(value: AcceptableTypeOf<BaseTypes.GEOGRAPHY>, options: StringifyOptions): string;
    getBindParamSql(value: AcceptableTypeOf<BaseTypes.GEOGRAPHY>, options: BindParamOptions): string;
}
export declare class HSTORE extends BaseTypes.HSTORE {
    toBindableValue(value: AcceptableTypeOf<BaseTypes.HSTORE>): string;
}
export declare class RANGE<T extends BaseTypes.BaseNumberDataType | DATE | DATEONLY = INTEGER> extends BaseTypes.RANGE<T> {
    #private;
    toBindableValue(values: Rangable<AcceptableTypeOf<T>>, options: StringifyOptions): unknown;
    escape(values: Rangable<AcceptableTypeOf<T>>, options: StringifyOptions): string;
    getBindParamSql(values: Rangable<AcceptableTypeOf<T>>, options: BindParamOptions): string;
    toSql(): string;
    static typeMap: {
        subTypes: Record<string, string>;
        castTypes: Record<string, string>;
    };
}
export declare class ARRAY<T extends BaseTypes.AbstractDataType<any>> extends BaseTypes.ARRAY<T> {
    escape(values: Array<AcceptableTypeOf<T>>, options: StringifyOptions): string;
    getBindParamSql(values: Array<AcceptableTypeOf<T>>, options: BindParamOptions): string;
}
export declare class ENUM<Members extends string> extends BaseTypes.ENUM<Members> {
    toSql(): string;
}
