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
var sqlite_exports = {};
__export(sqlite_exports, {
  SqliteDialect: () => SqliteDialect
});
module.exports = __toCommonJS(sqlite_exports);
var import_sql = require("../../utils/sql");
var import_abstract = require("../abstract");
var import_connection_manager = require("./connection-manager");
var DataTypes = __toESM(require("./data-types.js"));
var import_query = require("./query");
var import_query_generator = require("./query-generator");
var import_query_interface = require("./query-interface");
class SqliteDialect extends import_abstract.AbstractDialect {
  static supports = import_abstract.AbstractDialect.extendSupport({
    DEFAULT: false,
    "DEFAULT VALUES": true,
    "UNION ALL": false,
    "RIGHT JOIN": false,
    inserts: {
      ignoreDuplicates: " OR IGNORE",
      updateOnDuplicate: " ON CONFLICT DO UPDATE SET",
      conflictFields: true,
      onConflictWhere: true
    },
    index: {
      using: false,
      where: true,
      functionBased: true
    },
    transactionOptions: {
      type: true
    },
    constraints: {
      addConstraint: false,
      dropConstraint: false
    },
    groupedLimit: false,
    dataTypes: {
      CHAR: false,
      COLLATE_BINARY: true,
      CITEXT: true,
      DECIMAL: false,
      JSON: true
    },
    // TODO: add support for JSON operations https://www.sqlite.org/json1.html (bundled in sqlite3)
    jsonOperations: false
  });
  defaultVersion = "3.8.0";
  Query = import_query.SqliteQuery;
  TICK_CHAR = "`";
  TICK_CHAR_LEFT = "`";
  TICK_CHAR_RIGHT = "`";
  connectionManager;
  queryGenerator;
  queryInterface;
  dataTypesDocumentationUrl = "https://www.sqlite.org/datatype3.html";
  constructor(sequelize) {
    super(sequelize, DataTypes, "sqlite");
    this.connectionManager = new import_connection_manager.SqliteConnectionManager(this, sequelize);
    this.queryGenerator = new import_query_generator.SqliteQueryGenerator({
      dialect: this,
      sequelize
    });
    this.queryInterface = new import_query_interface.SqliteQueryInterface(
      sequelize,
      this.queryGenerator
    );
  }
  createBindCollector() {
    return (0, import_sql.createNamedParamBindCollector)("$");
  }
  getDefaultSchema() {
    return "";
  }
  static getDefaultPort() {
    return 0;
  }
}
//# sourceMappingURL=index.js.map
