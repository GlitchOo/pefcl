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
var snowflake_exports = {};
__export(snowflake_exports, {
  SnowflakeDialect: () => SnowflakeDialect
});
module.exports = __toCommonJS(snowflake_exports);
var import_sql = require("../../utils/sql");
var import_abstract = require("../abstract");
var import_connection_manager = require("./connection-manager");
var DataTypes = __toESM(require("./data-types.js"));
var import_query = require("./query");
var import_query_generator = require("./query-generator");
var import_query_interface = require("./query-interface");
class SnowflakeDialect extends import_abstract.AbstractDialect {
  static supports = import_abstract.AbstractDialect.extendSupport({
    "VALUES ()": true,
    "LIMIT ON UPDATE": true,
    lock: true,
    forShare: "LOCK IN SHARE MODE",
    settingIsolationLevelDuringTransaction: false,
    inserts: {
      ignoreDuplicates: " IGNORE"
      // disable for now, but could be enable by approach below
      // https://stackoverflow.com/questions/54828745/how-to-migrate-on-conflict-do-nothing-from-postgresql-to-snowflake
      // updateOnDuplicate: true
    },
    index: {
      collate: false,
      length: true,
      parser: true,
      type: true,
      using: 1
    },
    constraints: {
      dropConstraint: false,
      check: false
    },
    indexViaAlter: true,
    indexHints: true,
    schemas: true,
    multiDatabases: true,
    dataTypes: {
      COLLATE_BINARY: true
    },
    REGEXP: true,
    globalTimeZoneConfig: true
  });
  dataTypesDocumentationUrl = "https://docs.snowflake.com/en/sql-reference/data-types.html";
  // TODO: fix the minimum supported version
  defaultVersion = "5.7.0";
  Query = import_query.SnowflakeQuery;
  TICK_CHAR = '"';
  TICK_CHAR_LEFT = '"';
  TICK_CHAR_RIGHT = '"';
  connectionManager;
  queryGenerator;
  queryInterface;
  constructor(sequelize) {
    super(sequelize, DataTypes, "snowflake");
    this.connectionManager = new import_connection_manager.SnowflakeConnectionManager(this, sequelize);
    this.queryGenerator = new import_query_generator.SnowflakeQueryGenerator({
      dialect: this,
      sequelize
    });
    this.queryInterface = new import_query_interface.SnowflakeQueryInterface(sequelize, this.queryGenerator);
  }
  createBindCollector() {
    return (0, import_sql.createUnspecifiedOrderedBindCollector)();
  }
  getDefaultSchema() {
    return "PUBLIC";
  }
  static getDefaultPort() {
    return 3306;
  }
}
//# sourceMappingURL=index.js.map
