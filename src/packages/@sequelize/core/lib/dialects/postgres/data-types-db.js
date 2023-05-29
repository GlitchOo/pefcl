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
  registerPostgresDbDataTypeParsers: () => registerPostgresDbDataTypeParsers
});
module.exports = __toCommonJS(data_types_db_exports);
var import_node_assert = __toESM(require("node:assert"));
var import_identity = __toESM(require("lodash/identity"));
var import_wkx = __toESM(require("wkx"));
var import_data_types_utils = require("../abstract/data-types-utils.js");
var BaseTypes = __toESM(require("../abstract/data-types.js"));
var Hstore = __toESM(require("./hstore.js"));
var import_range = require("./range.js");
function registerPostgresDbDataTypeParsers(dialect) {
  dialect.registerDataTypeParser(["date"], (value) => {
    if (value === "infinity") {
      return Number.POSITIVE_INFINITY;
    }
    if (value === "-infinity") {
      return Number.NEGATIVE_INFINITY;
    }
    return value;
  });
  dialect.registerDataTypeParser(["timestamptz", "timestamp"], (value) => {
    return value;
  });
  dialect.registerDataTypeParser(["numeric", "decimal"], (value) => {
    if (value === "NaN") {
      return Number.NaN;
    }
    return value;
  });
  dialect.registerDataTypeParser(["geometry"], (value) => {
    (0, import_node_assert.default)(typeof value === "string", "Expected geometry value to be a string");
    const b = Buffer.from(value, "hex");
    return import_wkx.default.Geometry.parse(b).toGeoJSON({ shortCrs: true });
  });
  dialect.registerDataTypeParser(["geography"], (value) => {
    (0, import_node_assert.default)(typeof value === "string", "Expected geography value to be a string");
    const b = Buffer.from(value, "hex");
    return import_wkx.default.Geometry.parse(b).toGeoJSON({ shortCrs: true });
  });
  dialect.registerDataTypeParser(["hstore"], (value) => {
    (0, import_node_assert.default)(typeof value === "string", "Expected hstore value to be a string");
    return Hstore.parse(value);
  });
  const parseInteger = (0, import_data_types_utils.getDataTypeParser)(dialect, BaseTypes.INTEGER);
  dialect.registerDataTypeParser(["int4range"], (0, import_range.buildRangeParser)(parseInteger));
  const parseBigInt = (0, import_data_types_utils.getDataTypeParser)(dialect, BaseTypes.BIGINT);
  dialect.registerDataTypeParser(["int8range"], (0, import_range.buildRangeParser)(parseBigInt));
  const parseDecimal = (0, import_data_types_utils.getDataTypeParser)(dialect, BaseTypes.DECIMAL);
  dialect.registerDataTypeParser(["numrange"], (0, import_range.buildRangeParser)(parseDecimal));
  dialect.registerDataTypeParser(["tstzrange", "tsrange", "daterange"], (0, import_range.buildRangeParser)(import_identity.default));
}
//# sourceMappingURL=data-types-db.js.map
