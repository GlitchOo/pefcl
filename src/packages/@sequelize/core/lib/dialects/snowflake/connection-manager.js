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
  SnowflakeConnectionManager: () => SnowflakeConnectionManager
});
module.exports = __toCommonJS(connection_manager_exports);
var import_errors = require("../../errors/index.js");
var import_check = require("../../utils/check.js");
var import_logger = require("../../utils/logger");
var import_connection_manager = require("../abstract/connection-manager");
const debug = import_logger.logger.debugContext("connection:snowflake");
class SnowflakeConnectionManager extends import_connection_manager.AbstractConnectionManager {
  lib;
  constructor(dialect, sequelize) {
    super(dialect, sequelize);
    this.lib = this._loadDialectModule("snowflake-sdk");
  }
  /**
   * Connect with a snowflake database based on config, Handle any errors in connection
   * Set the pool handlers on connection.error
   * Also set proper timezone once connection is connected.
   *
   * @param config
   * @returns
   * @private
   */
  async connect(config) {
    const connectionConfig = {
      account: config.host,
      username: config.username,
      password: config.password,
      database: config.database,
      // @ts-expect-error -- snowflake specific options. They should be in dialectOptions. Do not declare them in ConnectionOptions.
      warehouse: config.warehouse,
      // @ts-expect-error -- snowflake specific options. They should be in dialectOptions. Do not declare them in ConnectionOptions.
      role: config.role,
      ...config.dialectOptions
    };
    try {
      const connection = this.lib.createConnection(connectionConfig);
      await new Promise((resolve, reject) => {
        connection.connect((err) => {
          if (err) {
            return void reject(err);
          }
          resolve();
        });
      });
      debug("connection acquired");
      if (!this.sequelize.config.keepDefaultTimezone) {
        const tzOffset = this.sequelize.options.timezone === "+00:00" ? "Etc/UTC" : this.sequelize.options.timezone;
        const isNamedTzOffset = tzOffset.includes("/");
        if (!isNamedTzOffset) {
          throw new Error('Snowflake only supports named timezones for the sequelize "timezone" option.');
        }
        await new Promise((resolve, reject) => {
          connection.execute({
            sqlText: `ALTER SESSION SET timezone = '${tzOffset}'`,
            complete(err) {
              if (err) {
                return void reject(err);
              }
              resolve();
            }
          });
        });
      }
      return connection;
    } catch (error) {
      if (!(0, import_check.isErrorWithStringCode)(error)) {
        throw error;
      }
      switch (error.code) {
        case "ECONNREFUSED":
          throw new import_errors.ConnectionRefusedError(error);
        case "ER_ACCESS_DENIED_ERROR":
          throw new import_errors.AccessDeniedError(error);
        case "ENOTFOUND":
          throw new import_errors.HostNotFoundError(error);
        case "EHOSTUNREACH":
          throw new import_errors.HostNotReachableError(error);
        case "EINVAL":
          throw new import_errors.InvalidConnectionError(error);
        default:
          throw new import_errors.ConnectionError(error);
      }
    }
  }
  async disconnect(connection) {
    if (!connection.isUp()) {
      debug("connection tried to disconnect but was already at CLOSED state");
      return;
    }
    await new Promise((resolve, reject) => {
      connection.destroy((err) => {
        if (err) {
          console.error(`Unable to disconnect: ${err.message}`);
          reject(err);
        } else {
          console.error(`Disconnected connection with id: ${connection.getId()}`);
          resolve(connection.getId());
        }
      });
    });
  }
  validate(connection) {
    return connection.isUp();
  }
}
//# sourceMappingURL=connection-manager.js.map
