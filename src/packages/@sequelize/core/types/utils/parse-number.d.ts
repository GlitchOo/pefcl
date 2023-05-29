import type { Class } from 'type-fest';
/**
 * Parses a string as a number in base 10.
 * Unlike {@link Number}, this method doesn't return 0 for ''
 * Unlike {@link parseInt}, this method returns NaN if it encounters any character that is not part of the number.
 *
 * @param value The string to parse as a floating point number
 * @returns NaN if the input is not a base 10 number, or Infinity
 */
export declare function parseNumber(value: string | bigint): number;
export declare function parseNumberOrThrow(value: string | bigint, ErrorClass?: Class<Error>): number;
export declare function parseBigInt(value: number | string): bigint;
