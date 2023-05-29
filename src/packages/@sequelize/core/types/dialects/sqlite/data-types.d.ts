import * as BaseTypes from '../abstract/data-types.js';
import type { AbstractDialect } from '../abstract/index.js';
export declare class BOOLEAN extends BaseTypes.BOOLEAN {
    escape(value: boolean): string;
    toBindableValue(value: boolean): unknown;
    toSql(): string;
}
export declare class STRING extends BaseTypes.STRING {
    toSql(): "TEXT" | "TEXT COLLATE BINARY";
}
export declare class TEXT extends BaseTypes.TEXT {
    protected _checkOptionSupport(dialect: AbstractDialect): void;
}
export declare class CITEXT extends BaseTypes.CITEXT {
    toSql(): string;
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
    toSql(): string;
}
export declare class FLOAT extends BaseTypes.FLOAT {
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    protected getNumberSqlTypeName(): string;
}
export declare class DOUBLE extends BaseTypes.DOUBLE {
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    protected getNumberSqlTypeName(): string;
}
/**
 * @deprecated use FLOAT.
 */
export declare class REAL extends BaseTypes.REAL {
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    protected getNumberSqlTypeName(): string;
}
export declare class TIME extends BaseTypes.TIME {
    toSql(): string;
}
export declare class DATE extends BaseTypes.DATE {
    toSql(): string;
}
export declare class DATEONLY extends BaseTypes.DATEONLY {
    toSql(): string;
}
export declare class BLOB extends BaseTypes.BLOB {
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    toSql(): string;
}
export declare class JSON extends BaseTypes.JSON {
    toBindableValue(value: any): string;
    parseDatabaseValue(value: unknown): unknown;
    toSql(): string;
}
export declare class UUID extends BaseTypes.UUID {
    toSql(): string;
}
export declare class ENUM<Member extends string> extends BaseTypes.ENUM<Member> {
    toSql(): string;
}
