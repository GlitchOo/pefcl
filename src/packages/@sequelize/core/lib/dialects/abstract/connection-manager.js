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
  AbstractConnectionManager: () => AbstractConnectionManager
});
module.exports = __toCommonJS(connection_manager_exports);
var import_cloneDeep = __toESM(require("lodash/cloneDeep"));
var import_semver = __toESM(require("semver"));
var import_sequelize_pool = require("sequelize-pool");
var import_errors = require("../../errors");
var import_check = require("../../utils/check.js");
var deprecations = __toESM(require("../../utils/deprecations"));
var import_logger = require("../../utils/logger");
var import_replication_pool = require("./replication-pool.js");
const debug = import_logger.logger.debugContext("connection-manager");
class AbstractConnectionManager {
  sequelize;
  config;
  dialect;
  dialectName;
  pool;
  #versionPromise = null;
  constructor(dialect, sequelize) {
    const config = (0, import_cloneDeep.default)(sequelize.config);
    this.sequelize = sequelize;
    this.config = config;
    this.dialect = dialect;
    this.dialectName = this.sequelize.options.dialect;
    this.pool = new import_replication_pool.ReplicationPool({
      ...config,
      connect: async (options) => {
        return this._connect(options);
      },
      disconnect: async (connection) => {
        return this._disconnect(connection);
      },
      validate: (connection) => {
        if (config.pool.validate) {
          return config.pool.validate(connection);
        }
        return this.validate(connection);
      },
      readConfig: config.replication.read,
      writeConfig: config.replication.write
    });
    if (config.replication.read.length > 0) {
      debug(`pool created with max/min: ${config.pool.max}/${config.pool.min}, no replication`);
    } else {
      debug(`pool created with max/min: ${config.pool.max}/${config.pool.min}, with replication`);
    }
  }
  /**
   * Determine if a connection is still valid or not
   *
   * @param _connection
   */
  validate(_connection) {
    return true;
  }
  async connect(_config) {
    throw new Error(`connect not implemented in ${this.constructor.name}`);
  }
  async disconnect(_connection) {
    throw new Error(`disconnect not implemented in ${this.constructor.name}`);
  }
  /**
   * Try to load dialect module from various configured options.
   * Priority goes like dialectModulePath > dialectModule > require(default)
   *
   * @param moduleName Name of dialect module to lookup
   *
   * @private
   */
  _loadDialectModule(moduleName) {
    try {
      if (this.sequelize.config.dialectModulePath) {
        return require(this.sequelize.config.dialectModulePath);
      }
      if (this.sequelize.config.dialectModule) {
        return this.sequelize.config.dialectModule;
      }
      return require(moduleName);
    } catch (error) {
      if ((0, import_check.isNodeError)(error) && error.code === "MODULE_NOT_FOUND") {
        if (this.sequelize.config.dialectModulePath) {
          throw new Error(`Unable to find dialect at ${this.sequelize.config.dialectModulePath}`);
        }
        throw new Error(`Please install ${moduleName} package manually`);
      }
      throw error;
    }
  }
  /**
   * Handler which executes on process exit or connection manager shutdown
   */
  async _onProcessExit() {
    if (!this.pool) {
      return;
    }
    await this.pool.drain();
    debug("connection drain due to process exit");
    await this.pool.destroyAllNow();
  }
  /**
   * Drain the pool and close it permanently
   */
  async close() {
    this.getConnection = async function getConnection() {
      throw new Error("ConnectionManager.getConnection was called after the connection manager was closed!");
    };
    return this._onProcessExit();
  }
  /**
   * Get connection from pool. It sets database version if it's not already set.
   * Call pool.acquire to get a connection.
   *
   * @param options
   */
  async getConnection(options) {
    await this._initDatabaseVersion();
    try {
      const result = await this.pool.acquire(options == null ? void 0 : options.type, options == null ? void 0 : options.useMaster);
      debug("connection acquired");
      return result;
    } catch (error) {
      if (error instanceof import_sequelize_pool.TimeoutError) {
        throw new import_errors.ConnectionAcquireTimeoutError(error);
      }
      throw error;
    }
  }
  async _initDatabaseVersion(conn) {
    if (this.sequelize.options.databaseVersion != null) {
      return;
    }
    if (this.#versionPromise) {
      await this.#versionPromise;
      return;
    }
    this.#versionPromise = (async () => {
      var _a;
      try {
        const connection = conn ?? await this._connect(this.config.replication.write || this.config);
        const options = {
          logging: () => {
          },
          // TODO: add "connection" parameter to QueryRawOptions? Would require a way to reuse the same connection without it going back in the pool,
          //  something like sequelize.session(connection => {}).
          //  this would help for SET SESSION queries, like in https://github.com/sequelize/sequelize/discussions/15377
          // @ts-expect-error -- HACK: Cheat .query to use our private connection
          transaction: { connection }
        };
        const version = await this.sequelize.fetchDatabaseVersion(options);
        const parsedVersion = ((_a = import_semver.default.coerce(version)) == null ? void 0 : _a.version) || version;
        this.sequelize.options.databaseVersion = import_semver.default.valid(parsedVersion) ? parsedVersion : this.dialect.defaultVersion;
        if (import_semver.default.lt(this.sequelize.getDatabaseVersion(), this.dialect.defaultVersion)) {
          deprecations.unsupportedEngine();
          debug(`Unsupported database engine version ${this.sequelize.getDatabaseVersion()}`);
        }
        return await this._disconnect(connection);
      } finally {
        this.#versionPromise = null;
      }
    })();
    await this.#versionPromise;
  }
  /**
   * Release a pooled connection so it can be utilized by other connection requests
   *
   * @param connection
   */
  releaseConnection(connection) {
    this.pool.release(connection);
    debug("connection released");
  }
  /**
   * Destroys a pooled connection and removes it from the pool.
   *
   * @param connection
   */
  async destroyConnection(connection) {
    await this.pool.destroy(connection);
    debug(`connection ${connection.uuid} destroyed`);
  }
  /**
   * Call dialect library to get connection
   *
   * @param config Connection config
   */
  async _connect(config) {
    await this.sequelize.hooks.runAsync("beforeConnect", config);
    const connection = await this.connect(config);
    await this.sequelize.hooks.runAsync("afterConnect", connection, config);
    return connection;
  }
  /**
   * Call dialect library to disconnect a connection
   *
   * @param connection
   */
  async _disconnect(connection) {
    await this.sequelize.hooks.runAsync("beforeDisconnect", connection);
    await this.disconnect(connection);
    await this.sequelize.hooks.runAsync("afterDisconnect", connection);
  }
}
//# sourceMappingURL=connection-manager.js.map
