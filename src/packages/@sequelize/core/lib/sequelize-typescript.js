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
var sequelize_typescript_exports = {};
__export(sequelize_typescript_exports, {
  SequelizeTypeScript: () => SequelizeTypeScript
});
module.exports = __toCommonJS(sequelize_typescript_exports);
var import_node_async_hooks = require("node:async_hooks");
var import_associations = require("./decorators/legacy/associations.js");
var import_model = require("./decorators/shared/model.js");
var import_hooks_legacy = require("./hooks-legacy.js");
var import_hooks = require("./hooks.js");
var import_model_hooks = require("./model-hooks.js");
var import_transaction = require("./transaction.js");
const staticSequelizeHooks = new import_hooks.HookHandlerBuilder([
  "beforeInit",
  "afterInit"
]);
const instanceSequelizeHooks = new import_hooks.HookHandlerBuilder([
  "beforeQuery",
  "afterQuery",
  "beforeBulkSync",
  "afterBulkSync",
  "beforeConnect",
  "afterConnect",
  "beforeDisconnect",
  "afterDisconnect",
  "beforeDefine",
  "afterDefine",
  ...import_model_hooks.validModelHooks
]);
class SequelizeTypeScript {
  static get hooks() {
    return staticSequelizeHooks.getFor(this);
  }
  static addHook = (0, import_hooks_legacy.legacyBuildAddAnyHook)(staticSequelizeHooks);
  static removeHook = (0, import_hooks_legacy.legacyBuildRemoveHook)(staticSequelizeHooks);
  static hasHook = (0, import_hooks_legacy.legacyBuildHasHook)(staticSequelizeHooks);
  static hasHooks = (0, import_hooks_legacy.legacyBuildHasHook)(staticSequelizeHooks);
  static runHooks = (0, import_hooks_legacy.legacyBuildRunHook)(staticSequelizeHooks);
  static beforeInit = (0, import_hooks_legacy.legacyBuildAddHook)(staticSequelizeHooks, "beforeInit");
  static afterInit = (0, import_hooks_legacy.legacyBuildAddHook)(staticSequelizeHooks, "afterInit");
  get hooks() {
    return instanceSequelizeHooks.getFor(this);
  }
  addHook = (0, import_hooks_legacy.legacyBuildAddAnyHook)(instanceSequelizeHooks);
  removeHook = (0, import_hooks_legacy.legacyBuildRemoveHook)(instanceSequelizeHooks);
  hasHook = (0, import_hooks_legacy.legacyBuildHasHook)(instanceSequelizeHooks);
  hasHooks = (0, import_hooks_legacy.legacyBuildHasHook)(instanceSequelizeHooks);
  runHooks = (0, import_hooks_legacy.legacyBuildRunHook)(instanceSequelizeHooks);
  beforeQuery = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "beforeQuery");
  afterQuery = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "afterQuery");
  beforeBulkSync = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "beforeBulkSync");
  afterBulkSync = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "afterBulkSync");
  beforeConnect = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "beforeConnect");
  afterConnect = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "afterConnect");
  beforeDisconnect = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "beforeDisconnect");
  afterDisconnect = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "afterDisconnect");
  beforeDefine = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "beforeDefine");
  afterDefine = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "afterDefine");
  beforeValidate = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "beforeValidate");
  afterValidate = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "afterValidate");
  validationFailed = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "validationFailed");
  beforeCreate = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "beforeCreate");
  afterCreate = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "afterCreate");
  beforeDestroy = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "beforeDestroy");
  afterDestroy = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "afterDestroy");
  beforeRestore = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "beforeRestore");
  afterRestore = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "afterRestore");
  beforeUpdate = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "beforeUpdate");
  afterUpdate = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "afterUpdate");
  beforeUpsert = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "beforeUpsert");
  afterUpsert = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "afterUpsert");
  beforeSave = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "beforeSave");
  afterSave = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "afterSave");
  beforeBulkCreate = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "beforeBulkCreate");
  afterBulkCreate = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "afterBulkCreate");
  beforeBulkDestroy = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "beforeBulkDestroy");
  afterBulkDestroy = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "afterBulkDestroy");
  beforeBulkRestore = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "beforeBulkRestore");
  afterBulkRestore = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "afterBulkRestore");
  beforeBulkUpdate = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "beforeBulkUpdate");
  afterBulkUpdate = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "afterBulkUpdate");
  beforeCount = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "beforeCount");
  beforeFind = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "beforeFind");
  beforeFindAfterExpandIncludeAll = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "beforeFindAfterExpandIncludeAll");
  beforeFindAfterOptions = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "beforeFindAfterOptions");
  afterFind = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "afterFind");
  beforeSync = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "beforeSync");
  afterSync = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "afterSync");
  beforeAssociate = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "beforeAssociate");
  afterAssociate = (0, import_hooks_legacy.legacyBuildAddHook)(instanceSequelizeHooks, "afterAssociate");
  #transactionCls;
  _setupTransactionCls() {
    this.#transactionCls = new import_node_async_hooks.AsyncLocalStorage();
  }
  addModels(models) {
    for (const model of models) {
      (0, import_model.initDecoratedModel)(
        model,
        // @ts-expect-error -- remove once this class has been merged back with the Sequelize class
        this
      );
    }
    for (const model of models) {
      (0, import_associations.initDecoratedAssociations)(
        model,
        // @ts-expect-error -- remove once this class has been merged back with the Sequelize class
        this
      );
    }
  }
  /**
   * Returns the transaction that is associated to the current asynchronous operation.
   * This method returns undefined if no transaction is active in the current asynchronous operation,
   * or if {@link Options.disableClsTransactions} is true.
   */
  getCurrentClsTransaction() {
    var _a;
    return (_a = this.#transactionCls) == null ? void 0 : _a.getStore();
  }
  async transaction(optionsOrCallback, maybeCallback) {
    let options;
    let callback;
    if (typeof optionsOrCallback === "function") {
      callback = optionsOrCallback;
      options = {};
    } else {
      callback = maybeCallback;
      options = optionsOrCallback;
    }
    if (!callback) {
      throw new Error("sequelize.transaction requires a callback. If you wish to start an unmanaged transaction, please use sequelize.startUnmanagedTransaction instead");
    }
    const transaction = new import_transaction.Transaction(
      // @ts-expect-error -- remove once this class has been merged back with the Sequelize class
      this,
      options
    );
    const wrappedCallback = async () => {
      await transaction.prepareEnvironment();
      let result;
      try {
        result = await callback(transaction);
      } catch (error) {
        try {
          await transaction.rollback();
        } catch {
        }
        throw error;
      }
      await transaction.commit();
      return result;
    };
    const cls = this.#transactionCls;
    if (!cls) {
      return wrappedCallback();
    }
    return cls.run(transaction, wrappedCallback);
  }
  /**
   * We highly recommend using {@link Sequelize#transaction} instead.
   * If you really want to use the manual solution, don't forget to commit or rollback your transaction once you are done with it.
   *
   * Transactions started by this method are not automatically passed to queries. You must pass the transaction object manually,
   * even if {@link Options.disableClsTransactions} is false.
   *
   * @example
   * ```ts
   * try {
   *   const transaction = await sequelize.startUnmanagedTransaction();
   *   const user = await User.findOne(..., { transaction });
   *   await user.update(..., { transaction });
   *   await transaction.commit();
   * } catch(err) {
   *   await transaction.rollback();
   * }
   * ```
   *
   * @param options
   */
  async startUnmanagedTransaction(options) {
    const transaction = new import_transaction.Transaction(
      // @ts-expect-error -- remove once this class has been merged back with the Sequelize class
      this,
      options
    );
    await transaction.prepareEnvironment();
    return transaction;
  }
}
//# sourceMappingURL=sequelize-typescript.js.map
