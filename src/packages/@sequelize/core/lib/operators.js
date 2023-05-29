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
var operators_exports = {};
__export(operators_exports, {
  Op: () => Op
});
module.exports = __toCommonJS(operators_exports);
const Op = {
  eq: Symbol.for("eq"),
  ne: Symbol.for("ne"),
  gte: Symbol.for("gte"),
  gt: Symbol.for("gt"),
  lte: Symbol.for("lte"),
  lt: Symbol.for("lt"),
  not: Symbol.for("not"),
  is: Symbol.for("is"),
  in: Symbol.for("in"),
  notIn: Symbol.for("notIn"),
  like: Symbol.for("like"),
  notLike: Symbol.for("notLike"),
  iLike: Symbol.for("iLike"),
  notILike: Symbol.for("notILike"),
  startsWith: Symbol.for("startsWith"),
  notStartsWith: Symbol.for("notStartsWith"),
  endsWith: Symbol.for("endsWith"),
  notEndsWith: Symbol.for("notEndsWith"),
  substring: Symbol.for("substring"),
  notSubstring: Symbol.for("notSubstring"),
  regexp: Symbol.for("regexp"),
  notRegexp: Symbol.for("notRegexp"),
  iRegexp: Symbol.for("iRegexp"),
  notIRegexp: Symbol.for("notIRegexp"),
  between: Symbol.for("between"),
  notBetween: Symbol.for("notBetween"),
  overlap: Symbol.for("overlap"),
  contains: Symbol.for("contains"),
  contained: Symbol.for("contained"),
  adjacent: Symbol.for("adjacent"),
  strictLeft: Symbol.for("strictLeft"),
  strictRight: Symbol.for("strictRight"),
  noExtendRight: Symbol.for("noExtendRight"),
  noExtendLeft: Symbol.for("noExtendLeft"),
  and: Symbol.for("and"),
  or: Symbol.for("or"),
  any: Symbol.for("any"),
  all: Symbol.for("all"),
  values: Symbol.for("values"),
  col: Symbol.for("col"),
  placeholder: Symbol.for("placeholder"),
  join: Symbol.for("join"),
  match: Symbol.for("match"),
  anyKeyExists: Symbol.for("anyKeyExists"),
  allKeysExist: Symbol.for("allKeysExist")
};
//# sourceMappingURL=operators.js.map
