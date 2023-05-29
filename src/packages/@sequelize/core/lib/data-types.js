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
  ABSTRACT: () => ABSTRACT,
  ARRAY: () => ARRAY,
  BIGINT: () => BIGINT,
  BLOB: () => BLOB,
  BOOLEAN: () => BOOLEAN,
  CHAR: () => CHAR,
  CIDR: () => CIDR,
  CITEXT: () => CITEXT,
  DATE: () => DATE,
  DATEONLY: () => DATEONLY,
  DECIMAL: () => DECIMAL,
  DOUBLE: () => DOUBLE,
  ENUM: () => ENUM,
  FLOAT: () => FLOAT,
  GEOGRAPHY: () => GEOGRAPHY,
  GEOMETRY: () => GEOMETRY,
  HSTORE: () => HSTORE,
  INET: () => INET,
  INTEGER: () => INTEGER,
  JSON: () => JSON,
  JSONB: () => JSONB,
  MACADDR: () => MACADDR,
  MEDIUMINT: () => MEDIUMINT,
  NOW: () => NOW,
  RANGE: () => RANGE,
  REAL: () => REAL,
  SMALLINT: () => SMALLINT,
  STRING: () => STRING,
  TEXT: () => TEXT,
  TIME: () => TIME,
  TINYINT: () => TINYINT,
  TSVECTOR: () => TSVECTOR,
  UUID: () => UUID,
  UUIDV1: () => UUIDV1,
  UUIDV4: () => UUIDV4,
  VIRTUAL: () => VIRTUAL
});
module.exports = __toCommonJS(data_types_exports);
var DataTypes = __toESM(require("./dialects/abstract/data-types.js"));
var import_class_to_invokable = require("./utils/class-to-invokable.js");
const ABSTRACT = DataTypes.AbstractDataType;
const STRING = (0, import_class_to_invokable.classToInvokable)(DataTypes.STRING);
const CHAR = (0, import_class_to_invokable.classToInvokable)(DataTypes.CHAR);
const TEXT = (0, import_class_to_invokable.classToInvokable)(DataTypes.TEXT);
const TINYINT = (0, import_class_to_invokable.classToInvokable)(DataTypes.TINYINT);
const SMALLINT = (0, import_class_to_invokable.classToInvokable)(DataTypes.SMALLINT);
const MEDIUMINT = (0, import_class_to_invokable.classToInvokable)(DataTypes.MEDIUMINT);
const INTEGER = (0, import_class_to_invokable.classToInvokable)(DataTypes.INTEGER);
const BIGINT = (0, import_class_to_invokable.classToInvokable)(DataTypes.BIGINT);
const FLOAT = (0, import_class_to_invokable.classToInvokable)(DataTypes.FLOAT);
const TIME = (0, import_class_to_invokable.classToInvokable)(DataTypes.TIME);
const DATE = (0, import_class_to_invokable.classToInvokable)(DataTypes.DATE);
const DATEONLY = (0, import_class_to_invokable.classToInvokable)(DataTypes.DATEONLY);
const BOOLEAN = (0, import_class_to_invokable.classToInvokable)(DataTypes.BOOLEAN);
const NOW = (0, import_class_to_invokable.classToInvokable)(DataTypes.NOW);
const BLOB = (0, import_class_to_invokable.classToInvokable)(DataTypes.BLOB);
const DECIMAL = (0, import_class_to_invokable.classToInvokable)(DataTypes.DECIMAL);
const UUID = (0, import_class_to_invokable.classToInvokable)(DataTypes.UUID);
const UUIDV1 = (0, import_class_to_invokable.classToInvokable)(DataTypes.UUIDV1);
const UUIDV4 = (0, import_class_to_invokable.classToInvokable)(DataTypes.UUIDV4);
const HSTORE = (0, import_class_to_invokable.classToInvokable)(DataTypes.HSTORE);
const JSON = (0, import_class_to_invokable.classToInvokable)(DataTypes.JSON);
const JSONB = (0, import_class_to_invokable.classToInvokable)(DataTypes.JSONB);
const VIRTUAL = (0, import_class_to_invokable.classToInvokable)(DataTypes.VIRTUAL);
const ARRAY = (0, import_class_to_invokable.classToInvokable)(DataTypes.ARRAY);
const ENUM = (0, import_class_to_invokable.classToInvokable)(DataTypes.ENUM);
const RANGE = (0, import_class_to_invokable.classToInvokable)(DataTypes.RANGE);
const REAL = (0, import_class_to_invokable.classToInvokable)(DataTypes.REAL);
const DOUBLE = (0, import_class_to_invokable.classToInvokable)(DataTypes.DOUBLE);
const GEOMETRY = (0, import_class_to_invokable.classToInvokable)(DataTypes.GEOMETRY);
const GEOGRAPHY = (0, import_class_to_invokable.classToInvokable)(DataTypes.GEOGRAPHY);
const CIDR = (0, import_class_to_invokable.classToInvokable)(DataTypes.CIDR);
const INET = (0, import_class_to_invokable.classToInvokable)(DataTypes.INET);
const MACADDR = (0, import_class_to_invokable.classToInvokable)(DataTypes.MACADDR);
const CITEXT = (0, import_class_to_invokable.classToInvokable)(DataTypes.CITEXT);
const TSVECTOR = (0, import_class_to_invokable.classToInvokable)(DataTypes.TSVECTOR);
//# sourceMappingURL=data-types.js.map
