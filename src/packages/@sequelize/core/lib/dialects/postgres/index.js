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
var postgres_exports = {};
__export(postgres_exports, {
  PostgresDialect: () => PostgresDialect
});
module.exports = __toCommonJS(postgres_exports);
var import_sql = require("../../utils/sql");
var import_abstract = require("../abstract");
var import_connection_manager = require("./connection-manager");
var import_data_types_db = require("./data-types-db.js");
var DataTypes = __toESM(require("./data-types.js"));
var import_query = require("./query");
var import_query_generator = require("./query-generator");
var import_query_interface = require("./query-interface");
class PostgresDialect extends import_abstract.AbstractDialect {
  static supports = import_abstract.AbstractDialect.extendSupport({
    "DEFAULT VALUES": true,
    EXCEPTION: true,
    "ON DUPLICATE KEY": false,
    "ORDER NULLS": true,
    returnValues: "returning",
    bulkDefault: true,
    schemas: true,
    multiDatabases: true,
    lock: true,
    lockOf: true,
    lockKey: true,
    lockOuterJoinFailure: true,
    skipLocked: true,
    forShare: "FOR SHARE",
    index: {
      concurrently: true,
      using: 2,
      where: true,
      functionBased: true,
      operator: true,
      include: true
    },
    inserts: {
      onConflictDoNothing: " ON CONFLICT DO NOTHING",
      updateOnDuplicate: " ON CONFLICT DO UPDATE SET",
      conflictFields: true,
      onConflictWhere: true
    },
    dataTypes: {
      ARRAY: true,
      RANGE: true,
      GEOMETRY: true,
      GEOGRAPHY: true,
      JSON: true,
      JSONB: true,
      HSTORE: true,
      TSVECTOR: true,
      CITEXT: true,
      DATETIME: { infinity: true },
      DATEONLY: { infinity: true },
      FLOAT: { NaN: true, infinity: true },
      REAL: { NaN: true, infinity: true },
      DOUBLE: { NaN: true, infinity: true },
      DECIMAL: { unconstrained: true, NaN: true, infinity: true },
      CIDR: true,
      MACADDR: true,
      INET: true
    },
    jsonOperations: true,
    REGEXP: true,
    IREGEXP: true,
    deferrableConstraints: true,
    searchPath: true,
    escapeStringConstants: true,
    globalTimeZoneConfig: true,
    dropTable: {
      cascade: true
    }
  });
  connectionManager;
  queryGenerator;
  queryInterface;
  Query = import_query.PostgresQuery;
  dataTypesDocumentationUrl = "https://www.postgresql.org/docs/current/datatype.html";
  // minimum supported version
  defaultVersion = "11.0.0";
  TICK_CHAR = '"';
  TICK_CHAR_LEFT = '"';
  TICK_CHAR_RIGHT = '"';
  constructor(sequelize) {
    super(sequelize, DataTypes, "postgres");
    this.connectionManager = new import_connection_manager.PostgresConnectionManager(this, sequelize);
    this.queryGenerator = new import_query_generator.PostgresQueryGenerator({
      dialect: this,
      sequelize
    });
    this.queryInterface = new import_query_interface.PostgresQueryInterface(
      sequelize,
      this.queryGenerator
    );
    (0, import_data_types_db.registerPostgresDbDataTypeParsers)(this);
  }
  createBindCollector() {
    return (0, import_sql.createSpecifiedOrderedBindCollector)();
  }
  escapeBuffer(buffer) {
    const hex = buffer.toString("hex");
    return `'\\x${hex}'`;
  }
  escapeString(value) {
    value = value.replace(/'/g, "''").replace(/\0/g, "\\0");
    return `'${value}'`;
  }
  canBackslashEscape() {
    return !this.sequelize.options.standardConformingStrings;
  }
  getDefaultSchema() {
    return "public";
  }
  static getDefaultPort() {
    return 5432;
  }
}
//# sourceMappingURL=index.js.map
