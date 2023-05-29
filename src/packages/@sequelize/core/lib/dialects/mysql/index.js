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
var mysql_exports = {};
__export(mysql_exports, {
  MysqlDialect: () => MysqlDialect
});
module.exports = __toCommonJS(mysql_exports);
var import_sql = require("../../utils/sql");
var import_abstract = require("../abstract");
var import_connection_manager = require("./connection-manager");
var DataTypes = __toESM(require("./data-types"));
var import_data_types_db = require("./data-types.db.js");
var import_mysql_utils = require("./mysql-utils");
var import_query = require("./query");
var import_query_generator = require("./query-generator");
var import_query_interface = require("./query-interface");
const numericOptions = {
  zerofill: true,
  unsigned: true
};
class MysqlDialect extends import_abstract.AbstractDialect {
  static supports = import_abstract.AbstractDialect.extendSupport(
    {
      "VALUES ()": true,
      "LIMIT ON UPDATE": true,
      lock: true,
      forShare: "LOCK IN SHARE MODE",
      settingIsolationLevelDuringTransaction: false,
      schemas: true,
      inserts: {
        ignoreDuplicates: " IGNORE",
        updateOnDuplicate: " ON DUPLICATE KEY UPDATE"
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
      dataTypes: {
        COLLATE_BINARY: true,
        GEOMETRY: true,
        INTS: numericOptions,
        FLOAT: { ...numericOptions, scaleAndPrecision: true },
        REAL: { ...numericOptions, scaleAndPrecision: true },
        DOUBLE: { ...numericOptions, scaleAndPrecision: true },
        DECIMAL: numericOptions,
        JSON: true
      },
      jsonOperations: true,
      REGEXP: true,
      globalTimeZoneConfig: true
    }
  );
  connectionManager;
  queryGenerator;
  queryInterface;
  Query = import_query.MySqlQuery;
  dataTypesDocumentationUrl = "https://dev.mysql.com/doc/refman/5.7/en/data-types.html";
  // minimum supported version
  defaultVersion = "5.7.0";
  TICK_CHAR = "`";
  TICK_CHAR_LEFT = "`";
  TICK_CHAR_RIGHT = "`";
  constructor(sequelize) {
    super(sequelize, DataTypes, "mysql");
    this.connectionManager = new import_connection_manager.MySqlConnectionManager(this, sequelize);
    this.queryGenerator = new import_query_generator.MySqlQueryGenerator({
      dialect: this,
      sequelize
    });
    this.queryInterface = new import_query_interface.MySqlQueryInterface(
      sequelize,
      this.queryGenerator
    );
    (0, import_data_types_db.registerMySqlDbDataTypeParsers)(this);
  }
  createBindCollector() {
    return (0, import_sql.createUnspecifiedOrderedBindCollector)();
  }
  escapeString(value) {
    return (0, import_mysql_utils.escapeMysqlString)(value);
  }
  canBackslashEscape() {
    return true;
  }
  getDefaultSchema() {
    return this.sequelize.options.database ?? "";
  }
  static getDefaultPort() {
    return 3306;
  }
}
//# sourceMappingURL=index.js.map
