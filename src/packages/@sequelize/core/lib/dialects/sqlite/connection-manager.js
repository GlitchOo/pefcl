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
  SqliteConnectionManager: () => SqliteConnectionManager
});
module.exports = __toCommonJS(connection_manager_exports);
var import_node_fs = __toESM(require("node:fs"));
var import_node_path = __toESM(require("node:path"));
var import_node_util = require("node:util");
var import_errors = require("../../errors/index.js");
var import_iterators = require("../../utils/iterators.js");
var import_logger = require("../../utils/logger");
var import_connection_manager = require("../abstract/connection-manager");
const debug = import_logger.logger.debugContext("connection:sqlite");
class SqliteConnectionManager extends import_connection_manager.AbstractConnectionManager {
  lib;
  connections = /* @__PURE__ */ new Map();
  constructor(dialect, sequelize) {
    super(dialect, sequelize);
    if (this.sequelize.options.host === "localhost") {
      delete this.sequelize.options.host;
    }
    this.lib = this._loadDialectModule("sqlite3");
  }
  async _onProcessExit() {
    await Promise.all(
      (0, import_iterators.map)(this.connections.values(), async (connection) => {
        return (0, import_node_util.promisify)(connection.close.bind(connection))();
      })
    );
    return super._onProcessExit();
  }
  async getConnection(options) {
    var _a;
    const connectionUuid = options.uuid || "default";
    const storage = this.sequelize.options.storage ?? this.sequelize.options.host ?? ":memory:";
    const inMemory = storage === ":memory:";
    const defaultReadWriteMode = this.lib.OPEN_READWRITE | this.lib.OPEN_CREATE;
    const readWriteMode = ((_a = this.sequelize.options.dialectOptions) == null ? void 0 : _a.mode) || defaultReadWriteMode;
    const connectionCacheKey = inMemory ? ":memory:" : connectionUuid;
    if (this.connections.has(connectionCacheKey)) {
      return this.connections.get(connectionCacheKey);
    }
    if (!inMemory && (readWriteMode & this.lib.OPEN_CREATE) !== 0) {
      import_node_fs.default.mkdirSync(import_node_path.default.dirname(storage), { recursive: true });
    }
    const connection = await new Promise((resolve, reject) => {
      const connectionInstance = new this.lib.Database(
        storage,
        readWriteMode,
        (err) => {
          if (err) {
            return void reject(new import_errors.ConnectionError(err));
          }
          debug(`connection acquired ${connectionUuid}`);
          resolve(connectionInstance);
        }
      );
      this.connections.set(connectionCacheKey, connectionInstance);
    });
    await this._initDatabaseVersion(connection);
    if (this.sequelize.config.password) {
      connection.run(`PRAGMA KEY=${this.sequelize.escape(this.sequelize.config.password)}`);
    }
    if (this.sequelize.options.foreignKeys !== false) {
      connection.run("PRAGMA FOREIGN_KEYS=ON");
    }
    return connection;
  }
  async disconnect(_connection) {
  }
  async releaseConnection(connection, force) {
    if (connection.filename === ":memory:" && force !== true) {
      return;
    }
    if (connection.uuid) {
      connection.close();
      debug(`connection released ${connection.uuid}`);
      this.connections.delete(connection.uuid);
    }
  }
}
//# sourceMappingURL=connection-manager.js.map
