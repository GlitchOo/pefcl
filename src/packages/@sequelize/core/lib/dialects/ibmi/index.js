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
var ibmi_exports = {};
__export(ibmi_exports, {
  IBMiDialect: () => IBMiDialect
});
module.exports = __toCommonJS(ibmi_exports);
var import_sql = require("../../utils/sql");
var import_abstract = require("../abstract");
var import_connection_manager = require("./connection-manager");
var DataTypes = __toESM(require("./data-types.js"));
var import_query = require("./query");
var import_query_generator = require("./query-generator");
var import_query_interface = require("./query-interface");
class IBMiDialect extends import_abstract.AbstractDialect {
  static supports = import_abstract.AbstractDialect.extendSupport(
    {
      "VALUES ()": true,
      "ON DUPLICATE KEY": false,
      transactions: false,
      bulkDefault: true,
      index: {
        using: false,
        where: true,
        functionBased: true,
        collate: false,
        include: false
      },
      constraints: {
        onUpdate: false
      },
      groupedLimit: false,
      upserts: false,
      schemas: true,
      dataTypes: {
        COLLATE_BINARY: true
      }
    }
  );
  connectionManager;
  queryGenerator;
  queryInterface;
  dataTypesDocumentationUrl = "https://www.ibm.com/support/knowledgecenter/en/ssw_ibm_i_73/db2/rbafzch2data.htm";
  defaultVersion = "7.3.0";
  Query = import_query.IBMiQuery;
  TICK_CHAR = '"';
  TICK_CHAR_LEFT = '"';
  TICK_CHAR_RIGHT = '"';
  constructor(sequelize) {
    super(sequelize, DataTypes, "ibmi");
    this.connectionManager = new import_connection_manager.IBMiConnectionManager(this, sequelize);
    this.queryGenerator = new import_query_generator.IBMiQueryGenerator({
      dialect: this,
      sequelize
    });
    this.queryInterface = new import_query_interface.IBMiQueryInterface(this.sequelize, this.queryGenerator);
  }
  createBindCollector() {
    return (0, import_sql.createUnspecifiedOrderedBindCollector)();
  }
  escapeBuffer(buffer) {
    return `BLOB(X'${buffer.toString("hex")}')`;
  }
  getDefaultSchema() {
    return "";
  }
  static getDefaultPort() {
    return 25e3;
  }
}
//# sourceMappingURL=index.js.map
