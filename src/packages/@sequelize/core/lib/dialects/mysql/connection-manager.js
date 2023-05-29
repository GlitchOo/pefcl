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
  MySqlConnectionManager: () => MySqlConnectionManager
});
module.exports = __toCommonJS(connection_manager_exports);
var import_node_assert = __toESM(require("node:assert"));
var import_node_util = require("node:util");
var import_dayjs = __toESM(require("dayjs"));
var import_errors = require("../../errors");
var import_check = require("../../utils/check.js");
var import_logger = require("../../utils/logger");
var import_connection_manager = require("../abstract/connection-manager");
const debug = import_logger.logger.debugContext("connection:mysql");
class MySqlConnectionManager extends import_connection_manager.AbstractConnectionManager {
  lib;
  constructor(dialect, sequelize) {
    super(dialect, sequelize);
    this.lib = this._loadDialectModule("mysql2");
  }
  #typecast(field, next) {
    const dataParser = this.dialect.getParserForDatabaseDataType(field.type);
    if (dataParser) {
      const value = dataParser(field);
      if (value !== void 0) {
        return value;
      }
    }
    return next();
  }
  /**
   * Connect with MySQL database based on config, Handle any errors in connection
   * Set the pool handlers on connection.error
   * Also set proper timezone once connection is connected.
   *
   * @param config
   * @returns
   * @private
   */
  async connect(config) {
    (0, import_node_assert.default)(typeof config.port === "number", "port has not been normalized");
    const connectionConfig = {
      bigNumberStrings: false,
      supportBigNumbers: true,
      flags: ["-FOUND_ROWS"],
      ...config.dialectOptions,
      ...config.host == null ? null : { host: config.host },
      port: config.port,
      ...config.username == null ? null : { user: config.username },
      ...config.password == null ? null : { password: config.password },
      ...config.database == null ? null : { database: config.database },
      ...!this.sequelize.options.timezone ? null : { timezone: this.sequelize.options.timezone },
      typeCast: (field, next) => this.#typecast(field, next)
    };
    try {
      const connection = await createConnection(this.lib, connectionConfig);
      debug("connection acquired");
      connection.on("error", (error) => {
        if (!(0, import_check.isNodeError)(error)) {
          return;
        }
        switch (error.code) {
          case "ESOCKET":
          case "ECONNRESET":
          case "EPIPE":
          case "PROTOCOL_CONNECTION_LOST":
            void this.pool.destroy(connection);
            break;
          default:
        }
      });
      if (!this.sequelize.config.keepDefaultTimezone && this.sequelize.options.timezone) {
        let tzOffset = this.sequelize.options.timezone;
        tzOffset = tzOffset.includes("/") ? import_dayjs.default.tz(void 0, tzOffset).format("Z") : tzOffset;
        await (0, import_node_util.promisify)((cb) => connection.query(`SET time_zone = '${tzOffset}'`, cb))();
      }
      return connection;
    } catch (error) {
      if (!(0, import_check.isError)(error)) {
        throw error;
      }
      const code = (0, import_check.isNodeError)(error) ? error.code : null;
      switch (code) {
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
    if (connection._closing) {
      debug("connection tried to disconnect but was already at CLOSED state");
      return;
    }
    await (0, import_node_util.promisify)((callback) => connection.end(callback))();
  }
  validate(connection) {
    return connection && !connection._fatalError && !connection._protocolError && !connection._closing && !connection.stream.destroyed;
  }
}
async function createConnection(lib, config) {
  return new Promise((resolve, reject) => {
    const connection = lib.createConnection(config);
    const errorHandler = (e) => {
      connection.removeListener("connect", connectHandler);
      connection.removeListener("error", connectHandler);
      reject(e);
    };
    const connectHandler = () => {
      connection.removeListener("error", errorHandler);
      resolve(connection);
    };
    connection.on("error", errorHandler);
    connection.once("connect", connectHandler);
  });
}
//# sourceMappingURL=connection-manager.js.map
