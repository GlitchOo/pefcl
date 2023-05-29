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
  MariaDbConnectionManager: () => MariaDbConnectionManager
});
module.exports = __toCommonJS(connection_manager_exports);
var import_dayjs = __toESM(require("dayjs"));
var import_semver = __toESM(require("semver"));
var import_errors = require("../../errors/index.js");
var import_check = require("../../utils/check.js");
var import_logger = require("../../utils/logger");
var import_object = require("../../utils/object.js");
var import_connection_manager = require("../abstract/connection-manager");
const debug = import_logger.logger.debugContext("connection:mariadb");
class MariaDbConnectionManager extends import_connection_manager.AbstractConnectionManager {
  lib;
  constructor(dialect, sequelize) {
    super(dialect, sequelize);
    this.lib = this._loadDialectModule("mariadb");
  }
  #typeCast(field, next) {
    const parser = this.dialect.getParserForDatabaseDataType(field.type);
    if (parser) {
      return parser(field);
    }
    return next();
  }
  /**
   * Connect with MariaDB database based on config, Handle any errors in connection
   * Set the pool handlers on connection.error
   * Also set proper timezone once connection is connected.
   *
   * @param config
   * @returns
   * @private
   */
  async connect(config) {
    let tzOffset = this.sequelize.options.timezone;
    tzOffset = tzOffset.includes("/") ? import_dayjs.default.tz(void 0, tzOffset).format("Z") : tzOffset;
    const connectionConfig = (0, import_object.removeUndefined)({
      host: config.host,
      port: config.port ? Number(config.port) : void 0,
      user: config.username,
      password: config.password,
      database: config.database,
      timezone: tzOffset,
      bigNumberStrings: false,
      supportBigNumbers: true,
      foundRows: false,
      ...config.dialectOptions,
      typeCast: (field, next) => this.#typeCast(field, next)
    });
    if (!this.sequelize.config.keepDefaultTimezone) {
      if (connectionConfig.initSql) {
        if (!Array.isArray(
          connectionConfig.initSql
        )) {
          connectionConfig.initSql = [connectionConfig.initSql];
        }
        connectionConfig.initSql.push(`SET time_zone = '${tzOffset}'`);
      } else {
        connectionConfig.initSql = `SET time_zone = '${tzOffset}'`;
      }
    }
    try {
      const connection = await this.lib.createConnection(connectionConfig);
      this.sequelize.options.databaseVersion = import_semver.default.coerce(connection.serverVersion()).version;
      debug("connection acquired");
      connection.on("error", (error) => {
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
      return connection;
    } catch (error) {
      if (!(0, import_check.isErrorWithStringCode)(error)) {
        throw error;
      }
      switch (error.code) {
        case "ECONNREFUSED":
          throw new import_errors.ConnectionRefusedError(error);
        case "ER_ACCESS_DENIED_ERROR":
        case "ER_ACCESS_DENIED_NO_PASSWORD_ERROR":
          throw new import_errors.AccessDeniedError(error);
        case "ENOTFOUND":
          throw new import_errors.HostNotFoundError(error);
        case "EHOSTUNREACH":
        case "ENETUNREACH":
        case "EADDRNOTAVAIL":
          throw new import_errors.HostNotReachableError(error);
        case "EINVAL":
          throw new import_errors.InvalidConnectionError(error);
        default:
          throw new import_errors.ConnectionError(error);
      }
    }
  }
  async disconnect(connection) {
    if (!connection.isValid()) {
      debug("connection tried to disconnect but was already at CLOSED state");
      return;
    }
    await connection.end();
  }
  validate(connection) {
    return connection && connection.isValid();
  }
}
//# sourceMappingURL=connection-manager.js.map
