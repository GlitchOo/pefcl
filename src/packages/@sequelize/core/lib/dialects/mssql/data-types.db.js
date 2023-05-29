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
var data_types_db_exports = {};
__export(data_types_db_exports, {
  registerMsSqlDbDataTypeParsers: () => registerMsSqlDbDataTypeParsers
});
module.exports = __toCommonJS(data_types_db_exports);
var import_dayjs = __toESM(require("dayjs"));
function registerMsSqlDbDataTypeParsers(dialect) {
  dialect.registerDataTypeParser(["GUIDN"], (value) => {
    if (typeof value !== "string") {
      return value;
    }
    return value.toLowerCase();
  });
  dialect.registerDataTypeParser(["TIMEN"], (value) => {
    if (value instanceof Date) {
      return import_dayjs.default.utc(value).format("HH:mm:ss.SSS");
    }
    return value;
  });
  dialect.registerDataTypeParser(["DATETIMEOFFSETN"], (value) => {
    if (value instanceof Date) {
      return import_dayjs.default.utc(value).format("YYYY-MM-DD HH:mm:ss.SSS+00");
    }
    return value;
  });
  dialect.registerDataTypeParser(["DATEN"], (value) => {
    if (value instanceof Date) {
      return import_dayjs.default.utc(value).format("YYYY-MM-DD");
    }
    return value;
  });
  dialect.registerDataTypeParser(["DECIMAL", "DECIMALN"], (value) => {
    return String(value);
  });
}
//# sourceMappingURL=data-types.db.js.map
