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
  DATE: () => DATE,
  DOUBLE: () => DOUBLE,
  ENUM: () => ENUM,
  FLOAT: () => FLOAT,
  INTEGER: () => INTEGER,
  JSON: () => JSON,
  MEDIUMINT: () => MEDIUMINT,
  REAL: () => REAL,
  SMALLINT: () => SMALLINT,
  TEXT: () => TEXT,
  TINYINT: () => TINYINT,
  UUID: () => UUID
});
module.exports = __toCommonJS(data_types_exports);
var import_maxBy = __toESM(require("lodash/maxBy.js"));
var BaseTypes = __toESM(require("../abstract/data-types.js"));
class DATE extends BaseTypes.DATE {
  toSql() {
    return `TIMESTAMP${this.options.precision != null ? `(${this.options.precision})` : ""}`;
  }
  toBindableValue(date, options) {
    date = this._applyTimezone(date, options);
    return date.format("YYYY-MM-DD HH:mm:ss.SSS");
  }
}
class UUID extends BaseTypes.UUID {
  toSql() {
    return "VARCHAR(36)";
  }
}
class ENUM extends BaseTypes.ENUM {
  toSql() {
    var _a;
    const minLength = ((_a = (0, import_maxBy.default)(this.options.values, (value) => value.length)) == null ? void 0 : _a.length) ?? 0;
    return `VARCHAR(${Math.max(minLength, 255)})`;
  }
}
class TEXT extends BaseTypes.TEXT {
  toSql() {
    return "TEXT";
  }
}
class JSON extends BaseTypes.JSON {
  escape(value, options) {
    return options.operation === "where" && typeof value === "string" ? value : globalThis.JSON.stringify(value);
  }
}
class REAL extends BaseTypes.REAL {
  toSql() {
    return "REAL";
  }
}
class FLOAT extends BaseTypes.FLOAT {
  // TODO: warn that FLOAT is not supported in Snowflake, only DOUBLE is
  toSql() {
    return "FLOAT";
  }
}
class DOUBLE extends BaseTypes.DOUBLE {
  toSql() {
    return "FLOAT";
  }
}
class TINYINT extends BaseTypes.TINYINT {
  toSql() {
    return "INTEGER";
  }
}
class SMALLINT extends BaseTypes.SMALLINT {
  toSql() {
    return "INTEGER";
  }
}
class MEDIUMINT extends BaseTypes.MEDIUMINT {
  toSql() {
    return "INTEGER";
  }
}
class INTEGER extends BaseTypes.INTEGER {
  toSql() {
    return "INTEGER";
  }
}
class BIGINT extends BaseTypes.BIGINT {
  // not really true, but snowflake allows INT values up to 99999999999999999999999999999999999999,
  // which is more than enough to cover a 64-bit unsigned integer (0 - 18446744073709551615)
  _supportsNativeUnsigned(_dialect) {
    return true;
  }
  toSql() {
    return "INTEGER";
  }
}
//# sourceMappingURL=data-types.js.map
