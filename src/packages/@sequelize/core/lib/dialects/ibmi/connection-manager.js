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
var connection_manager_exports = {};
__export(connection_manager_exports, {
  IBMiConnectionManager: () => IBMiConnectionManager
});
module.exports = __toCommonJS(connection_manager_exports);
var import_errors = require("../../errors/index.js");
var import_logger = require("../../utils/logger");
var import_connection_manager = require("../abstract/connection-manager");
const debug = import_logger.logger.debugContext("connection:ibmi");
class IBMiConnectionManager extends import_connection_manager.AbstractConnectionManager {
  lib;
  constructor(dialect, sequelize) {
    super(dialect, sequelize);
    this.lib = this._loadDialectModule("odbc");
  }
  async connect(config) {
    const connectionKeywords = [];
    if (config.dialectOptions && config.dialectOptions.odbcConnectionString) {
      connectionKeywords.push(config.dialectOptions.odbcConnectionString);
    }
    if (config.database) {
      connectionKeywords.push(`DSN=${config.database}`);
    }
    if (config.username) {
      connectionKeywords.push(`UID=${config.username}`);
    }
    if (config.password) {
      connectionKeywords.push(`PWD=${config.password}`);
    }
    if (config.host) {
      connectionKeywords.push(`SYSTEM=${config.host}`);
    }
    let connectionString = connectionKeywords.join(";");
    if (!connectionString.endsWith(";")) {
      connectionString += ";";
    }
    let connection;
    try {
      connection = await this.lib.connect(connectionString);
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }
      if (error.toString().includes("Error connecting to the database")) {
        throw new import_errors.ConnectionRefusedError(error);
      }
      throw error;
    }
    return connection;
  }
  async disconnect(connection) {
    if (!this.validate(connection)) {
      debug("Tried to disconnect, but connection was already closed.");
      return;
    }
    await new Promise((resolve, reject) => {
      connection.close((error) => {
        if (error) {
          return void reject(error);
        }
        resolve();
        return void 0;
      });
    });
  }
  validate(connection) {
    return connection.isConnected;
  }
}
//# sourceMappingURL=connection-manager.js.map
