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
var query_builder_utils_exports = {};
__export(query_builder_utils_exports, {
  defaultValueSchemable: () => defaultValueSchemable,
  isWhereEmpty: () => isWhereEmpty
});
module.exports = __toCommonJS(query_builder_utils_exports);
var import_isEmpty = __toESM(require("lodash/isEmpty.js"));
var DataTypes = __toESM(require("../data-types"));
var import_format = require("./format.js");
function defaultValueSchemable(value) {
  if (value === void 0) {
    return false;
  }
  if (value instanceof DataTypes.NOW) {
    return false;
  }
  if (value instanceof DataTypes.UUIDV1 || value instanceof DataTypes.UUIDV4) {
    return false;
  }
  return typeof value !== "function";
}
function isWhereEmpty(obj) {
  return Boolean(obj) && (0, import_isEmpty.default)(obj) && (0, import_format.getOperators)(obj).length === 0;
}
//# sourceMappingURL=query-builder-utils.js.map
