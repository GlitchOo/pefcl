"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var parse_number_exports = {};
__export(parse_number_exports, {
  parseBigInt: () => parseBigInt,
  parseNumber: () => parseNumber,
  parseNumberOrThrow: () => parseNumberOrThrow
});
module.exports = __toCommonJS(parse_number_exports);
const BASE10_NUMBER_SCIENTIFIC_REGEX = /^[-+]?[0-9]*(\.[0-9]+)?([eE][-+]?[0-9]+)?$/;
function parseNumber(value) {
  if (typeof value === "bigint") {
    if (value > Number.MAX_SAFE_INTEGER || value < Number.MIN_SAFE_INTEGER) {
      throw new TypeError(`Cannot cast BigInt ${value} to Number, because the value would be outside of the Safe Integer range.`);
    }
    return Number(value);
  }
  if (!BASE10_NUMBER_SCIENTIFIC_REGEX.test(value) && value !== "Infinity" && value !== "-Infinity") {
    return Number.NaN;
  }
  if (value === "") {
    return Number.NaN;
  }
  return Number(value);
}
function parseNumberOrThrow(value, ErrorClass = SyntaxError) {
  const result = parseNumber(value);
  if (Number.isNaN(result)) {
    throw new ErrorClass(`Cannot parse String ${value} as a Number.`);
  }
  return result;
}
const BASE10_INTEGER_REGEX = /^[-+]?[0-9]+$/;
function parseBigInt(value) {
  if (typeof value === "number") {
    if (Number.isInteger(value) && !Number.isSafeInteger(value)) {
      throw new TypeError(`Cannot cast Number ${value} to BigInt, because the value is already outside of the Safe Integer range. You need to use a String or BigInt instead of a Number for this value.`);
    }
  } else if (!BASE10_INTEGER_REGEX.test(value)) {
    throw new SyntaxError(`Cannot parse String ${value} as a BigInt.`);
  }
  return BigInt(value);
}
//# sourceMappingURL=parse-number.js.map
