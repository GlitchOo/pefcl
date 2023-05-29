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
var data_types_exports = {};
__export(data_types_exports, {
  BIGINT: () => import_data_types.BIGINT,
  BLOB: () => import_data_types.BLOB,
  BOOLEAN: () => BOOLEAN,
  CHAR: () => import_data_types.CHAR,
  DATE: () => import_data_types.DATE,
  DECIMAL: () => import_data_types.DECIMAL,
  DOUBLE: () => import_data_types.DOUBLE,
  ENUM: () => import_data_types.ENUM,
  FLOAT: () => import_data_types.FLOAT,
  INTEGER: () => import_data_types.INTEGER,
  MEDIUMINT: () => import_data_types.MEDIUMINT,
  SMALLINT: () => import_data_types.SMALLINT,
  STRING: () => import_data_types.STRING,
  TEXT: () => import_data_types.TEXT,
  TINYINT: () => import_data_types.TINYINT,
  UUID: () => UUID
});
module.exports = __toCommonJS(data_types_exports);
var BaseTypes = __toESM(require("../abstract/data-types.js"));
var import_data_types = require("../db2/data-types.js");
class UUID extends BaseTypes.UUID {
  toSql() {
    return "CHAR(36)";
  }
}
class BOOLEAN extends BaseTypes.BOOLEAN {
  escape(value) {
    return value ? "1" : "0";
  }
  toBindableValue(value) {
    return value ? 1 : 0;
  }
  toSql() {
    return "SMALLINT";
  }
}
//# sourceMappingURL=data-types.js.map
