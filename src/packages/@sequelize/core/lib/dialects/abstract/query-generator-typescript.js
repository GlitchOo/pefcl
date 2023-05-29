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
var query_generator_typescript_exports = {};
__export(query_generator_typescript_exports, {
  AbstractQueryGeneratorTypeScript: () => AbstractQueryGeneratorTypeScript,
  REMOVE_INDEX_QUERY_SUPPORTABLE_OPTIONS: () => REMOVE_INDEX_QUERY_SUPPORTABLE_OPTIONS
});
module.exports = __toCommonJS(query_generator_typescript_exports);
var import_node_util = __toESM(require("node:util"));
var import_isObject = __toESM(require("lodash/isObject"));
var import_check = require("../../utils/check.js");
var import_dialect = require("../../utils/dialect.js");
var import_model_utils = require("../../utils/model-utils.js");
const REMOVE_INDEX_QUERY_SUPPORTABLE_OPTIONS = /* @__PURE__ */ new Set(["concurrently", "ifExists", "cascade"]);
class AbstractQueryGeneratorTypeScript {
  dialect;
  sequelize;
  constructor(options) {
    if (!options.sequelize) {
      throw new Error("QueryGenerator initialized without options.sequelize");
    }
    if (!options.dialect) {
      throw new Error("QueryGenerator initialized without options.dialect");
    }
    this.sequelize = options.sequelize;
    this.dialect = options.dialect;
  }
  get options() {
    return this.sequelize.options;
  }
  describeTableQuery(tableName) {
    return `DESCRIBE ${this.quoteTable(tableName)};`;
  }
  showIndexesQuery(_tableName) {
    throw new Error(`showIndexesQuery has not been implemented in ${this.dialect.name}.`);
  }
  removeIndexQuery(_tableName, _indexNameOrAttributes, _options) {
    throw new Error(`removeIndexQuery has not been implemented in ${this.dialect.name}.`);
  }
  // TODO: rename to "normalizeTable" & move to sequelize class
  extractTableDetails(tableNameOrModel, options) {
    const tableNameObject = (0, import_model_utils.isModelStatic)(tableNameOrModel) ? tableNameOrModel.getTableName() : (0, import_check.isString)(tableNameOrModel) ? { tableName: tableNameOrModel } : tableNameOrModel;
    if (!(0, import_check.isPlainObject)(tableNameObject)) {
      throw new Error(`Invalid input received, got ${import_node_util.default.inspect(tableNameOrModel)}, expected a Model Class, a TableNameWithSchema object, or a table name string`);
    }
    delete tableNameObject.toString;
    return {
      ...tableNameObject,
      schema: (options == null ? void 0 : options.schema) || tableNameObject.schema || this.options.schema || this.dialect.getDefaultSchema(),
      delimiter: (options == null ? void 0 : options.delimiter) || tableNameObject.delimiter || "."
    };
  }
  /**
   * Quote table name with optional alias and schema attribution
   *
   * @param param table string or object
   * @param alias alias name
   */
  quoteTable(param, alias = false) {
    if ((0, import_model_utils.isModelStatic)(param)) {
      param = param.getTableName();
    }
    const tableName = this.extractTableDetails(param);
    if ((0, import_isObject.default)(param) && ("as" in param || "name" in param)) {
      throw new Error('parameters "as" and "name" are not allowed in the first parameter of quoteTable, pass them as the second parameter.');
    }
    if (alias === true) {
      alias = tableName.tableName;
    }
    let sql = "";
    if (this.dialect.supports.schemas) {
      if (tableName.schema && tableName.schema !== this.dialect.getDefaultSchema()) {
        sql += `${this.quoteIdentifier(tableName.schema)}.`;
      }
      sql += this.quoteIdentifier(tableName.tableName);
    } else {
      const fakeSchemaPrefix = tableName.schema && tableName.schema !== this.dialect.getDefaultSchema() ? tableName.schema + (tableName.delimiter || ".") : "";
      sql += this.quoteIdentifier(fakeSchemaPrefix + tableName.tableName);
    }
    if (alias) {
      sql += ` AS ${this.quoteIdentifier(alias)}`;
    }
    return sql;
  }
  /**
   * Adds quotes to identifier
   *
   * @param identifier
   * @param _force
   */
  quoteIdentifier(identifier, _force) {
    return (0, import_dialect.quoteIdentifier)(identifier, this.dialect.TICK_CHAR_LEFT, this.dialect.TICK_CHAR_RIGHT);
  }
  isSameTable(tableA, tableB) {
    if (tableA === tableB) {
      return true;
    }
    tableA = this.extractTableDetails(tableA);
    tableB = this.extractTableDetails(tableB);
    return tableA.tableName === tableB.tableName && tableA.schema === tableB.schema;
  }
}
//# sourceMappingURL=query-generator-typescript.js.map
