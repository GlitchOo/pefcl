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
var mssql_exports = {};
__export(mssql_exports, {
  MssqlDialect: () => MssqlDialect
});
module.exports = __toCommonJS(mssql_exports);
var import_sql = require("../../utils/sql");
var import_abstract = require("../abstract");
var import_connection_manager = require("./connection-manager");
var DataTypes = __toESM(require("./data-types"));
var import_data_types_db = require("./data-types.db.js");
var import_query_generator = require("./query-generator");
var import_query_interface = require("./query-interface");
var import_query = require("./query.js");
class MssqlDialect extends import_abstract.AbstractDialect {
  static supports = import_abstract.AbstractDialect.extendSupport({
    "DEFAULT VALUES": true,
    "LIMIT ON UPDATE": true,
    migrations: false,
    returnValues: "output",
    schemas: true,
    multiDatabases: true,
    autoIncrement: {
      identityInsert: true,
      defaultValue: false,
      update: false
    },
    alterColumn: {
      unique: false
    },
    constraints: {
      restrict: false,
      default: true
    },
    index: {
      collate: false,
      type: true,
      using: false,
      where: true,
      include: true
    },
    tmpTableTrigger: true,
    dataTypes: {
      JSON: true,
      // TODO: https://learn.microsoft.com/en-us/sql/t-sql/spatial-geography/spatial-types-geography?view=sql-server-ver16
      GEOGRAPHY: false,
      // TODO: https://learn.microsoft.com/en-us/sql/t-sql/spatial-geometry/spatial-types-geometry-transact-sql?view=sql-server-ver16
      GEOMETRY: false
    },
    // TODO: add support for JSON queries https://learn.microsoft.com/en-us/sql/relational-databases/json/json-data-sql-server?view=sql-server-ver16
    jsonOperations: false
  });
  connectionManager;
  queryGenerator;
  queryInterface;
  Query = import_query.MsSqlQuery;
  dataTypesDocumentationUrl = "https://msdn.microsoft.com/en-us/library/ms187752%28v=sql.110%29.aspx";
  // SQL Server 2017 Express (version 14), minimum supported version, all the way
  // up to the most recent version. When increasing this version, remember to
  // update also the minimum version in the documentation at
  //   https://github.com/sequelize/website/blob/main/docs/other-topics/dialect-specific-things.md
  // and set the relevant years for the mssql Docker images in the ci.yml file at
  //   .github/workflows/ci.yml
  // minimum supported version
  defaultVersion = "14.0.1000";
  TICK_CHAR = '"';
  TICK_CHAR_LEFT = "[";
  TICK_CHAR_RIGHT = "]";
  constructor(sequelize) {
    super(sequelize, DataTypes, "mssql");
    this.connectionManager = new import_connection_manager.MsSqlConnectionManager(this, sequelize);
    this.queryGenerator = new import_query_generator.MsSqlQueryGenerator({
      dialect: this,
      sequelize
    });
    this.queryInterface = new import_query_interface.MsSqlQueryInterface(
      sequelize,
      this.queryGenerator
    );
    (0, import_data_types_db.registerMsSqlDbDataTypeParsers)(this);
  }
  createBindCollector() {
    return (0, import_sql.createNamedParamBindCollector)("@");
  }
  escapeBuffer(buffer) {
    const hex = buffer.toString("hex");
    return `0x${hex}`;
  }
  escapeString(value) {
    value = value.replace(/'/g, "''");
    return `N'${value}'`;
  }
  getDefaultSchema() {
    return "dbo";
  }
  static getDefaultPort() {
    return 1433;
  }
}
//# sourceMappingURL=index.js.map
