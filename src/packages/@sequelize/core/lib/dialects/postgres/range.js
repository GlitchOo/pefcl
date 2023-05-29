"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var range_exports = {};
__export(range_exports, {
  buildRangeParser: () => buildRangeParser,
  isInputRangePart: () => isInputRangePart,
  parse: () => parse,
  stringify: () => stringify
});
module.exports = __toCommonJS(range_exports);
var import_node_util = __toESM(require("node:util"));
var import_isPlainObject = __toESM(require("lodash/isPlainObject"));
function stringifyRangeBound(bound, stringifyBoundary) {
  if (bound === null) {
    return "";
  }
  if (bound === Number.POSITIVE_INFINITY || bound === Number.NEGATIVE_INFINITY) {
    return bound.toString().toLowerCase();
  }
  return stringifyBoundary(bound);
}
function parseRangeBound(bound, parseType) {
  if (!bound) {
    return null;
  }
  if (bound === "infinity") {
    return Number.POSITIVE_INFINITY;
  }
  if (bound === "-infinity") {
    return Number.NEGATIVE_INFINITY;
  }
  if (bound.startsWith('"')) {
    bound = bound.slice(1);
  }
  if (bound.endsWith('"')) {
    bound = bound.slice(0, -1);
  }
  return parseType(bound);
}
function stringify(range, stringifyBoundary) {
  if (range.length === 0) {
    return "empty";
  }
  if (range.length !== 2) {
    throw new Error("range array length must be 0 (empty) or 2 (lower and upper bounds)");
  }
  const inclusivity = [true, false];
  const bounds = range.map((rangePart, index) => {
    if (isInputRangePart(rangePart)) {
      if (typeof rangePart.inclusive === "boolean") {
        inclusivity[index] = rangePart.inclusive;
      }
      rangePart = rangePart.value;
    }
    return stringifyRangeBound(rangePart, stringifyBoundary);
  });
  return `${(inclusivity[0] ? "[" : "(") + bounds[0]},${bounds[1]}${inclusivity[1] ? "]" : ")"}`;
}
function parse(value, parser) {
  if (typeof value !== "string") {
    throw new TypeError(`Sequelize could not parse range "${value}" as its format is incompatible`);
  }
  if (value === "empty") {
    return [];
  }
  const result = value.slice(1, -1).split(",", 2);
  if (result.length !== 2) {
    throw new TypeError(`Sequelize could not parse range "${value}" as its format is incompatible`);
  }
  return result.map((item, index) => {
    const part = {
      value: parseRangeBound(item, parser),
      inclusive: index === 0 ? value.startsWith("[") : value.endsWith("]")
    };
    return part;
  });
}
function isInputRangePart(val) {
  return (0, import_isPlainObject.default)(val) && Object.prototype.hasOwnProperty.call(val, "value");
}
function buildRangeParser(subTypeParser) {
  return (value) => {
    if (typeof value !== "string") {
      throw new TypeError(import_node_util.default.format(`Sequelize could not parse range "%O" as its format is incompatible`, value));
    }
    return parse(value, subTypeParser);
  };
}
//# sourceMappingURL=range.js.map
