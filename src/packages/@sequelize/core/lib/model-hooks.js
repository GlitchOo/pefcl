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
var model_hooks_exports = {};
__export(model_hooks_exports, {
  staticModelHooks: () => staticModelHooks,
  validModelHooks: () => validModelHooks
});
module.exports = __toCommonJS(model_hooks_exports);
var import_hooks = require("./hooks.js");
const validModelHooks = [
  "beforeValidate",
  "afterValidate",
  "validationFailed",
  "beforeCreate",
  "afterCreate",
  "beforeDestroy",
  "afterDestroy",
  "beforeRestore",
  "afterRestore",
  "beforeUpdate",
  "afterUpdate",
  "beforeUpsert",
  "afterUpsert",
  "beforeSave",
  "afterSave",
  "beforeBulkCreate",
  "afterBulkCreate",
  "beforeBulkDestroy",
  "afterBulkDestroy",
  "beforeBulkRestore",
  "afterBulkRestore",
  "beforeBulkUpdate",
  "afterBulkUpdate",
  "beforeCount",
  "beforeFind",
  "beforeFindAfterExpandIncludeAll",
  "beforeFindAfterOptions",
  "afterFind",
  "beforeSync",
  "afterSync",
  "beforeAssociate",
  "afterAssociate",
  "beforeDefinitionRefresh",
  "afterDefinitionRefresh"
];
const staticModelHooks = new import_hooks.HookHandlerBuilder(validModelHooks, async (eventTarget, isAsync, hookName, args) => {
  const model = eventTarget;
  if (!model.sequelize) {
    throw new Error("Model must be initialized before running hooks on it.");
  }
  if (isAsync) {
    await model.sequelize.hooks.runAsync(hookName, ...args);
  } else {
    model.sequelize.hooks.runSync(hookName, ...args);
  }
});
//# sourceMappingURL=model-hooks.js.map
