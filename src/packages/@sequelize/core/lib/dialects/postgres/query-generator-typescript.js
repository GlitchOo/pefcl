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
  PostgresQueryGeneratorTypeScript: () => PostgresQueryGeneratorTypeScript
});
module.exports = __toCommonJS(query_generator_typescript_exports);
var import_join_sql_fragments = require("../../utils/join-sql-fragments");
var import_string = require("../../utils/string");
var import_query_generator = require("../abstract/query-generator");
class PostgresQueryGeneratorTypeScript extends import_query_generator.AbstractQueryGenerator {
  describeTableQuery(tableName) {
    const table = this.extractTableDetails(tableName);
    return (0, import_join_sql_fragments.joinSQLFragments)([
      "SELECT",
      'pk.constraint_type as "Constraint",',
      'c.column_name as "Field",',
      'c.column_default as "Default",',
      'c.is_nullable as "Null",',
      `(CASE WHEN c.udt_name = 'hstore' THEN c.udt_name ELSE c.data_type END) || (CASE WHEN c.character_maximum_length IS NOT NULL THEN '(' || c.character_maximum_length || ')' ELSE '' END) as "Type",`,
      '(SELECT array_agg(e.enumlabel) FROM pg_catalog.pg_type t JOIN pg_catalog.pg_enum e ON t.oid=e.enumtypid WHERE t.typname=c.udt_name) AS "special",',
      '(SELECT pgd.description FROM pg_catalog.pg_statio_all_tables AS st INNER JOIN pg_catalog.pg_description pgd on (pgd.objoid=st.relid) WHERE c.ordinal_position=pgd.objsubid AND c.table_name=st.relname) AS "Comment"',
      "FROM information_schema.columns c",
      "LEFT JOIN (SELECT tc.table_schema, tc.table_name,",
      "cu.column_name, tc.constraint_type",
      "FROM information_schema.TABLE_CONSTRAINTS tc",
      "JOIN information_schema.KEY_COLUMN_USAGE  cu",
      "ON tc.table_schema=cu.table_schema and tc.table_name=cu.table_name",
      "and tc.constraint_name=cu.constraint_name",
      `and tc.constraint_type='PRIMARY KEY') pk`,
      "ON pk.table_schema=c.table_schema",
      "AND pk.table_name=c.table_name",
      "AND pk.column_name=c.column_name",
      `WHERE c.table_name = ${this.escape(table.tableName)}`,
      `AND c.table_schema = ${this.escape(table.schema)}`
    ]);
  }
  showIndexesQuery(tableName) {
    const table = this.extractTableDetails(tableName);
    return (0, import_join_sql_fragments.joinSQLFragments)([
      "SELECT i.relname AS name, ix.indisprimary AS primary, ix.indisunique AS unique, ix.indkey AS indkey,",
      "array_agg(a.attnum) as column_indexes, array_agg(a.attname) AS column_names, pg_get_indexdef(ix.indexrelid)",
      "AS definition FROM pg_class t, pg_class i, pg_index ix, pg_attribute a , pg_namespace s",
      "WHERE t.oid = ix.indrelid AND i.oid = ix.indexrelid AND a.attrelid = t.oid AND",
      `t.relkind = 'r' and t.relname = ${this.escape(table.tableName)}`,
      `AND s.oid = t.relnamespace AND s.nspname = ${this.escape(table.schema)}`,
      "GROUP BY i.relname, ix.indexrelid, ix.indisprimary, ix.indisunique, ix.indkey ORDER BY i.relname;"
    ]);
  }
  removeIndexQuery(tableName, indexNameOrAttributes, options) {
    if ((options == null ? void 0 : options.cascade) && (options == null ? void 0 : options.concurrently)) {
      throw new Error(`Cannot specify both concurrently and cascade options in removeIndexQuery for ${this.dialect.name} dialect`);
    }
    let indexName;
    const table = this.extractTableDetails(tableName);
    if (Array.isArray(indexNameOrAttributes)) {
      indexName = (0, import_string.generateIndexName)(table, { fields: indexNameOrAttributes });
    } else {
      indexName = indexNameOrAttributes;
    }
    return (0, import_join_sql_fragments.joinSQLFragments)([
      "DROP INDEX",
      (options == null ? void 0 : options.concurrently) ? "CONCURRENTLY" : "",
      (options == null ? void 0 : options.ifExists) ? "IF EXISTS" : "",
      `${this.quoteIdentifier(table.schema)}.${this.quoteIdentifier(indexName)}`,
      (options == null ? void 0 : options.cascade) ? "CASCADE" : ""
    ]);
  }
}
//# sourceMappingURL=query-generator-typescript.js.map
