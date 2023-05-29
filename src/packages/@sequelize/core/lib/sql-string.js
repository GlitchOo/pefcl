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
var sql_string_exports = {};
__export(sql_string_exports, {
  escape: () => escape,
  getTextDataTypeForDialect: () => getTextDataTypeForDialect
});
module.exports = __toCommonJS(sql_string_exports);
var DataTypes = __toESM(require("./data-types"));
var import_logger = require("./utils/logger");
function arrayToList(array, timeZone, dialect, format) {
  return array.reduce((sql, val, i) => {
    if (i !== 0) {
      sql += ", ";
    }
    if (Array.isArray(val)) {
      sql += `(${arrayToList(val, timeZone, dialect, format)})`;
    } else {
      sql += escape(val, timeZone, dialect, format);
    }
    return sql;
  }, "");
}
const textDataTypeMap = /* @__PURE__ */ new Map();
function getTextDataTypeForDialect(dialect) {
  let type = textDataTypeMap.get(dialect.name);
  if (type == null) {
    type = new DataTypes.STRING().toDialectDataType(dialect);
    textDataTypeMap.set(dialect.name, type);
  }
  return type;
}
function bestGuessDataTypeOfVal(val, dialect) {
  switch (typeof val) {
    case "bigint":
      return new DataTypes.BIGINT().toDialectDataType(dialect);
    case "number": {
      if (Number.isSafeInteger(val)) {
        return new DataTypes.INTEGER().toDialectDataType(dialect);
      }
      return new DataTypes.REAL().toDialectDataType(dialect);
    }
    case "boolean":
      return new DataTypes.BOOLEAN().toDialectDataType(dialect);
    case "object":
      if (Array.isArray(val)) {
        if (val.length === 0) {
          throw new Error(`Could not guess type of value ${import_logger.logger.inspect(val)} because it is an empty array`);
        }
        return new DataTypes.ARRAY(bestGuessDataTypeOfVal(val[0], dialect)).toDialectDataType(dialect);
      }
      if (val instanceof Date) {
        return new DataTypes.DATE().toDialectDataType(dialect);
      }
      if (Buffer.isBuffer(val)) {
        if (dialect.name === "ibmi") {
          return new DataTypes.STRING().toDialectDataType(dialect);
        }
        return new DataTypes.BLOB().toDialectDataType(dialect);
      }
      break;
    case "string":
      return getTextDataTypeForDialect(dialect);
    default:
  }
  throw new TypeError(`Could not guess type of value ${import_logger.logger.inspect(val)}`);
}
function escape(val, timeZone, dialect, format = false) {
  const dialectName = dialect.name;
  if (val == null) {
    if (dialectName === "ibmi" && format) {
      return "cast(NULL as int)";
    }
    return "NULL";
  }
  if (Array.isArray(val) && (dialectName !== "postgres" || format)) {
    return arrayToList(val, timeZone, dialect, format);
  }
  const dataType = bestGuessDataTypeOfVal(val, dialect);
  return dataType.escape(val, {
    dialect,
    timezone: timeZone
  });
}
//# sourceMappingURL=sql-string.js.map
