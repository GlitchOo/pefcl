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
  CHAR: () => CHAR,
  DATE: () => DATE,
  DECIMAL: () => DECIMAL,
  DOUBLE: () => DOUBLE,
  ENUM: () => ENUM,
  FLOAT: () => FLOAT,
  INTEGER: () => INTEGER,
  MEDIUMINT: () => MEDIUMINT,
  NOW: () => NOW,
  SMALLINT: () => SMALLINT,
  STRING: () => STRING,
  TEXT: () => TEXT,
  TINYINT: () => TINYINT,
  UUID: () => UUID
});
module.exports = __toCommonJS(data_types_exports);
var import_dayjs = __toESM(require("dayjs"));
var import_maxBy = __toESM(require("lodash/maxBy.js"));
var BaseTypes = __toESM(require("../abstract/data-types.js"));
function removeUnsupportedIntegerOptions(dataType, dialect) {
  if (dataType.options.length != null) {
    dialect.warnDataTypeIssue(`${dialect.name} does not support ${dataType.getDataTypeId()} with length specified. This options is ignored.`);
    delete dataType.options.length;
  }
}
class BLOB extends BaseTypes.BLOB {
  toSql() {
    if (this.options.length != null) {
      if (this.options.length.toLowerCase() === "tiny") {
        return "BLOB(255)";
      }
      if (this.options.length.toLowerCase() === "medium") {
        return "BLOB(16M)";
      }
      if (this.options.length.toLowerCase() === "long") {
        return "BLOB(2G)";
      }
      return `BLOB(${this.options.length})`;
    }
    return "BLOB(1M)";
  }
}
class STRING extends BaseTypes.STRING {
  toSql(options) {
    const length = this.options.length ?? 255;
    if (this.options.binary) {
      if (length <= 4e3) {
        return `VARCHAR(${length}) FOR BIT DATA`;
      }
      throw new Error(`${options.dialect.name} does not support the BINARY option for data types with a length greater than 4000.`);
    }
    if (length <= 4e3) {
      return `VARCHAR(${length})`;
    }
    return `CLOB(${length})`;
  }
}
class CHAR extends BaseTypes.CHAR {
  toSql() {
    if (this.options.binary) {
      return `CHAR(${this.options.length ?? 255}) FOR BIT DATA`;
    }
    return super.toSql();
  }
}
class TEXT extends BaseTypes.TEXT {
  toSql() {
    let len = 2147483647;
    if (typeof this.options.length === "string") {
      switch (this.options.length.toLowerCase()) {
        case "tiny":
          len = 2 ** 8;
          break;
        case "medium":
          len = 2 ** 24;
          break;
        case "long":
          len = 2147483647;
          break;
        default:
          throw new Error(`LENGTH value ${this.options.length} is not supported. Expected a number of one of the following strings: tiny, medium, long.`);
      }
    }
    if (len > 32672) {
      return `CLOB(${len})`;
    }
    return `VARCHAR(${len})`;
  }
}
class UUID extends BaseTypes.UUID {
  toSql() {
    return "CHAR(36) FOR BIT DATA";
  }
}
class NOW extends BaseTypes.NOW {
  toSql() {
    return "CURRENT TIME";
  }
}
class DATE extends BaseTypes.DATE {
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    if (this.options.precision != null && this.options.precision > 6) {
      this.options.precision = 6;
    }
  }
  toSql() {
    return `TIMESTAMP${this.options.precision != null ? `(${this.options.precision})` : ""}`;
  }
  toBindableValue(date) {
    date = (0, import_dayjs.default)(date).utc(false);
    return date.format("YYYY-MM-DD HH:mm:ss.SSS");
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
    return "SMALLINT";
  }
}
class SMALLINT extends BaseTypes.SMALLINT {
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    removeUnsupportedIntegerOptions(this, dialect);
  }
  // TODO: add >= 0 =< 2^16-1 check when the unsigned option is true
  toSql() {
    if (this.options.unsigned) {
      return "INTEGER";
    }
    return "SMALLINT";
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
  getNumberSqlTypeName() {
    return "DOUBLE";
  }
}
class DECIMAL extends BaseTypes.DECIMAL {
  // TODO: add check constraint >= 0 if unsigned is true
}
class ENUM extends BaseTypes.ENUM {
  toSql() {
    var _a;
    const minLength = ((_a = (0, import_maxBy.default)(this.options.values, (value) => value.length)) == null ? void 0 : _a.length) ?? 0;
    return `VARCHAR(${Math.max(minLength, 255)})`;
  }
}
//# sourceMappingURL=data-types.js.map
