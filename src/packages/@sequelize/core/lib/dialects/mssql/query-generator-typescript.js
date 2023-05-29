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
  MsSqlQueryGeneratorTypeScript: () => MsSqlQueryGeneratorTypeScript
});
module.exports = __toCommonJS(query_generator_typescript_exports);
var import_check = require("../../utils/check");
var import_join_sql_fragments = require("../../utils/join-sql-fragments");
var import_string = require("../../utils/string");
var import_query_generator = require("../abstract/query-generator");
var import_query_generator_typescript = require("../abstract/query-generator-typescript");
const REMOVE_INDEX_QUERY_SUPPORTED_OPTIONS = /* @__PURE__ */ new Set(["ifExists"]);
class MsSqlQueryGeneratorTypeScript extends import_query_generator.AbstractQueryGenerator {
  describeTableQuery(tableName) {
    const table = this.extractTableDetails(tableName);
    return (0, import_join_sql_fragments.joinSQLFragments)([
      "SELECT",
      `c.COLUMN_NAME AS 'Name',`,
      `c.DATA_TYPE AS 'Type',`,
      `c.CHARACTER_MAXIMUM_LENGTH AS 'Length',`,
      `c.IS_NULLABLE as 'IsNull',`,
      `COLUMN_DEFAULT AS 'Default',`,
      `pk.CONSTRAINT_TYPE AS 'Constraint',`,
      `COLUMNPROPERTY(OBJECT_ID(c.TABLE_SCHEMA+'.'+c.TABLE_NAME), c.COLUMN_NAME, 'IsIdentity') as 'IsIdentity',`,
      `CAST(prop.value AS NVARCHAR) AS 'Comment'`,
      "FROM",
      "INFORMATION_SCHEMA.TABLES t",
      "INNER JOIN",
      "INFORMATION_SCHEMA.COLUMNS c ON t.TABLE_NAME = c.TABLE_NAME AND t.TABLE_SCHEMA = c.TABLE_SCHEMA",
      "LEFT JOIN (SELECT tc.table_schema, tc.table_name,",
      "cu.column_name, tc.CONSTRAINT_TYPE",
      "FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc",
      "JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE  cu",
      "ON tc.table_schema=cu.table_schema and tc.table_name=cu.table_name",
      "and tc.constraint_name=cu.constraint_name",
      `and tc.CONSTRAINT_TYPE='PRIMARY KEY') pk`,
      "ON pk.table_schema=c.table_schema",
      "AND pk.table_name=c.table_name",
      "AND pk.column_name=c.column_name",
      "INNER JOIN sys.columns AS sc",
      `ON sc.object_id = object_id(t.table_schema + '.' + t.table_name) AND sc.name = c.column_name`,
      "LEFT JOIN sys.extended_properties prop ON prop.major_id = sc.object_id",
      "AND prop.minor_id = sc.column_id",
      `AND prop.name = 'MS_Description'`,
      `WHERE t.TABLE_NAME = ${this.escape(table.tableName)}`,
      `AND t.TABLE_SCHEMA = ${this.escape(table.schema)}`
    ]);
  }
  showIndexesQuery(tableName) {
    return `EXEC sys.sp_helpindex @objname = ${this.escape(this.quoteTable(tableName))};`;
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
      "DROP INDEX",
      (options == null ? void 0 : options.ifExists) ? "IF EXISTS" : "",
      this.quoteIdentifier(indexName),
      "ON",
      this.quoteTable(tableName)
    ]);
  }
}
//# sourceMappingURL=query-generator-typescript.js.map
