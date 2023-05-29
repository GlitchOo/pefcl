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
  Db2QueryGeneratorTypeScript: () => Db2QueryGeneratorTypeScript
});
module.exports = __toCommonJS(query_generator_typescript_exports);
var import_check = require("../../utils/check");
var import_join_sql_fragments = require("../../utils/join-sql-fragments");
var import_string = require("../../utils/string");
var import_query_generator = require("../abstract/query-generator");
var import_query_generator_typescript = require("../abstract/query-generator-typescript");
const REMOVE_INDEX_QUERY_SUPPORTED_OPTIONS = /* @__PURE__ */ new Set();
class Db2QueryGeneratorTypeScript extends import_query_generator.AbstractQueryGenerator {
  describeTableQuery(tableName) {
    const table = this.extractTableDetails(tableName);
    return (0, import_join_sql_fragments.joinSQLFragments)([
      'SELECT NAME AS "Name", TBNAME AS "Table", TBCREATOR AS "Schema",',
      'TRIM(COLTYPE) AS "Type", LENGTH AS "Length", SCALE AS "Scale",',
      'NULLS AS "IsNull", DEFAULT AS "Default", COLNO AS "Colno",',
      'IDENTITY AS "IsIdentity", KEYSEQ AS "KeySeq", REMARKS AS "Comment"',
      "FROM",
      "SYSIBM.SYSCOLUMNS",
      `WHERE TBNAME = ${this.escape(table.tableName)}`,
      table.schema !== "" ? `AND TBCREATOR = ${this.escape(table.schema)}` : "AND TBCREATOR = USER",
      ";"
    ]);
  }
  showIndexesQuery(tableName) {
    const table = this.extractTableDetails(tableName);
    return (0, import_join_sql_fragments.joinSQLFragments)([
      'SELECT NAME AS "name", TBNAME AS "tableName", UNIQUERULE AS "keyType",',
      'COLNAMES, INDEXTYPE AS "type" FROM SYSIBM.SYSINDEXES',
      `WHERE TBNAME = ${this.escape(table.tableName)}`,
      table.schema !== "" ? `AND TBCREATOR = ${this.escape(table.schema)}` : "AND TBCREATOR = USER",
      "ORDER BY NAME;"
    ]);
  }
  removeIndexQuery(tableName, indexNameOrAttributes, options) {
    if (options) {
      (0, import_check.rejectInvalidOptions)(
        "removeIndexQuery",
        this.dialect.name,
        import_query_generator_typescript.REMOVE_INDEX_QUERY_SUPPORTABLE_OPTIONS,
        REMOVE_INDEX_QUERY_SUPPORTED_OPTIONS,
        options
      );
    }
    let indexName;
    if (Array.isArray(indexNameOrAttributes)) {
      const table = this.extractTableDetails(tableName);
      indexName = (0, import_string.generateIndexName)(table, { fields: indexNameOrAttributes });
    } else {
      indexName = indexNameOrAttributes;
    }
    return `DROP INDEX ${this.quoteIdentifier(indexName)}`;
  }
}
//# sourceMappingURL=query-generator-typescript.js.map
