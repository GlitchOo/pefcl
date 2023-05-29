import type { Falsy } from '../../generic/falsy.js';
import type { GeoJson } from '../../geo-json.js';
import * as BaseTypes from '../abstract/data-types.js';
import type { AcceptedDate, StringifyOptions, ToSqlOptions, BindParamOptions } from '../abstract/data-types.js';
export declare class FLOAT extends BaseTypes.FLOAT {
    protected getNumberSqlTypeName(): string;
    protected _supportsNativeUnsigned(): boolean;
}
export declare class DOUBLE extends BaseTypes.DOUBLE {
    protected getNumberSqlTypeName(): string;
    protected _supportsNativeUnsigned(): boolean;
}
/** @deprecated */
export declare class REAL extends BaseTypes.REAL {
    protected _supportsNativeUnsigned(): boolean;
}
export declare class DECIMAL extends BaseTypes.DECIMAL {
    protected _supportsNativeUnsigned(): boolean;
}
export declare class TINYINT extends BaseTypes.TINYINT {
    protected _supportsNativeUnsigned(): boolean;
}
export declare class SMALLINT extends BaseTypes.SMALLINT {
    protected _supportsNativeUnsigned(): boolean;
}
export declare class MEDIUMINT extends BaseTypes.MEDIUMINT {
    protected _supportsNativeUnsigned(): boolean;
}
export declare class INTEGER extends BaseTypes.INTEGER {
    protected _supportsNativeUnsigned(): boolean;
}
export declare class BIGINT extends BaseTypes.BIGINT {
    protected _supportsNativeUnsigned(): boolean;
}
export declare class BOOLEAN extends BaseTypes.BOOLEAN {
    toSql(): string;
    escape(value: boolean | Falsy): string;
    toBindableValue(value: boolean | Falsy): unknown;
}
export declare class DATE extends BaseTypes.DATE {
    toBindableValue(date: AcceptedDate, options: StringifyOptions): string;
    sanitize(value: unknown, options?: {
        timezone?: string;
    }): unknown;
}
export declare class UUID extends BaseTypes.UUID {
    toSql(): string;
}
export declare class GEOMETRY extends BaseTypes.GEOMETRY {
    toBindableValue(value: GeoJson, options: StringifyOptions): string;
    getBindParamSql(value: GeoJson, options: BindParamOptions): string;
    toSql(): string;
}
export declare class ENUM<Member extends string> extends BaseTypes.ENUM<Member> {
    toSql(options: ToSqlOptions): string;
}
