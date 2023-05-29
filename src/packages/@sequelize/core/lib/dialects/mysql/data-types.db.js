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
  registerMySqlDbDataTypeParsers: () => registerMySqlDbDataTypeParsers
});
module.exports = __toCommonJS(data_types_db_exports);
var import_dayjs = __toESM(require("dayjs"));
var import_wkx = __toESM(require("wkx"));
var import_dayjs2 = require("../../utils/dayjs.js");
function registerMySqlDbDataTypeParsers(dialect) {
  dialect.registerDataTypeParser(["DATETIME"], (value) => {
    const valueStr = value.string();
    if (valueStr === null) {
      return null;
    }
    const timeZone = dialect.sequelize.options.timezone;
    if (timeZone === "+00:00") {
      return `${valueStr}+00`;
    }
    if ((0, import_dayjs2.isValidTimeZone)(timeZone)) {
      return import_dayjs.default.tz(valueStr, timeZone).toISOString();
    }
    return valueStr + timeZone;
  });
  dialect.registerDataTypeParser(["DATE"], (value) => {
    return value.string();
  });
  dialect.registerDataTypeParser(["LONGLONG"], (value) => {
    return value.string();
  });
  dialect.registerDataTypeParser(["GEOMETRY"], (value) => {
    let buffer = value.buffer();
    if (!buffer || buffer.length === 0) {
      return null;
    }
    buffer = buffer.slice(4);
    return import_wkx.default.Geometry.parse(buffer).toGeoJSON({ shortCrs: true });
  });
}
//# sourceMappingURL=data-types.db.js.map
