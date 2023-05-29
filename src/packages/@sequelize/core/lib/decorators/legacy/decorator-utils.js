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
var decorator_utils_exports = {};
__export(decorator_utils_exports, {
  DECORATOR_NO_DEFAULT: () => DECORATOR_NO_DEFAULT,
  createOptionallyParameterizedPropertyDecorator: () => createOptionallyParameterizedPropertyDecorator,
  createParameterizedPropertyDecorator: () => createParameterizedPropertyDecorator,
  getClassName: () => getClassName,
  getPropertyName: () => getPropertyName,
  throwMustBeInstanceProperty: () => throwMustBeInstanceProperty,
  throwMustBeMethod: () => throwMustBeMethod,
  throwMustBeModel: () => throwMustBeModel,
  throwMustBeStaticProperty: () => throwMustBeStaticProperty
});
module.exports = __toCommonJS(decorator_utils_exports);
const DECORATOR_NO_DEFAULT = Symbol("DECORATOR_NO_DEFAULT");
function createParameterizedPropertyDecorator(name, callback) {
  return createOptionallyParameterizedPropertyDecorator(name, DECORATOR_NO_DEFAULT, callback);
}
function createOptionallyParameterizedPropertyDecorator(name, defaultValue, callback) {
  return function decorator(...args) {
    if (args.length === 0 || args.length === 1) {
      return function parameterizedDecorator(target, propertyName, propertyDescriptor) {
        const value = args[0] ?? defaultValue;
        if (value === DECORATOR_NO_DEFAULT) {
          throw new Error(`Decorator @${name} requires an argument (used on ${getPropertyName(target, propertyName)})`);
        }
        callback(value, target, propertyName, propertyDescriptor ?? Object.getOwnPropertyDescriptor(target, propertyName));
      };
    }
    if (defaultValue === DECORATOR_NO_DEFAULT) {
      throw new Error(`Decorator @${name} requires an argument (used on ${getPropertyName(args[0], args[1])})`);
    }
    callback(defaultValue, args[0], args[1], args[2] ?? Object.getOwnPropertyDescriptor(args[0], args[1]));
    return void 0;
  };
}
function throwMustBeStaticProperty(decoratorName, target, propertyName) {
  throw new TypeError(
    `Decorator @${decoratorName} has been used on ${getPropertyName(target, propertyName)}, which is an instance property. This decorator can only be used on static properties, setters and getters.`
  );
}
function throwMustBeModel(decoratorName, target, propertyName) {
  throw new TypeError(
    `Decorator @${decoratorName} has been used on ${getPropertyName(target, propertyName)}, but class "${getClassName(target)}" does not extend Model. This decorator can only be used on models.`
  );
}
function throwMustBeInstanceProperty(decoratorName, target, propertyName) {
  throw new TypeError(
    `Decorator @${decoratorName} has been used on ${getPropertyName(target, propertyName)}, which is static. This decorator can only be used on instance properties, setters and getters.`
  );
}
function throwMustBeMethod(decoratorName, target, propertyName) {
  throw new TypeError(
    `Decorator @${decoratorName} has been used on ${getPropertyName(target, propertyName)}, which is not a method. This decorator can only be used on methods.`
  );
}
function getPropertyName(obj, property) {
  if (typeof obj === "function") {
    return `${obj.name}.${String(property)}`;
  }
  return `${obj.constructor.name}#${String(property)}`;
}
function getClassName(obj) {
  if (typeof obj === "function") {
    return obj.name;
  }
  return obj.constructor.name;
}
//# sourceMappingURL=decorator-utils.js.map
