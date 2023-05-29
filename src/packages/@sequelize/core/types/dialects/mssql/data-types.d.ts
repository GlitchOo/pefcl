import type { Falsy } from '../../generic/falsy.js';
import * as BaseTypes from '../abstract/data-types.js';
import type { AbstractDialect } from '../abstract/index.js';
export declare class BLOB extends BaseTypes.BLOB {
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    toSql(): "VARBINARY(256)" | "VARBINARY(MAX)";
}
export declare class STRING extends BaseTypes.STRING {
    toSql(): string;
}
export declare class TEXT extends BaseTypes.TEXT {
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    toSql(): "NVARCHAR(256)" | "NVARCHAR(MAX)";
}
export declare class BOOLEAN extends BaseTypes.BOOLEAN {
    escape(value: boolean | Falsy): string;
    toBindableValue(value: boolean | Falsy): unknown;
    toSql(): string;
}
export declare class UUID extends BaseTypes.UUID {
    toSql(): string;
}
export declare class NOW extends BaseTypes.NOW {
    toSql(): string;
}
export declare class DATE extends BaseTypes.DATE {
    toSql(): string;
}
export declare class TINYINT extends BaseTypes.TINYINT {
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    toSql(): "TINYINT" | "SMALLINT";
}
export declare class SMALLINT extends BaseTypes.SMALLINT {
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    toSql(): "SMALLINT" | "INT";
}
export declare class MEDIUMINT extends BaseTypes.MEDIUMINT {
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    toSql(): string;
}
export declare class INTEGER extends BaseTypes.INTEGER {
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    toSql(): "INTEGER" | "BIGINT";
}
export declare class BIGINT extends BaseTypes.BIGINT {
    protected _checkOptionSupport(dialect: AbstractDialect): void;
}
export declare class FLOAT extends BaseTypes.FLOAT {
    protected getNumberSqlTypeName(): string;
}
export declare class DOUBLE extends BaseTypes.DOUBLE {
}
export declare class DECIMAL extends BaseTypes.DECIMAL {
}
export declare class JSON extends BaseTypes.JSON {
    toBindableValue(value: any): string;
    parseDatabaseValue(value: unknown): unknown;
    toSql(): string;
}
export declare class ENUM<Member extends string> extends BaseTypes.ENUM<Member> {
    toSql(): string;
}
