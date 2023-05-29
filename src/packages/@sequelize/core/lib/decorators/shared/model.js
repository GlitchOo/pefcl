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
var model_exports = {};
__export(model_exports, {
  initDecoratedModel: () => initDecoratedModel,
  isDecoratedModel: () => isDecoratedModel,
  registerModelAttributeOptions: () => registerModelAttributeOptions,
  registerModelOptions: () => registerModelOptions
});
module.exports = __toCommonJS(model_exports);
var import_model_definition = require("../../model-definition.js");
var import_model_typescript = require("../../model-typescript.js");
var import_object = require("../../utils/object.js");
const registeredOptions = /* @__PURE__ */ new WeakMap();
function registerModelOptions(model, options) {
  if (!registeredOptions.has(model)) {
    registeredOptions.set(model, { model: options, attributes: {} });
    return;
  }
  const existingModelOptions = registeredOptions.get(model).model;
  try {
    (0, import_model_definition.mergeModelOptions)(existingModelOptions, options, false);
  } catch (error) {
    throw new Error(`Multiple decorators are trying to register conflicting options on model ${model.name}`, { cause: error });
  }
}
function registerModelAttributeOptions(model, attributeName, options) {
  if (!registeredOptions.has(model)) {
    registeredOptions.set(model, {
      model: {},
      attributes: {
        [attributeName]: options
      }
    });
    return;
  }
  const existingAttributesOptions = registeredOptions.get(model).attributes;
  if (!(attributeName in existingAttributesOptions)) {
    existingAttributesOptions[attributeName] = options;
    return;
  }
  const existingOptions = existingAttributesOptions[attributeName];
  for (const [optionName, optionValue] of Object.entries(options)) {
    if (!(optionName in existingOptions)) {
      existingOptions[optionName] = optionValue;
      continue;
    }
    if (optionName === "validate") {
      for (const [subOptionName, subOptionValue] of (0, import_object.getAllOwnEntries)(optionValue)) {
        if (subOptionName in existingOptions[optionName]) {
          throw new Error(`Multiple decorators are attempting to register option ${optionName}[${JSON.stringify(subOptionName)}] of attribute ${attributeName} on model ${model.name}.`);
        }
        existingOptions[optionName][subOptionName] = subOptionValue;
      }
      continue;
    }
    if (optionName === "index" || optionName === "unique") {
      if (!existingOptions[optionName]) {
        existingOptions[optionName] = [];
      } else if (!Array.isArray(existingOptions[optionName])) {
        existingOptions[optionName] = [existingOptions[optionName]];
      }
      if (Array.isArray(optionValue)) {
        existingOptions[optionName] = [...existingOptions[optionName], ...optionValue];
      } else {
        existingOptions[optionName] = [...existingOptions[optionName], optionValue];
      }
      continue;
    }
    if (optionValue === existingOptions[optionName]) {
      continue;
    }
    throw new Error(`Multiple decorators are attempting to set different values for the option ${optionName} of attribute ${attributeName} on model ${model.name}.`);
  }
}
function initDecoratedModel(model, sequelize) {
  const { model: modelOptions, attributes: attributeOptions = {} } = registeredOptions.get(model) ?? {};
  (0, import_model_typescript.initModel)(model, attributeOptions, {
    ...modelOptions,
    sequelize
  });
}
function isDecoratedModel(model) {
  return registeredOptions.has(model);
}
//# sourceMappingURL=model.js.map
