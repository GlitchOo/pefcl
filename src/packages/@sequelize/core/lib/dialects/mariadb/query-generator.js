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
var query_generator_exports = {};
__export(query_generator_exports, {
  MariaDbQueryGenerator: () => MariaDbQueryGenerator
});
module.exports = __toCommonJS(query_generator_exports);
var import_data_types_utils = require("../abstract/data-types-utils");
var import_join_sql_fragments = require("../../utils/join-sql-fragments.js");
var import_query_generator_typescript = require("./query-generator-typescript");
const _ = require("lodash");
class MariaDbQueryGenerator extends import_query_generator_typescript.MariaDbQueryGeneratorTypeScript {
  _getTechnicalSchemaNames() {
    return ["MYSQL", "INFORMATION_SCHEMA", "PERFORMANCE_SCHEMA", "mysql", "information_schema", "performance_schema"];
  }
  addColumnQuery(table, key, dataType, options = {}) {
    const ifNotExists = options.ifNotExists ? "IF NOT EXISTS" : "";
    dataType = {
      ...dataType,
      type: (0, import_data_types_utils.normalizeDataType)(dataType.type, this.dialect)
    };
    return (0, import_join_sql_fragments.joinSQLFragments)([
      "ALTER TABLE",
      this.quoteTable(table),
      "ADD",
      ifNotExists,
      this.quoteIdentifier(key),
      this.attributeToSQL(dataType, {
        context: "addColumn",
        tableName: table,
        foreignKey: key
      }),
      ";"
    ]);
  }
  removeColumnQuery(tableName, attributeName, options = {}) {
    const ifExists = options.ifExists ? "IF EXISTS" : "";
    return (0, import_join_sql_fragments.joinSQLFragments)([
      "ALTER TABLE",
      this.quoteTable(tableName),
      "DROP",
      ifExists,
      this.quoteIdentifier(attributeName),
      ";"
    ]);
  }
  /**
   * Generates an SQL query that extract JSON property of given path.
   *
   * @param   {string}               column  The JSON column
   * @param   {string|Array<string>} [path]  The path to extract (optional)
   * @returns {string}                       The generated sql query
   * @private
   */
  jsonPathExtractionQuery(column, path) {
    const quotedColumn = this.isIdentifierQuoted(column) ? column : this.quoteIdentifier(column);
    const pathStr = this.escape(["$"].concat(_.toPath(path)).join(".").replace(/\.(\d+)(?:(?=\.)|$)/g, (__, digit) => `[${digit}]`));
    return `json_unquote(json_extract(${quotedColumn},${pathStr}))`;
  }
}
//# sourceMappingURL=query-generator.js.map
