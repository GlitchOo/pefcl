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
  BOOLEAN: () => BOOLEAN,
  DATE: () => DATE,
  DECIMAL: () => DECIMAL,
  DOUBLE: () => DOUBLE,
  ENUM: () => ENUM,
  FLOAT: () => FLOAT,
  GEOMETRY: () => GEOMETRY,
  INTEGER: () => INTEGER,
  MEDIUMINT: () => MEDIUMINT,
  REAL: () => REAL,
  SMALLINT: () => SMALLINT,
  TINYINT: () => TINYINT,
  UUID: () => UUID
});
module.exports = __toCommonJS(data_types_exports);
var import_dayjs = __toESM(require("dayjs"));
var import_wkx = __toESM(require("wkx"));
var import_check = require("../../utils/check.js");
var import_dayjs2 = require("../../utils/dayjs");
var BaseTypes = __toESM(require("../abstract/data-types.js"));
class FLOAT extends BaseTypes.FLOAT {
  getNumberSqlTypeName() {
    return "FLOAT";
  }
  _supportsNativeUnsigned() {
    return true;
  }
}
class DOUBLE extends BaseTypes.DOUBLE {
  getNumberSqlTypeName() {
    return "DOUBLE PRECISION";
  }
  _supportsNativeUnsigned() {
    return true;
  }
}
class REAL extends BaseTypes.REAL {
  _supportsNativeUnsigned() {
    return true;
  }
}
class DECIMAL extends BaseTypes.DECIMAL {
  _supportsNativeUnsigned() {
    return true;
  }
}
class TINYINT extends BaseTypes.TINYINT {
  _supportsNativeUnsigned() {
    return true;
  }
}
class SMALLINT extends BaseTypes.SMALLINT {
  _supportsNativeUnsigned() {
    return true;
  }
}
class MEDIUMINT extends BaseTypes.MEDIUMINT {
  _supportsNativeUnsigned() {
    return true;
  }
}
class INTEGER extends BaseTypes.INTEGER {
  _supportsNativeUnsigned() {
    return true;
  }
}
class BIGINT extends BaseTypes.BIGINT {
  _supportsNativeUnsigned() {
    return true;
  }
}
class BOOLEAN extends BaseTypes.BOOLEAN {
  toSql() {
    return "TINYINT(1)";
  }
  escape(value) {
    return value ? "true" : "false";
  }
  toBindableValue(value) {
    return value ? 1 : 0;
  }
}
class DATE extends BaseTypes.DATE {
  toBindableValue(date, options) {
    date = this._applyTimezone(date, options);
    return date.format("YYYY-MM-DD HH:mm:ss.SSS");
  }
  sanitize(value, options) {
    if ((0, import_check.isString)(value) && (options == null ? void 0 : options.timezone)) {
      if ((0, import_dayjs2.isValidTimeZone)(options.timezone)) {
        return import_dayjs.default.tz(value, options.timezone).toDate();
      }
      return /* @__PURE__ */ new Date(`${value} ${options.timezone}`);
    }
    return super.sanitize(value);
  }
}
class UUID extends BaseTypes.UUID {
  // TODO: add check constraint to enforce GUID format
  toSql() {
    return "CHAR(36) BINARY";
  }
}
class GEOMETRY extends BaseTypes.GEOMETRY {
  toBindableValue(value, options) {
    return `ST_GeomFromText(${options.dialect.escapeString(
      import_wkx.default.Geometry.parseGeoJSON(value).toWkt()
    )})`;
  }
  getBindParamSql(value, options) {
    return `ST_GeomFromText(${options.bindParam(
      import_wkx.default.Geometry.parseGeoJSON(value).toWkt()
    )})`;
  }
  toSql() {
    var _a;
    return ((_a = this.options.type) == null ? void 0 : _a.toUpperCase()) || "GEOMETRY";
  }
}
class ENUM extends BaseTypes.ENUM {
  toSql(options) {
    return `ENUM(${this.options.values.map((value) => options.dialect.escapeString(value)).join(", ")})`;
  }
}
//# sourceMappingURL=data-types.js.map
