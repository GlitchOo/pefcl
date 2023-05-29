import * as BaseTypes from '../abstract/data-types.js';
import type { AcceptedDate, StringifyOptions } from '../abstract/data-types.js';
import type { AbstractDialect } from '../abstract/index.js';
export declare class DATE extends BaseTypes.DATE {
    toSql(): string;
    toBindableValue(date: AcceptedDate, options: StringifyOptions): string;
}
export declare class UUID extends BaseTypes.UUID {
    toSql(): string;
}
export declare class ENUM<Member extends string> extends BaseTypes.ENUM<Member> {
    toSql(): string;
}
export declare class TEXT extends BaseTypes.TEXT {
    toSql(): string;
}
export declare class JSON extends BaseTypes.JSON {
    escape(value: any, options: StringifyOptions): string;
}
/** @deprecated */
export declare class REAL extends BaseTypes.REAL {
    toSql(): string;
}
export declare class FLOAT extends BaseTypes.FLOAT {
    toSql(): string;
}
export declare class DOUBLE extends BaseTypes.DOUBLE {
    toSql(): string;
}
export declare class TINYINT extends BaseTypes.TINYINT {
    toSql(): string;
}
export declare class SMALLINT extends BaseTypes.SMALLINT {
    toSql(): string;
}
export declare class MEDIUMINT extends BaseTypes.MEDIUMINT {
    toSql(): string;
}
export declare class INTEGER extends BaseTypes.INTEGER {
    toSql(): string;
}
export declare class BIGINT extends BaseTypes.BIGINT {
    protected _supportsNativeUnsigned(_dialect: AbstractDialect): boolean;
    toSql(): string;
}
