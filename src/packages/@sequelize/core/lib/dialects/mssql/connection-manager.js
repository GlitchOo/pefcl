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
  MsSqlConnectionManager: () => MsSqlConnectionManager
});
module.exports = __toCommonJS(connection_manager_exports);
var import_errors = require("../../errors/index.js");
var import_check = require("../../utils/check.js");
var import_logger = require("../../utils/logger");
var import_connection_manager = require("../abstract/connection-manager");
var import_async_queue = require("./async-queue");
const debug = import_logger.logger.debugContext("connection:mssql");
const debugTedious = import_logger.logger.debugContext("connection:mssql:tedious");
class MsSqlConnectionManager extends import_connection_manager.AbstractConnectionManager {
  lib;
  constructor(dialect, sequelize) {
    super(dialect, sequelize);
    this.lib = this._loadDialectModule("tedious");
  }
  async connect(config) {
    const options = {
      port: typeof config.port === "string" ? Number.parseInt(config.port, 10) : config.port,
      database: config.database,
      trustServerCertificate: true
    };
    const authentication = {
      type: "default",
      options: {
        userName: config.username || void 0,
        password: config.password || void 0
      }
    };
    if (config.dialectOptions) {
      if ((0, import_check.isPlainObject)(config.dialectOptions.options) && config.dialectOptions.options.instanceName) {
        delete options.port;
      }
      if (config.dialectOptions.authentication) {
        Object.assign(authentication, config.dialectOptions.authentication);
      }
      Object.assign(options, config.dialectOptions.options);
    }
    const connectionConfig = {
      server: config.host,
      authentication,
      options
    };
    try {
      return await new Promise((resolve, reject) => {
        const connection = new this.lib.Connection(connectionConfig);
        if (connection.state === connection.STATE.INITIALIZED) {
          connection.connect();
        }
        connection.queue = new import_async_queue.AsyncQueue();
        connection.lib = this.lib;
        const connectHandler = (error) => {
          connection.removeListener("end", endHandler);
          connection.removeListener("error", errorHandler);
          if (error) {
            return void reject(error);
          }
          debug("connection acquired");
          resolve(connection);
        };
        const endHandler = () => {
          connection.removeListener("connect", connectHandler);
          connection.removeListener("error", errorHandler);
          reject(new Error("Connection was closed by remote server"));
        };
        const errorHandler = (error) => {
          connection.removeListener("connect", connectHandler);
          connection.removeListener("end", endHandler);
          reject(error);
        };
        connection.once("error", errorHandler);
        connection.once("end", endHandler);
        connection.once("connect", connectHandler);
        connection.on("error", (error) => {
          if ((0, import_check.isErrorWithStringCode)(error) && (error.code === "ESOCKET" || error.code === "ECONNRESET")) {
            void this.pool.destroy(connection);
          }
        });
        if (config.dialectOptions && config.dialectOptions.debug) {
          connection.on("debug", debugTedious.log.bind(debugTedious));
        }
      });
    } catch (error) {
      (0, import_check.assertCaughtError)(error);
      if (!(0, import_check.isErrorWithStringCode)(error)) {
        throw new import_errors.ConnectionError(error);
      }
      switch (error.code) {
        case "ESOCKET":
          if (error.message.includes("connect EHOSTUNREACH")) {
            throw new import_errors.HostNotReachableError(error);
          }
          if (error.message.includes("connect ENETUNREACH")) {
            throw new import_errors.HostNotReachableError(error);
          }
          if (error.message.includes("connect EADDRNOTAVAIL")) {
            throw new import_errors.HostNotReachableError(error);
          }
          if (error.message.includes("getaddrinfo ENOTFOUND")) {
            throw new import_errors.HostNotFoundError(error);
          }
          if (error.message.includes("connect ECONNREFUSED")) {
            throw new import_errors.ConnectionRefusedError(error);
          }
          throw new import_errors.ConnectionError(error);
        case "ER_ACCESS_DENIED_ERROR":
        case "ELOGIN":
          throw new import_errors.AccessDeniedError(error);
        case "EINVAL":
          throw new import_errors.InvalidConnectionError(error);
        default:
          throw new import_errors.ConnectionError(error);
      }
    }
  }
  async disconnect(connection) {
    if (connection.closed) {
      return;
    }
    connection.queue.close();
    await new Promise((resolve) => {
      connection.on("end", resolve);
      connection.close();
      debug("connection closed");
    });
  }
  validate(connection) {
    return connection && (connection.loggedIn || connection.state.name === "LoggedIn");
  }
}
//# sourceMappingURL=connection-manager.js.map
