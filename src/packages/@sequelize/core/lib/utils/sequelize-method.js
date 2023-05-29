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
var sequelize_method_exports = {};
__export(sequelize_method_exports, {
  Cast: () => Cast,
  Col: () => Col,
  Fn: () => Fn,
  Json: () => Json,
  Literal: () => Literal,
  SequelizeMethod: () => SequelizeMethod,
  Where: () => Where
});
module.exports = __toCommonJS(sequelize_method_exports);
var import_isObject = __toESM(require("lodash/isObject"));
class SequelizeMethod {
}
class Fn extends SequelizeMethod {
  fn;
  // unknown already covers the other two types, but they've been added explicitly to document
  // passing WhereAttributeHash generates a condition inside the function.
  args;
  constructor(fn, args) {
    super();
    this.fn = fn;
    this.args = args;
  }
  clone() {
    return new Fn(this.fn, this.args);
  }
}
class Col extends SequelizeMethod {
  col;
  constructor(col, ...args) {
    super();
    if (args.length > 0) {
      col = args;
    }
    this.col = col;
  }
}
class Cast extends SequelizeMethod {
  val;
  type;
  json;
  constructor(val, type = "", json = false) {
    super();
    this.val = val;
    this.type = type.trim();
    this.json = json;
  }
}
class Literal extends SequelizeMethod {
  val;
  constructor(val) {
    super();
    this.val = val;
  }
}
class Json extends SequelizeMethod {
  conditions;
  path;
  value;
  constructor(conditionsOrPath, value) {
    super();
    if (typeof conditionsOrPath === "string") {
      this.path = conditionsOrPath;
      if (value) {
        this.value = value;
      }
    } else if ((0, import_isObject.default)(conditionsOrPath)) {
      this.conditions = conditionsOrPath;
    }
  }
}
class Where extends SequelizeMethod {
  // TODO [=7]: rename to leftOperand after typescript migration
  attribute;
  // TODO [=7]: rename to operator after typescript migration
  comparator;
  // TODO [=7]: rename to rightOperand after typescript migration
  logic;
  constructor(leftOperand, operatorOrRightOperand, rightOperand) {
    super();
    this.attribute = leftOperand;
    if (rightOperand !== void 0) {
      this.logic = rightOperand;
      this.comparator = operatorOrRightOperand;
    } else {
      this.logic = operatorOrRightOperand;
      this.comparator = "=";
    }
  }
}
//# sourceMappingURL=sequelize-method.js.map
