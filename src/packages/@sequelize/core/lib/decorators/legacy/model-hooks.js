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
var model_hooks_exports = {};
__export(model_hooks_exports, {
  AfterAssociate: () => AfterAssociate,
  AfterBulkCreate: () => AfterBulkCreate,
  AfterBulkDestroy: () => AfterBulkDestroy,
  AfterBulkRestore: () => AfterBulkRestore,
  AfterBulkUpdate: () => AfterBulkUpdate,
  AfterCreate: () => AfterCreate,
  AfterDefinitionRefresh: () => AfterDefinitionRefresh,
  AfterDestroy: () => AfterDestroy,
  AfterFind: () => AfterFind,
  AfterRestore: () => AfterRestore,
  AfterSave: () => AfterSave,
  AfterSync: () => AfterSync,
  AfterUpdate: () => AfterUpdate,
  AfterUpsert: () => AfterUpsert,
  AfterValidate: () => AfterValidate,
  BeforeAssociate: () => BeforeAssociate,
  BeforeBulkCreate: () => BeforeBulkCreate,
  BeforeBulkDestroy: () => BeforeBulkDestroy,
  BeforeBulkRestore: () => BeforeBulkRestore,
  BeforeBulkUpdate: () => BeforeBulkUpdate,
  BeforeCount: () => BeforeCount,
  BeforeCreate: () => BeforeCreate,
  BeforeDefinitionRefresh: () => BeforeDefinitionRefresh,
  BeforeDestroy: () => BeforeDestroy,
  BeforeFind: () => BeforeFind,
  BeforeFindAfterExpandIncludeAll: () => BeforeFindAfterExpandIncludeAll,
  BeforeFindAfterOptions: () => BeforeFindAfterOptions,
  BeforeRestore: () => BeforeRestore,
  BeforeSave: () => BeforeSave,
  BeforeSync: () => BeforeSync,
  BeforeUpdate: () => BeforeUpdate,
  BeforeUpsert: () => BeforeUpsert,
  BeforeValidate: () => BeforeValidate,
  ValidationFailed: () => ValidationFailed
});
module.exports = __toCommonJS(model_hooks_exports);
var import_upperFirst = __toESM(require("lodash/upperFirst.js"));
var import_model = require("../../model.js");
var import_model_utils = require("../../utils/model-utils.js");
var import_model2 = require("../shared/model.js");
var import_decorator_utils = require("./decorator-utils.js");
function createHookDecorator(hookType) {
  return (0, import_decorator_utils.createOptionallyParameterizedPropertyDecorator)(
    (0, import_upperFirst.default)(hookType),
    void 0,
    (options, targetModel, methodName) => {
      if (typeof targetModel !== "function") {
        (0, import_decorator_utils.throwMustBeStaticProperty)((0, import_upperFirst.default)(hookType), targetModel, methodName);
      }
      if (!(0, import_model_utils.isModelStatic)(targetModel)) {
        (0, import_decorator_utils.throwMustBeModel)((0, import_upperFirst.default)(hookType), targetModel, methodName);
      }
      const targetMethod = targetModel[methodName];
      if (typeof targetMethod !== "function") {
        (0, import_decorator_utils.throwMustBeMethod)((0, import_upperFirst.default)(hookType), targetModel, methodName);
      }
      if (methodName in import_model.Model) {
        throw new Error(
          `Decorator @${(0, import_upperFirst.default)(hookType)} has been used on "${targetModel.name}.${String(methodName)}", but method ${JSON.stringify(methodName)} already exists on the base Model class and replacing it can lead to issues.`
        );
      }
      const callback = targetMethod.bind(targetModel);
      (0, import_model2.registerModelOptions)(targetModel, {
        hooks: {
          [hookType]: (options == null ? void 0 : options.name) ? { name: options == null ? void 0 : options.name, callback } : callback
        }
      });
    }
  );
}
const BeforeBulkCreate = createHookDecorator("beforeBulkCreate");
const AfterBulkCreate = createHookDecorator("afterBulkCreate");
const BeforeBulkDestroy = createHookDecorator("beforeBulkDestroy");
const AfterBulkDestroy = createHookDecorator("afterBulkDestroy");
const BeforeBulkRestore = createHookDecorator("beforeBulkRestore");
const AfterBulkRestore = createHookDecorator("afterBulkRestore");
const BeforeBulkUpdate = createHookDecorator("beforeBulkUpdate");
const AfterBulkUpdate = createHookDecorator("afterBulkUpdate");
const BeforeAssociate = createHookDecorator("beforeAssociate");
const AfterAssociate = createHookDecorator("afterAssociate");
const BeforeCount = createHookDecorator("beforeCount");
const BeforeCreate = createHookDecorator("beforeCreate");
const AfterCreate = createHookDecorator("afterCreate");
const BeforeDestroy = createHookDecorator("beforeDestroy");
const AfterDestroy = createHookDecorator("afterDestroy");
const BeforeFind = createHookDecorator("beforeFind");
const BeforeFindAfterExpandIncludeAll = createHookDecorator("beforeFindAfterExpandIncludeAll");
const BeforeFindAfterOptions = createHookDecorator("beforeFindAfterOptions");
const AfterFind = createHookDecorator("afterFind");
const BeforeRestore = createHookDecorator("beforeRestore");
const AfterRestore = createHookDecorator("afterRestore");
const BeforeSave = createHookDecorator("beforeSave");
const AfterSave = createHookDecorator("afterSave");
const BeforeSync = createHookDecorator("beforeSync");
const AfterSync = createHookDecorator("afterSync");
const BeforeUpdate = createHookDecorator("beforeUpdate");
const AfterUpdate = createHookDecorator("afterUpdate");
const BeforeUpsert = createHookDecorator("beforeUpsert");
const AfterUpsert = createHookDecorator("afterUpsert");
const BeforeValidate = createHookDecorator("beforeValidate");
const AfterValidate = createHookDecorator("afterValidate");
const ValidationFailed = createHookDecorator("validationFailed");
const BeforeDefinitionRefresh = createHookDecorator("beforeDefinitionRefresh");
const AfterDefinitionRefresh = createHookDecorator("afterDefinitionRefresh");
//# sourceMappingURL=model-hooks.js.map
