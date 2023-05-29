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
var attribute_utils_exports = {};
__export(attribute_utils_exports, {
  createOptionalAttributeOptionsDecorator: () => createOptionalAttributeOptionsDecorator,
  createRequiredAttributeOptionsDecorator: () => createRequiredAttributeOptionsDecorator
});
module.exports = __toCommonJS(attribute_utils_exports);
var import_model = require("../../model.js");
var import_model2 = require("../shared/model.js");
var import_decorator_utils = require("./decorator-utils.js");
function createRequiredAttributeOptionsDecorator(decoratorName, callback) {
  return createOptionalAttributeOptionsDecorator(decoratorName, import_decorator_utils.DECORATOR_NO_DEFAULT, callback);
}
function createOptionalAttributeOptionsDecorator(decoratorName, defaultValue, callback) {
  return (0, import_decorator_utils.createOptionallyParameterizedPropertyDecorator)(
    decoratorName,
    defaultValue,
    (decoratorOption, target, propertyName, propertyDescriptor) => {
      if (typeof propertyName === "symbol") {
        throw new TypeError("Symbol Model Attributes are not currently supported. We welcome a PR that implements this feature.");
      }
      const attributeOptions = callback(decoratorOption, target, propertyName, propertyDescriptor);
      annotate(decoratorName, target, propertyName, propertyDescriptor, attributeOptions);
    }
  );
}
function annotate(decoratorName, target, propertyName, propertyDescriptor, options) {
  if (typeof target === "function") {
    (0, import_decorator_utils.throwMustBeInstanceProperty)(decoratorName, target, propertyName);
  }
  if (!(target instanceof import_model.Model)) {
    (0, import_decorator_utils.throwMustBeMethod)(decoratorName, target, propertyName);
  }
  options = { ...options };
  if (propertyDescriptor) {
    if (propertyDescriptor.get) {
      options.get = propertyDescriptor.get;
    }
    if (propertyDescriptor.set) {
      options.set = propertyDescriptor.set;
    }
  }
  (0, import_model2.registerModelAttributeOptions)(target.constructor, propertyName, options);
}
//# sourceMappingURL=attribute-utils.js.map
