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
var validation_exports = {};
__export(validation_exports, {
  ModelValidator: () => ModelValidator,
  ValidateAttribute: () => ValidateAttribute
});
module.exports = __toCommonJS(validation_exports);
var import_model_utils = require("../../utils/model-utils.js");
var import_model = require("../shared/model.js");
var import_attribute_utils = require("./attribute-utils.js");
var import_decorator_utils = require("./decorator-utils.js");
const ValidateAttribute = (0, import_attribute_utils.createRequiredAttributeOptionsDecorator)(
  "ValidateAttribute",
  (decoratorOption) => {
    return { validate: decoratorOption };
  }
);
const ModelValidator = (0, import_decorator_utils.createOptionallyParameterizedPropertyDecorator)(
  "ModelValidator",
  void 0,
  (decoratorOption, target, propertyName) => {
    const isStatic = typeof target === "function";
    const targetClass = isStatic ? target : target.constructor;
    if (!(0, import_model_utils.isModelStatic)(targetClass)) {
      (0, import_decorator_utils.throwMustBeModel)("ValidateModel", target, propertyName);
    }
    const property = target[propertyName];
    if (typeof property !== "function") {
      (0, import_decorator_utils.throwMustBeMethod)("ValidateModel", target, propertyName);
    }
    const validator = isStatic ? function validate() {
      property.call(target, this);
    } : property;
    (0, import_model.registerModelOptions)(targetClass, {
      validate: {
        [propertyName]: validator
      }
    });
  }
);
//# sourceMappingURL=validation.js.map
