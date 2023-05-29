import type { Rangable, Range, InputRangePart } from '../../model.js';
type ParseValue<T> = (input: string) => T;
export declare function stringify<T extends {}>(range: Rangable<T>, stringifyBoundary: (val: T) => string): string;
export declare function parse<T>(value: string, parser: ParseValue<T>): Range<T>;
export declare function isInputRangePart<T>(val: unknown): val is InputRangePart<T>;
export declare function buildRangeParser(subTypeParser: (value: unknown) => unknown): (value: unknown) => unknown;
export {};
