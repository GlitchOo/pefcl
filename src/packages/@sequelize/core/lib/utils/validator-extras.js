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
var validator_extras_exports = {};
__export(validator_extras_exports, {
  extensions: () => extensions,
  validator: () => validator
});
module.exports = __toCommonJS(validator_extras_exports);
const _ = require("lodash");
const validator = _.cloneDeep(require("validator"));
const dayjs = require("dayjs");
const extensions = {
  extend(name, fn) {
    this[name] = fn;
    return this;
  },
  notEmpty(str) {
    return !/^\s*$/.test(str);
  },
  // TODO: accept { min, max } object
  len(str, min, max) {
    return this.isLength(str, min, max);
  },
  isUrl(str) {
    return this.isURL(str);
  },
  isIPv6(str) {
    return this.isIP(str, 6);
  },
  isIPv4(str) {
    return this.isIP(str, 4);
  },
  notIn(str, values) {
    return !this.isIn(str, values);
  },
  regex(str, pattern, modifiers) {
    str = String(str);
    if (Object.prototype.toString.call(pattern).slice(8, -1) !== "RegExp") {
      pattern = new RegExp(pattern, modifiers);
    }
    return str.match(pattern);
  },
  notRegex(str, pattern, modifiers) {
    return !this.regex(str, pattern, modifiers);
  },
  isDecimal(str) {
    return str !== "" && Boolean(/^(?:-?\d+)?(?:\.\d*)?(?:[Ee][+-]?\d+)?$/.test(str));
  },
  min(str, val) {
    const number = Number.parseFloat(str);
    return isNaN(number) || number >= val;
  },
  max(str, val) {
    const number = Number.parseFloat(str);
    return isNaN(number) || number <= val;
  },
  not(str, pattern, modifiers) {
    return this.notRegex(str, pattern, modifiers);
  },
  contains(str, elem) {
    return Boolean(elem) && str.includes(elem);
  },
  notContains(str, elem) {
    return !this.contains(str, elem);
  },
  is(str, pattern, modifiers) {
    return this.regex(str, pattern, modifiers);
  }
};
validator.isImmutable = function(value, validatorArgs, field, modelInstance) {
  return modelInstance.isNewRecord || modelInstance.dataValues[field] === modelInstance._previousDataValues[field];
};
validator.notNull = function(val) {
  return val !== null && val !== void 0;
};
_.forEach(extensions, (extend, key) => {
  validator[key] = extend;
});
validator.isNull = validator.isEmpty;
validator.isDate = function(dateString) {
  return dayjs(dateString).isValid();
};
//# sourceMappingURL=validator-extras.js.map
