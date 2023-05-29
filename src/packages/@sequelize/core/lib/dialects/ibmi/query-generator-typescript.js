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
  IBMiQueryGeneratorTypeScript: () => IBMiQueryGeneratorTypeScript
});
module.exports = __toCommonJS(query_generator_typescript_exports);
var import_check = require("../../utils/check");
var import_join_sql_fragments = require("../../utils/join-sql-fragments");
var import_string = require("../../utils/string");
var import_query_generator = require("../abstract/query-generator");
var import_query_generator_typescript = require("../abstract/query-generator-typescript");
const REMOVE_INDEX_QUERY_SUPPORTED_OPTIONS = /* @__PURE__ */ new Set(["ifExists"]);
class IBMiQueryGeneratorTypeScript extends import_query_generator.AbstractQueryGenerator {
  describeTableQuery(tableName) {
    const table = this.extractTableDetails(tableName);
    return (0, import_join_sql_fragments.joinSQLFragments)([
      "SELECT",
      "QSYS2.SYSCOLUMNS.*,",
      "QSYS2.SYSCST.CONSTRAINT_NAME,",
      "QSYS2.SYSCST.CONSTRAINT_TYPE",
      "FROM QSYS2.SYSCOLUMNS",
      "LEFT OUTER JOIN QSYS2.SYSCSTCOL",
      "ON QSYS2.SYSCOLUMNS.TABLE_SCHEMA = QSYS2.SYSCSTCOL.TABLE_SCHEMA",
      "AND QSYS2.SYSCOLUMNS.TABLE_NAME = QSYS2.SYSCSTCOL.TABLE_NAME",
      "AND QSYS2.SYSCOLUMNS.COLUMN_NAME = QSYS2.SYSCSTCOL.COLUMN_NAME",
      "LEFT JOIN QSYS2.SYSCST",
      "ON QSYS2.SYSCSTCOL.CONSTRAINT_NAME = QSYS2.SYSCST.CONSTRAINT_NAME",
      "WHERE QSYS2.SYSCOLUMNS.TABLE_SCHEMA =",
      table.schema !== "" ? `${this.escape(table.schema)}` : "CURRENT SCHEMA",
      "AND QSYS2.SYSCOLUMNS.TABLE_NAME =",
      `${this.escape(table.tableName)}`
    ]);
  }
  showIndexesQuery(tableName) {
    const table = this.extractTableDetails(tableName);
    return (0, import_join_sql_fragments.joinSQLFragments)([
      "select QSYS2.SYSCSTCOL.CONSTRAINT_NAME as NAME, QSYS2.SYSCSTCOL.COLUMN_NAME, QSYS2.SYSCST.CONSTRAINT_TYPE, QSYS2.SYSCST.TABLE_SCHEMA,",
      "QSYS2.SYSCST.TABLE_NAME from QSYS2.SYSCSTCOL left outer join QSYS2.SYSCST on QSYS2.SYSCSTCOL.TABLE_SCHEMA = QSYS2.SYSCST.TABLE_SCHEMA and",
      "QSYS2.SYSCSTCOL.TABLE_NAME = QSYS2.SYSCST.TABLE_NAME and QSYS2.SYSCSTCOL.CONSTRAINT_NAME = QSYS2.SYSCST.CONSTRAINT_NAME where",
      "QSYS2.SYSCSTCOL.TABLE_SCHEMA =",
      table.schema !== "" ? `${this.escape(table.schema)}` : "CURRENT SCHEMA",
      `and QSYS2.SYSCSTCOL.TABLE_NAME = ${this.escape(table.tableName)} union select QSYS2.SYSKEYS.INDEX_NAME AS NAME,`,
      `QSYS2.SYSKEYS.COLUMN_NAME, CAST('INDEX' AS VARCHAR(11)), QSYS2.SYSINDEXES.TABLE_SCHEMA, QSYS2.SYSINDEXES.TABLE_NAME from QSYS2.SYSKEYS`,
      "left outer join QSYS2.SYSINDEXES on QSYS2.SYSKEYS.INDEX_NAME = QSYS2.SYSINDEXES.INDEX_NAME where QSYS2.SYSINDEXES.TABLE_SCHEMA =",
      table.schema !== "" ? `${this.escape(table.schema)}` : "CURRENT SCHEMA",
      `and QSYS2.SYSINDEXES.TABLE_NAME = ${this.escape(table.tableName)}`
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
    return (0, import_join_sql_fragments.joinSQLFragments)([
      "BEGIN",
      (options == null ? void 0 : options.ifExists) ? `IF EXISTS (SELECT * FROM QSYS2.SYSINDEXES WHERE INDEX_NAME = ${this.quoteIdentifier(indexName)}) THEN` : "",
      `DROP INDEX ${this.quoteIdentifier(indexName)};`,
      "COMMIT;",
      (options == null ? void 0 : options.ifExists) ? "END IF;" : "",
      "END"
    ]);
  }
}
//# sourceMappingURL=query-generator-typescript.js.map
