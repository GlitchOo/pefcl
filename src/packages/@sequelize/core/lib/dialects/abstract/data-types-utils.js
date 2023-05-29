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
var data_types_utils_exports = {};
__export(data_types_utils_exports, {
  attributeTypeToSql: () => attributeTypeToSql,
  cloneDataType: () => cloneDataType,
  dataTypeClassOrInstanceToInstance: () => dataTypeClassOrInstanceToInstance,
  getDataTypeParser: () => getDataTypeParser,
  isDataType: () => isDataType,
  isDataTypeClass: () => isDataTypeClass,
  normalizeDataType: () => normalizeDataType,
  throwUnsupportedDataType: () => throwUnsupportedDataType,
  validateDataType: () => validateDataType
});
module.exports = __toCommonJS(data_types_utils_exports);
var import_node_util = __toESM(require("node:util"));
var import_errors = require("../../errors/index.js");
var import_data_types = require("./data-types.js");
function isDataType(value) {
  return isDataTypeClass(value) || value instanceof import_data_types.AbstractDataType;
}
function isDataTypeClass(value) {
  return typeof value === "function" && value.prototype instanceof import_data_types.AbstractDataType;
}
function cloneDataType(value) {
  if (typeof value === "string") {
    return value;
  }
  return value.clone();
}
function normalizeDataType(Type, dialect) {
  if (typeof Type === "string") {
    return Type;
  }
  if (typeof Type !== "function" && !(Type instanceof import_data_types.AbstractDataType)) {
    throw new TypeError(`Expected type to be a string, a DataType class, or a DataType instance, but got ${import_node_util.default.inspect(Type)}.`);
  }
  const type = dataTypeClassOrInstanceToInstance(Type);
  return type.toDialectDataType(dialect);
}
function dataTypeClassOrInstanceToInstance(Type) {
  return typeof Type === "function" ? new Type() : Type;
}
function validateDataType(type, attributeName, modelInstance, value) {
  try {
    type.validate(value);
    return null;
  } catch (error) {
    if (!(error instanceof import_errors.ValidationErrorItem)) {
      throw new import_errors.BaseError(`Validation encountered an unexpected error while validating attribute ${attributeName}. (Note: If this error is intended, ${type.constructor.name}#validate must throw an instance of ValidationErrorItem instead)`, {
        cause: error
      });
    }
    error.path = attributeName;
    error.value = value;
    error.instance = modelInstance;
    error.validatorKey = `${type.constructor.getDataTypeId()} validator`;
    return error;
  }
}
function attributeTypeToSql(type, options) {
  if (typeof type === "string") {
    return type;
  }
  if (type instanceof import_data_types.AbstractDataType) {
    return type.toSql(options);
  }
  throw new Error("attributeTypeToSql received a type that is neither a string or an instance of AbstractDataType");
}
function getDataTypeParser(dialect, dataType) {
  const type = normalizeDataType(dataType, dialect);
  return (value) => {
    return type.parseDatabaseValue(value);
  };
}
function throwUnsupportedDataType(dialect, typeName) {
  throw new Error(`${dialect.name} does not support the ${typeName} data type.
See https://sequelize.org/docs/v7/other-topics/other-data-types/ for a list of supported data types.`);
}
//# sourceMappingURL=data-types-utils.js.map
