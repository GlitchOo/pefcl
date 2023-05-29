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
var check_exports = {};
__export(check_exports, {
  assertCaughtError: () => assertCaughtError,
  assertIsErrorWithStringCode: () => assertIsErrorWithStringCode,
  buildInvalidOptionReceivedError: () => buildInvalidOptionReceivedError,
  canTreatArrayAsAnd: () => canTreatArrayAsAnd,
  isColString: () => isColString,
  isError: () => isError,
  isErrorWithStringCode: () => isErrorWithStringCode,
  isNodeError: () => isNodeError,
  isNullish: () => isNullish,
  isPlainObject: () => isPlainObject,
  isString: () => isString,
  rejectInvalidOptions: () => rejectInvalidOptions
});
module.exports = __toCommonJS(check_exports);
var import_pickBy = __toESM(require("lodash/pickBy"));
var import_errors = require("../errors/index.js");
var import_sequelize_method = require("./sequelize-method");
function isNullish(val) {
  return val == null;
}
function isNodeError(val) {
  return val instanceof Error && "code" in val;
}
function isErrorWithStringCode(val) {
  return val instanceof Error && typeof val.code === "string";
}
function assertIsErrorWithStringCode(val) {
  if (!isErrorWithStringCode(val)) {
    throw new Error('Expected Error with string "code" property');
  }
}
function isError(val) {
  return val instanceof Error;
}
function assertCaughtError(val) {
  if (!isError(val)) {
    throw new import_errors.BaseError("A non-error value was thrown", { cause: val });
  }
}
function isString(val) {
  return typeof val === "string";
}
function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}
function isColString(value) {
  return typeof value === "string" && value.startsWith("$") && value.endsWith("$");
}
function canTreatArrayAsAnd(arr) {
  return arr.some((arg) => isPlainObject(arg) || arg instanceof import_sequelize_method.Where);
}
function rejectInvalidOptions(methodName, dialectName, allSupportableOptions, supportedOptions, receivedOptions) {
  const receivedOptionNames = Object.keys((0, import_pickBy.default)(receivedOptions));
  const unsupportedOptions = receivedOptionNames.filter((optionName) => {
    return allSupportableOptions.has(optionName) && !supportedOptions.has(optionName);
  });
  if (unsupportedOptions.length > 0) {
    throw buildInvalidOptionReceivedError(methodName, dialectName, unsupportedOptions);
  }
}
function buildInvalidOptionReceivedError(methodName, dialectName, invalidOptions) {
  return new Error(`The following options are not supported by ${methodName} in ${dialectName}: ${invalidOptions.join(", ")}`);
}
//# sourceMappingURL=check.js.map
