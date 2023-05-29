"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var query_generator_typescript_exports = {};
__export(query_generator_typescript_exports, {
  SnowflakeQueryGeneratorTypeScript: () => SnowflakeQueryGeneratorTypeScript
});
module.exports = __toCommonJS(query_generator_typescript_exports);
var import_query_generator = require("../abstract/query-generator");
class SnowflakeQueryGeneratorTypeScript extends import_query_generator.AbstractQueryGenerator {
  describeTableQuery(tableName) {
    return `SHOW FULL COLUMNS FROM ${this.quoteTable(tableName)};`;
  }
  showIndexesQuery() {
    return `SELECT '' FROM DUAL`;
  }
}
//# sourceMappingURL=query-generator-typescript.js.map
