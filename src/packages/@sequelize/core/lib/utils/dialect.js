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
var dialect_exports = {};
__export(dialect_exports, {
  TICK_CHAR: () => TICK_CHAR,
  addTicks: () => addTicks,
  quoteIdentifier: () => quoteIdentifier,
  removeTicks: () => removeTicks,
  toDefaultValue: () => toDefaultValue
});
module.exports = __toCommonJS(dialect_exports);
var import_node_crypto = require("node:crypto");
var import_isPlainObject = __toESM(require("lodash/isPlainObject"));
var import_uuid = require("uuid");
var DataTypes = __toESM(require("../dialects/abstract/data-types.js"));
function toDefaultValue(value, dialect) {
  if (typeof value === "function") {
    const tmp = value();
    if (tmp instanceof DataTypes.AbstractDataType) {
      return tmp.toSql({ dialect });
    }
    return tmp;
  }
  if (value instanceof DataTypes.UUIDV1) {
    return (0, import_uuid.v1)();
  }
  if (value instanceof DataTypes.UUIDV4) {
    return (0, import_node_crypto.randomUUID)();
  }
  if (value instanceof DataTypes.NOW) {
    return /* @__PURE__ */ new Date();
  }
  if (Array.isArray(value)) {
    return [...value];
  }
  if ((0, import_isPlainObject.default)(value)) {
    return { ...value };
  }
  return value;
}
const TICK_CHAR = "`";
function addTicks(s, tickChar = TICK_CHAR) {
  return tickChar + removeTicks(s, tickChar) + tickChar;
}
function removeTicks(s, tickChar = TICK_CHAR) {
  return s.replace(new RegExp(tickChar, "g"), "");
}
function quoteIdentifier(identifier, leftTick, rightTick) {
  const leftTickRegExp = new RegExp(`\\${leftTick}`, "g");
  if (leftTick === rightTick) {
    return leftTick + identifier.replace(leftTickRegExp, leftTick + leftTick) + rightTick;
  }
  const rightTickRegExp = new RegExp(`\\${rightTick}`, "g");
  return leftTick + identifier.replace(leftTickRegExp, leftTick + leftTick).replace(rightTickRegExp, rightTick + rightTick) + rightTick;
}
//# sourceMappingURL=dialect.js.map
