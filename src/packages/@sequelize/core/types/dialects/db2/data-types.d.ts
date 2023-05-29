import * as BaseTypes from '../abstract/data-types.js';
import type { AcceptedDate, ToSqlOptions } from '../abstract/data-types.js';
import type { AbstractDialect } from '../abstract/index.js';
export declare class BLOB extends BaseTypes.BLOB {
    toSql(): string;
}
export declare class STRING extends BaseTypes.STRING {
    toSql(options: ToSqlOptions): string;
}
export declare class CHAR extends BaseTypes.CHAR {
    toSql(): string;
}
export declare class TEXT extends BaseTypes.TEXT {
    toSql(): string;
}
export declare class UUID extends BaseTypes.UUID {
    toSql(): string;
}
export declare class NOW extends BaseTypes.NOW {
    toSql(): string;
}
export declare class DATE extends BaseTypes.DATE {
    protected _checkOptionSupport(dialect: AbstractDialect): void;
    toSql(): string;
    toBindableValue(date: AcceptedDate): string;
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
export declare class FLOAT extends BaseTypes.FLOAT {
    getNumberSqlTypeName(): string;
}
export declare class DOUBLE extends BaseTypes.DOUBLE {
    getNumberSqlTypeName(): string;
}
export declare class DECIMAL extends BaseTypes.DECIMAL {
}
export declare class ENUM<Member extends string> extends BaseTypes.ENUM<Member> {
    toSql(): string;
}
