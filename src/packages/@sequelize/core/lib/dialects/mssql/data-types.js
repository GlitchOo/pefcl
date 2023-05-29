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
  DATE: () => DATE,
  DECIMAL: () => DECIMAL,
  DOUBLE: () => DOUBLE,
  ENUM: () => ENUM,
  FLOAT: () => FLOAT,
  INTEGER: () => INTEGER,
  JSON: () => JSON,
  MEDIUMINT: () => MEDIUMINT,
  NOW: () => NOW,
  SMALLINT: () => SMALLINT,
  STRING: () => STRING,
  TEXT: () => TEXT,
  TINYINT: () => TINYINT,
  UUID: () => UUID
});
module.exports = __toCommonJS(data_types_exports);
var import_node_util = __toESM(require("node:util"));
var import_maxBy = __toESM(require("lodash/maxBy"));
var import_errors = require("../../errors/index.js");
var BaseTypes = __toESM(require("../abstract/data-types.js"));
function removeUnsupportedIntegerOptions(dataType, dialect) {
  if (dataType.options.length != null) {
    dialect.warnDataTypeIssue(`${dialect.name} does not support '${dataType.constructor.name}' with length specified. This options is ignored.`);
    delete dataType.options.length;
  }
}
class BLOB extends BaseTypes.BLOB {
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    if (this.options.length != null && this.options.length.toLowerCase() !== "tiny") {
      dialect.warnDataTypeIssue(`${dialect.name}: ${this.getDataTypeId()} cannot limit its size beyond length=tiny. This option is ignored, in favor of the highest size possible.`);
    }
  }
  toSql() {
    if (this.options.length && this.options.length.toLowerCase() === "tiny") {
      return "VARBINARY(256)";
    }
    return "VARBINARY(MAX)";
  }
}
class STRING extends BaseTypes.STRING {
  toSql() {
    return `NVARCHAR(${this.options.length ?? 255})`;
  }
}
class TEXT extends BaseTypes.TEXT {
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    if (this.options.length != null && this.options.length.toLowerCase() !== "tiny") {
      dialect.warnDataTypeIssue(`${dialect.name}: ${this.getDataTypeId()} cannot limit its size beyond length=tiny. This option is ignored, in favor of the highest size possible.`);
    }
  }
  toSql() {
    if (this.options.length && this.options.length.toLowerCase() === "tiny") {
      return "NVARCHAR(256)";
    }
    return "NVARCHAR(MAX)";
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
    return "BIT";
  }
}
class UUID extends BaseTypes.UUID {
  toSql() {
    return "UNIQUEIDENTIFIER";
  }
}
class NOW extends BaseTypes.NOW {
  toSql() {
    return "GETDATE()";
  }
}
class DATE extends BaseTypes.DATE {
  toSql() {
    if (this.options.precision != null) {
      return `DATETIMEOFFSET(${this.options.precision})`;
    }
    return "DATETIMEOFFSET";
  }
}
class TINYINT extends BaseTypes.TINYINT {
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    removeUnsupportedIntegerOptions(this, dialect);
  }
  // TODO: add check constraint between -128 & 127 inclusive when the unsigned option is false
  toSql() {
    if (!this.options.unsigned) {
      return "SMALLINT";
    }
    return "TINYINT";
  }
}
class SMALLINT extends BaseTypes.SMALLINT {
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    removeUnsupportedIntegerOptions(this, dialect);
  }
  // TODO: add check constraint between 0 & 65535 inclusive when the unsigned option is true
  toSql() {
    if (this.options.unsigned) {
      return "INT";
    }
    return "SMALLINT";
  }
}
class MEDIUMINT extends BaseTypes.MEDIUMINT {
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    removeUnsupportedIntegerOptions(this, dialect);
  }
  // TODO: unsigned: add check constraint between 0 & 16777215 inclusive
  // TODO: signed: add check constraint between -8388608 & 8388607 inclusive
  toSql() {
    return "INTEGER";
  }
}
class INTEGER extends BaseTypes.INTEGER {
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    removeUnsupportedIntegerOptions(this, dialect);
  }
  // TODO:add check constraint between 0 & 4294967295 inclusive when the unsigned option is true
  toSql() {
    if (this.options.unsigned) {
      return "BIGINT";
    }
    return "INTEGER";
  }
}
class BIGINT extends BaseTypes.BIGINT {
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    removeUnsupportedIntegerOptions(this, dialect);
  }
}
class FLOAT extends BaseTypes.FLOAT {
  // TODO: add check constraint >= 0 if unsigned is true
  getNumberSqlTypeName() {
    return "REAL";
  }
}
class DOUBLE extends BaseTypes.DOUBLE {
  // TODO: add check constraint >= 0 if unsigned is true
}
class DECIMAL extends BaseTypes.DECIMAL {
  // TODO: add check constraint >= 0 if unsigned is true
}
class JSON extends BaseTypes.JSON {
  // TODO: add constraint
  //  https://learn.microsoft.com/en-us/sql/t-sql/functions/isjson-transact-sql?view=sql-server-ver16
  toBindableValue(value) {
    return globalThis.JSON.stringify(value);
  }
  parseDatabaseValue(value) {
    if (typeof value !== "string") {
      throw new import_errors.BaseError(`DataTypes.JSON received a non-string value from the database, which it cannot parse: ${import_node_util.default.inspect(value)}.`);
    }
    try {
      return globalThis.JSON.parse(value);
    } catch (error) {
      throw new import_errors.BaseError(`DataTypes.JSON received a value from the database that it not valid JSON: ${import_node_util.default.inspect(value)}.`, { cause: error });
    }
  }
  toSql() {
    return "NVARCHAR(MAX)";
  }
}
class ENUM extends BaseTypes.ENUM {
  // TODO: add constraint
  toSql() {
    var _a;
    const minLength = ((_a = (0, import_maxBy.default)(this.options.values, (value) => value.length)) == null ? void 0 : _a.length) ?? 0;
    return `NVARCHAR(${Math.max(minLength, 255)})`;
  }
}
//# sourceMappingURL=data-types.js.map
