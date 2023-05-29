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
var connection_manager_exports = {};
__export(connection_manager_exports, {
  Db2ConnectionManager: () => Db2ConnectionManager
});
module.exports = __toCommonJS(connection_manager_exports);
var import_node_assert = __toESM(require("node:assert"));
var import_node_util = __toESM(require("node:util"));
var import_errors = require("../../errors/index.js");
var import_connection_manager = require("../abstract/connection-manager");
class Db2ConnectionManager extends import_connection_manager.AbstractConnectionManager {
  lib;
  constructor(dialect, sequelize) {
    super(dialect, sequelize);
    this.lib = this._loadDialectModule("ibm_db");
  }
  /**
   * Connect with DB2 database based on config, Handle any errors in connection
   * Set the pool handlers on connection.error
   *
   * @param config
   * @returns
   * @private
   */
  async connect(config) {
    const connectionConfig = {
      // @ts-expect-error -- Bad typings
      DATABASE: config.database,
      // @ts-expect-error -- Bad typings
      HOSTNAME: config.host,
      // @ts-expect-error -- Bad typings
      PORT: config.port,
      // @ts-expect-error -- Bad typings
      UID: config.username,
      // @ts-expect-error -- Bad typings
      PWD: config.password,
      ...config.ssl ? { SECURITY: config.ssl } : void 0,
      // TODO: pass this property through dialectOptions
      // @ts-expect-error -- DB2 specific option that should not be at the top level
      ...config.sslcertificate ? { SSLServerCertificate: config.ssl } : void 0,
      ...config.dialectOptions
    };
    try {
      return await new Promise((resolve, reject) => {
        const connection = new this.lib.Database();
        connection.lib = this.lib;
        connection.open(connectionConfig, (error) => {
          if (error) {
            if (error.message && error.message.includes("SQL30081N")) {
              return void reject(new import_errors.ConnectionRefusedError(error));
            }
            return void reject(new import_errors.ConnectionError(error));
          }
          return void resolve(connection);
        });
      });
    } catch (error) {
      (0, import_node_assert.default)(error instanceof Error, `DB2 threw a non-error value: ${import_node_util.default.inspect(error)}`);
      throw new import_errors.ConnectionError(error);
    }
  }
  async disconnect(connection) {
    if (!connection.connected) {
      return;
    }
    await connection.close();
  }
  validate(connection) {
    return connection.connected;
  }
}
//# sourceMappingURL=connection-manager.js.map
