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
var transaction_exports = {};
__export(transaction_exports, {
  ISOLATION_LEVELS: () => ISOLATION_LEVELS,
  LOCK: () => LOCK,
  TRANSACTION_TYPES: () => TRANSACTION_TYPES,
  Transaction: () => Transaction
});
module.exports = __toCommonJS(transaction_exports);
var import_node_assert = __toESM(require("node:assert"));
class Transaction {
  sequelize;
  _afterCommitHooks = /* @__PURE__ */ new Set();
  savepoints = [];
  options;
  parent;
  id;
  name;
  finished;
  connection;
  /**
   * Creates a new transaction instance
   *
   * @param sequelize A configured sequelize Instance
   * @param options An object with options
   * @param [options.type] Sets the type of the transaction. Sqlite only
   * @param [options.isolationLevel] Sets the isolation level of the transaction.
   * @param [options.deferrable] Sets the constraints to be deferred or immediately checked. PostgreSQL only
   */
  constructor(sequelize, options) {
    this.sequelize = sequelize;
    const generateTransactionId = this.sequelize.dialect.queryGenerator.generateTransactionId;
    this.options = {
      type: sequelize.options.transactionType,
      isolationLevel: sequelize.options.isolationLevel,
      readOnly: false,
      ...options
    };
    this.parent = this.options.transaction ?? null;
    if (this.parent) {
      this.id = this.parent.id;
      this.parent.savepoints.push(this);
      this.name = `${this.id}-sp-${this.parent.savepoints.length}`;
    } else {
      const id = generateTransactionId();
      this.id = id;
      this.name = id;
    }
    delete this.options.transaction;
  }
  /**
   * Commit the transaction.
   */
  async commit() {
    if (this.finished) {
      throw new Error(`Transaction cannot be committed because it has been finished with state: ${this.finished}`);
    }
    try {
      await this.sequelize.getQueryInterface().commitTransaction(this, this.options);
      for (const hook of this._afterCommitHooks) {
        await Reflect.apply(hook, this, [this]);
      }
      this.cleanup();
    } catch (error) {
      console.warn(`Committing transaction ${this.id} failed with error ${error instanceof Error ? JSON.stringify(error.message) : String(error)}. We are killing its connection as it is now in an undetermined state.`);
      await this.forceCleanup();
      throw error;
    } finally {
      this.finished = "commit";
    }
  }
  /**
   * Rollback (abort) the transaction
   */
  async rollback() {
    if (this.finished) {
      throw new Error(`Transaction cannot be rolled back because it has been finished with state: ${this.finished}`);
    }
    if (!this.connection) {
      throw new Error("Transaction cannot be rolled back because it never started");
    }
    try {
      await this.sequelize.getQueryInterface().rollbackTransaction(this, this.options);
      this.cleanup();
    } catch (error) {
      console.warn(`Rolling back transaction ${this.id} failed with error ${error instanceof Error ? JSON.stringify(error.message) : String(error)}. We are killing its connection as it is now in an undetermined state.`);
      await this.forceCleanup();
      throw error;
    }
  }
  /**
   * Called to acquire a connection to use and set the correct options on the connection.
   * We should ensure all the environment that's set up is cleaned up in `cleanup()` below.
   */
  async prepareEnvironment() {
    let connection;
    if (this.parent) {
      connection = this.parent.connection;
    } else {
      connection = await this.sequelize.connectionManager.getConnection({
        type: this.options.readOnly ? "read" : "write",
        uuid: this.id
      });
    }
    (0, import_node_assert.default)(connection != null, "Transaction failed to acquire Connection.");
    connection.uuid = this.id;
    this.connection = connection;
    let result;
    try {
      await this.begin();
      result = await this.setDeferrable();
    } catch (error) {
      try {
        await this.rollback();
      } finally {
        throw error;
      }
    }
    return result;
  }
  async setDeferrable() {
    if (this.options.deferrable) {
      await this.sequelize.getQueryInterface().deferConstraints(this, this.options);
    }
  }
  async begin() {
    const queryInterface = this.sequelize.getQueryInterface();
    if (this.sequelize.dialect.supports.settingIsolationLevelDuringTransaction) {
      await queryInterface.startTransaction(this, this.options);
      return queryInterface.setIsolationLevel(this, this.options.isolationLevel, this.options);
    }
    await queryInterface.setIsolationLevel(this, this.options.isolationLevel, this.options);
    return queryInterface.startTransaction(this, this.options);
  }
  cleanup() {
    var _a;
    if (this.parent || ((_a = this.connection) == null ? void 0 : _a.uuid) === void 0) {
      return;
    }
    this.sequelize.connectionManager.releaseConnection(this.connection);
    this.connection.uuid = void 0;
  }
  /**
   * Kills the connection this transaction uses.
   * Used as a last resort, for instance because COMMIT or ROLLBACK resulted in an error
   * and the transaction is left in a broken state,
   * and releasing the connection to the pool would be dangerous.
   */
  async forceCleanup() {
    var _a;
    if (this.parent || ((_a = this.connection) == null ? void 0 : _a.uuid) === void 0) {
      return;
    }
    await this.sequelize.connectionManager.destroyConnection(this.connection);
    this.connection.uuid = void 0;
  }
  /**
   * Adds a hook that is run after a transaction is committed.
   *
   * @param fn   A callback function that is called with the committed transaction
   * @name afterCommit
   * @memberof Sequelize.Transaction
   */
  afterCommit(fn) {
    if (typeof fn !== "function") {
      throw new TypeError('"fn" must be a function');
    }
    this._afterCommitHooks.add(fn);
    return this;
  }
  /**
   * Types can be set per-transaction by passing `options.type` to `sequelize.transaction`.
   * Default to `DEFERRED` but you can override the default type by passing `options.transactionType` in `new Sequelize`.
   * Sqlite only.
   *
   * Pass in the desired level as the first argument:
   *
   * @example
   * try {
   *   await sequelize.transaction({ type: Sequelize.Transaction.TYPES.EXCLUSIVE }, transaction => {
   *      // your transactions
   *   });
   *   // transaction has been committed. Do something after the commit if required.
   * } catch(err) {
   *   // do something with the err.
   * }
   *
   * @property DEFERRED
   * @property IMMEDIATE
   * @property EXCLUSIVE
   */
  static get TYPES() {
    return TRANSACTION_TYPES;
  }
  /**
   * Isolation levels can be set per-transaction by passing `options.isolationLevel` to `sequelize.transaction`.
   * Sequelize uses the default isolation level of the database, you can override this by passing `options.isolationLevel` in Sequelize constructor options.
   *
   * Pass in the desired level as the first argument:
   *
   * @example
   * try {
   *   const result = await sequelize.transaction({isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, transaction => {
   *     // your transactions
   *   });
   *   // transaction has been committed. Do something after the commit if required.
   * } catch(err) {
   *   // do something with the err.
   * }
   *
   * @property READ_UNCOMMITTED
   * @property READ_COMMITTED
   * @property REPEATABLE_READ
   * @property SERIALIZABLE
   */
  static get ISOLATION_LEVELS() {
    return ISOLATION_LEVELS;
  }
  /**
   * Possible options for row locking. Used in conjunction with `find` calls:
   *
   * @example
   * // t1 is a transaction
   * Model.findAll({
   *   where: ...,
   *   transaction: t1,
   *   lock: t1.LOCK...
   * });
   *
   * @example Postgres also supports specific locks while eager loading by using OF:
   * ```ts
   * UserModel.findAll({
   *   where: ...,
   *   include: [TaskModel, ...],
   *   transaction: t1,
   *   lock: {
   *     level: t1.LOCK...,
   *     of: UserModel
   *   }
   * });
   * ```
   *
   * UserModel will be locked but TaskModel won't!
   *
   * @example You can also skip locked rows:
   * ```ts
   * // t1 is a transaction
   * Model.findAll({
   *   where: ...,
   *   transaction: t1,
   *   lock: true,
   *   skipLocked: true
   * });
   * ```
   *
   * The query will now return any rows that aren't locked by another transaction
   *
   * @returns possible options for row locking
   * @property UPDATE
   * @property SHARE
   * @property KEY_SHARE Postgres 9.3+ only
   * @property NO_KEY_UPDATE Postgres 9.3+ only
   */
  static get LOCK() {
    return LOCK;
  }
  /**
   * Same as {@link Transaction.LOCK}, but can also be called on instances of
   * transactions to get possible options for row locking directly from the
   * instance.
   */
  get LOCK() {
    return LOCK;
  }
}
var ISOLATION_LEVELS = /* @__PURE__ */ ((ISOLATION_LEVELS2) => {
  ISOLATION_LEVELS2["READ_UNCOMMITTED"] = "READ UNCOMMITTED";
  ISOLATION_LEVELS2["READ_COMMITTED"] = "READ COMMITTED";
  ISOLATION_LEVELS2["REPEATABLE_READ"] = "REPEATABLE READ";
  ISOLATION_LEVELS2["SERIALIZABLE"] = "SERIALIZABLE";
  return ISOLATION_LEVELS2;
})(ISOLATION_LEVELS || {});
var TRANSACTION_TYPES = /* @__PURE__ */ ((TRANSACTION_TYPES2) => {
  TRANSACTION_TYPES2["DEFERRED"] = "DEFERRED";
  TRANSACTION_TYPES2["IMMEDIATE"] = "IMMEDIATE";
  TRANSACTION_TYPES2["EXCLUSIVE"] = "EXCLUSIVE";
  return TRANSACTION_TYPES2;
})(TRANSACTION_TYPES || {});
var LOCK = /* @__PURE__ */ ((LOCK2) => {
  LOCK2["UPDATE"] = "UPDATE";
  LOCK2["SHARE"] = "SHARE";
  LOCK2["KEY_SHARE"] = "KEY SHARE";
  LOCK2["NO_KEY_UPDATE"] = "NO KEY UPDATE";
  return LOCK2;
})(LOCK || {});
//# sourceMappingURL=transaction.js.map
