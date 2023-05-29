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
var db2_exports = {};
__export(db2_exports, {
  Db2Dialect: () => Db2Dialect
});
module.exports = __toCommonJS(db2_exports);
var import_sql = require("../../utils/sql");
var import_abstract = require("../abstract");
var import_connection_manager = require("./connection-manager");
var DataTypes = __toESM(require("./data-types.js"));
var import_query = require("./query");
var import_query_generator = require("./query-generator");
var import_query_interface = require("./query-interface");
class Db2Dialect extends import_abstract.AbstractDialect {
  static supports = import_abstract.AbstractDialect.extendSupport({
    migrations: false,
    schemas: true,
    finalTable: true,
    autoIncrement: {
      defaultValue: false
    },
    alterColumn: {
      unique: false
    },
    index: {
      collate: false,
      using: false,
      where: true,
      include: true
    },
    tmpTableTrigger: true,
    dataTypes: {
      COLLATE_BINARY: true,
      TIME: {
        precision: false
      }
    }
  });
  defaultVersion = "1.0.0";
  dataTypesDocumentationUrl = "https://www.ibm.com/support/knowledgecenter/SSEPGG_11.1.0/com.ibm.db2.luw.sql.ref.doc/doc/r0008478.html";
  connectionManager;
  queryGenerator;
  queryInterface;
  Query = import_query.Db2Query;
  /** @deprecated */
  TICK_CHAR = '"';
  TICK_CHAR_LEFT = '"';
  TICK_CHAR_RIGHT = '"';
  constructor(sequelize) {
    super(sequelize, DataTypes, "db2");
    this.connectionManager = new import_connection_manager.Db2ConnectionManager(this, sequelize);
    this.queryGenerator = new import_query_generator.Db2QueryGenerator({
      dialect: this,
      sequelize
    });
    this.queryInterface = new import_query_interface.Db2QueryInterface(sequelize, this.queryGenerator);
    this.registerDataTypeParser(["CHAR () FOR BIT DATA", "VARCHAR () FOR BIT DATA"], (value) => {
      return value.toString();
    });
    this.registerDataTypeParser(["TIMESTAMP"], (value) => {
      return `${value}+00`;
    });
  }
  createBindCollector() {
    return (0, import_sql.createUnspecifiedOrderedBindCollector)();
  }
  escapeBuffer(buffer) {
    return `BLOB(${this.queryGenerator.escape(buffer.toString())})`;
  }
  getDefaultSchema() {
    return "";
  }
  static getDefaultPort() {
    return 3306;
  }
}
//# sourceMappingURL=index.js.map
