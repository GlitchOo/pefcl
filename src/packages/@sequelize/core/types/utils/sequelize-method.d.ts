import type { Op, WhereOperators, WhereLeftOperand, WhereAttributeHashValue } from '..';
/**
 * Utility functions for representing SQL functions, and columns that should be escaped.
 * Please do not use these functions directly, use Sequelize.fn and Sequelize.col instead.
 *
 * @private
 */
export declare class SequelizeMethod {
}
/**
 * Do not use me directly. Use {@link fn}
 */
export declare class Fn extends SequelizeMethod {
    private readonly fn;
    private readonly args;
    constructor(fn: string, args: Fn['args']);
    clone(): Fn;
}
/**
 * Do not use me directly. Use {@link col}
 */
export declare class Col extends SequelizeMethod {
    private readonly col;
    constructor(col: string[] | string, ...args: string[]);
}
/**
 * Do not use me directly. Use {@link cast}
 */
export declare class Cast extends SequelizeMethod {
    private readonly val;
    private readonly type;
    private readonly json;
    constructor(val: unknown, type?: string, json?: boolean);
}
/**
 * Do not use me directly. Use {@link literal}
 */
export declare class Literal extends SequelizeMethod {
    /** this (type-only) brand prevents TypeScript from thinking Cast is assignable to Literal because they share the same shape */
    private readonly brand;
    private readonly val;
    constructor(val: unknown);
}
/**
 * Do not use me directly. Use {@link json}
 */
export declare class Json extends SequelizeMethod {
    private readonly conditions?;
    private readonly path?;
    private readonly value?;
    constructor(conditionsOrPath: {
        [key: string]: any;
    } | string, value?: string | number | boolean | null);
}
/**
 * Do not use me directly. Use {@link where}
 */
export declare class Where<Operator extends keyof WhereOperators = typeof Op.eq> extends SequelizeMethod {
    private readonly attribute;
    private readonly comparator;
    private readonly logic;
    constructor(leftOperand: WhereLeftOperand, operator: Operator, rightOperand: WhereOperators[Operator]);
    constructor(leftOperand: WhereLeftOperand, operator: string, rightOperand: any);
    constructor(leftOperand: WhereLeftOperand, rightOperand: WhereAttributeHashValue<any>);
}
