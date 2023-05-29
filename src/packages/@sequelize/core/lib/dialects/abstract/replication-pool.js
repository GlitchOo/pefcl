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
var replication_pool_exports = {};
__export(replication_pool_exports, {
  ReplicationPool: () => ReplicationPool
});
module.exports = __toCommonJS(replication_pool_exports);
var import_sequelize_pool = require("sequelize-pool");
var import_logger = require("../../utils/logger.js");
const debug = import_logger.logger.debugContext("pool");
const owningPools = /* @__PURE__ */ new WeakMap();
class ReplicationPool {
  /**
   * Replication read pool. Will only be used if the 'read' replication option has been provided,
   * otherwise the {@link write} will be used instead.
   */
  read;
  write;
  constructor(config) {
    const { connect, disconnect, validate, readConfig, writeConfig } = config;
    if (!readConfig || readConfig.length === 0) {
      this.read = null;
    } else {
      let reads = 0;
      this.read = new import_sequelize_pool.Pool({
        name: "sequelize:read",
        create: async () => {
          const nextRead = reads++ % readConfig.length;
          const connection = await connect(readConfig[nextRead]);
          owningPools.set(connection, "read");
          return connection;
        },
        destroy: disconnect,
        validate,
        max: config.pool.max,
        min: config.pool.min,
        acquireTimeoutMillis: config.pool.acquire,
        idleTimeoutMillis: config.pool.idle,
        reapIntervalMillis: config.pool.evict,
        maxUses: config.pool.maxUses
      });
    }
    this.write = new import_sequelize_pool.Pool({
      name: "sequelize:write",
      create: async () => {
        const connection = await connect(writeConfig);
        owningPools.set(connection, "write");
        return connection;
      },
      destroy: disconnect,
      validate,
      max: config.pool.max,
      min: config.pool.min,
      acquireTimeoutMillis: config.pool.acquire,
      idleTimeoutMillis: config.pool.idle,
      reapIntervalMillis: config.pool.evict,
      maxUses: config.pool.maxUses
    });
  }
  async acquire(queryType = "write", useMaster = false) {
    if (queryType !== "read" && queryType !== "write") {
      throw new Error(`Expected queryType to be either read or write. Received ${queryType}`);
    }
    if (this.read != null && queryType === "read" && !useMaster) {
      return this.read.acquire();
    }
    return this.write.acquire();
  }
  release(client) {
    const connectionType = owningPools.get(client);
    if (!connectionType) {
      throw new Error("Unable to determine to which pool the connection belongs");
    }
    this.getPool(connectionType).release(client);
  }
  async destroy(client) {
    const connectionType = owningPools.get(client);
    if (!connectionType) {
      throw new Error("Unable to determine to which pool the connection belongs");
    }
    await this.getPool(connectionType).destroy(client);
    debug("connection destroy");
  }
  async destroyAllNow() {
    var _a;
    await Promise.all([
      (_a = this.read) == null ? void 0 : _a.destroyAllNow(),
      this.write.destroyAllNow()
    ]);
    debug("all connections destroyed");
  }
  async drain() {
    var _a;
    await Promise.all([
      this.write.drain(),
      (_a = this.read) == null ? void 0 : _a.drain()
    ]);
  }
  getPool(poolType) {
    if (poolType === "read" && this.read != null) {
      return this.read;
    }
    return this.write;
  }
  get size() {
    var _a;
    return (((_a = this.read) == null ? void 0 : _a.size) ?? 0) + this.write.size;
  }
  get available() {
    var _a;
    return (((_a = this.read) == null ? void 0 : _a.available) ?? 0) + this.write.available;
  }
  get using() {
    var _a;
    return (((_a = this.read) == null ? void 0 : _a.using) ?? 0) + this.write.using;
  }
  get waiting() {
    var _a;
    return (((_a = this.read) == null ? void 0 : _a.waiting) ?? 0) + this.write.waiting;
  }
}
//# sourceMappingURL=replication-pool.js.map
