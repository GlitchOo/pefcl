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
  BIGINT: () => BIGINT,
  BLOB: () => BLOB,
  BOOLEAN: () => BOOLEAN,
  CITEXT: () => CITEXT,
  DATE: () => DATE,
  DATEONLY: () => DATEONLY,
  DOUBLE: () => DOUBLE,
  ENUM: () => ENUM,
  FLOAT: () => FLOAT,
  INTEGER: () => INTEGER,
  JSON: () => JSON,
  MEDIUMINT: () => MEDIUMINT,
  REAL: () => REAL,
  SMALLINT: () => SMALLINT,
  STRING: () => STRING,
  TEXT: () => TEXT,
  TIME: () => TIME,
  TINYINT: () => TINYINT,
  UUID: () => UUID
});
module.exports = __toCommonJS(data_types_exports);
var import_node_util = __toESM(require("node:util"));
var import_errors = require("../../errors/index.js");
var BaseTypes = __toESM(require("../abstract/data-types.js"));
function removeUnsupportedIntegerOptions(dataType, dialect) {
  if (dataType.options.length != null) {
    dialect.warnDataTypeIssue(`${dialect.name} does not support '${dataType.getDataTypeId()}' with length. This option will be ignored.`);
    delete dataType.options.length;
  }
}
function removeUnsupportedDecimalNumberOptions(dataType, dialect) {
  if (dataType.options.scale != null || dataType.options.precision != null) {
    dialect.warnDataTypeIssue(`${dialect.name} does not support '${dataType.getDataTypeId()}' with "scale" or "precision" specified. These options will be ignored.`);
    dataType.options.scale = void 0;
    dataType.options.precision = void 0;
  }
}
class BOOLEAN extends BaseTypes.BOOLEAN {
  // Note: the BOOLEAN type is SQLite maps to NUMERIC, but we still use BOOLEAN because introspecting the table
  // still indicates that the column is a BOOLEAN column - which we may be able to exploit in the future to parse the value
  // in raw queries where the DataType is not available.
  escape(value) {
    return value ? "1" : "0";
  }
  toBindableValue(value) {
    return value ? 1 : 0;
  }
  toSql() {
    return "INTEGER";
  }
}
class STRING extends BaseTypes.STRING {
  // TODO: add length check constraint
  //  check(length(col) <= 5))
  toSql() {
    if (this.options.binary) {
      return `TEXT COLLATE BINARY`;
    }
    return "TEXT";
  }
}
class TEXT extends BaseTypes.TEXT {
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    if (this.options.length) {
      dialect.warnDataTypeIssue(`${dialect.name} does not support TEXT with options. Plain 'TEXT' will be used instead.`);
      this.options.length = void 0;
    }
  }
}
class CITEXT extends BaseTypes.CITEXT {
  toSql() {
    return "TEXT COLLATE NOCASE";
  }
}
class TINYINT extends BaseTypes.TINYINT {
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    removeUnsupportedIntegerOptions(this, dialect);
  }
  // TODO: add >= 0 =< 2^8-1 check when the unsigned option is true
  // TODO: add >= -2^7 =< 2^7-1 check when the unsigned option is false
  toSql() {
    return "INTEGER";
  }
}
class SMALLINT extends BaseTypes.SMALLINT {
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    removeUnsupportedIntegerOptions(this, dialect);
  }
  // TODO: add >= 0 =< 2^16-1 check when the unsigned option is true
  // TODO: add >= -2^15 =< 2^15-1 check when the unsigned option is false
  toSql() {
    return "INTEGER";
  }
}
class MEDIUMINT extends BaseTypes.MEDIUMINT {
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    removeUnsupportedIntegerOptions(this, dialect);
  }
  // TODO: add >= 0 =< 2^24-1 check when the unsigned option is true
  // TODO: add >= -2^23 =< 2^23-1 check when the unsigned option is false
  toSql() {
    return "INTEGER";
  }
}
class INTEGER extends BaseTypes.INTEGER {
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    removeUnsupportedIntegerOptions(this, dialect);
  }
  // TODO: add >= 0 =< 2^32-1 check when the unsigned option is true
  // TODO: add >= -2^31 =< 2^31-1 check when the unsigned option is false
  toSql() {
    return "INTEGER";
  }
}
class BIGINT extends BaseTypes.BIGINT {
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    removeUnsupportedIntegerOptions(this, dialect);
  }
  toSql() {
    return "INTEGER";
  }
}
class FLOAT extends BaseTypes.FLOAT {
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    removeUnsupportedDecimalNumberOptions(this, dialect);
    dialect.warnDataTypeIssue(`${dialect.name} does not support single-precision floating point numbers. SQLite's REAL type will be used instead, which in SQLite is a double-precision floating point type.`);
  }
  // TODO: add check constraint >= 0 if unsigned is true
  getNumberSqlTypeName() {
    return "REAL";
  }
}
class DOUBLE extends BaseTypes.DOUBLE {
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    removeUnsupportedDecimalNumberOptions(this, dialect);
  }
  // TODO: add check constraint >= 0 if unsigned is true
  getNumberSqlTypeName() {
    return "REAL";
  }
}
class REAL extends BaseTypes.REAL {
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    removeUnsupportedDecimalNumberOptions(this, dialect);
  }
  getNumberSqlTypeName() {
    return "REAL";
  }
}
class TIME extends BaseTypes.TIME {
  // TODO: add CHECK constraint
  //  https://github.com/sequelize/sequelize/pull/14505#issuecomment-1259279743
  toSql() {
    return "TEXT";
  }
}
class DATE extends BaseTypes.DATE {
  // TODO: add CHECK constraint
  //  https://github.com/sequelize/sequelize/pull/14505#issuecomment-1259279743
  toSql() {
    return "TEXT";
  }
}
class DATEONLY extends BaseTypes.DATEONLY {
  // TODO: add CHECK constraint
  //  https://github.com/sequelize/sequelize/pull/14505#issuecomment-1259279743
  toSql() {
    return "TEXT";
  }
}
class BLOB extends BaseTypes.BLOB {
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    if (this.options.length) {
      dialect.warnDataTypeIssue(`${dialect.name} does not support '${this.getDataTypeId()}' with length. This option will be ignored.`);
      delete this.options.length;
    }
  }
  toSql() {
    return "BLOB";
  }
}
class JSON extends BaseTypes.JSON {
  toBindableValue(value) {
    return globalThis.JSON.stringify(value);
  }
  parseDatabaseValue(value) {
    if (typeof value === "number") {
      return value;
    }
    if (typeof value !== "string") {
      throw new Error(`DataTypes.JSON received a non-string value from the database, which it cannot parse: ${import_node_util.default.inspect(value)}.`);
    }
    try {
      return globalThis.JSON.parse(value);
    } catch (error) {
      throw new import_errors.BaseError(`DataTypes.JSON received a value from the database that it not valid JSON: ${import_node_util.default.inspect(value)}.`, { cause: error });
    }
  }
  // TODO: add check constraint
  //  https://www.sqlite.org/json1.html#jvalid
  toSql() {
    return "TEXT";
  }
}
class UUID extends BaseTypes.UUID {
  // TODO: add check constraint to enforce GUID format
  toSql() {
    return "TEXT";
  }
}
class ENUM extends BaseTypes.ENUM {
  // TODO: add check constraint to enforce list of accepted values
  toSql() {
    return "TEXT";
  }
}
//# sourceMappingURL=data-types.js.map
