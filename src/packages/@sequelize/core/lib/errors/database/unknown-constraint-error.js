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
var unknown_constraint_error_exports = {};
__export(unknown_constraint_error_exports, {
  UnknownConstraintError: () => UnknownConstraintError
});
module.exports = __toCommonJS(unknown_constraint_error_exports);
var import_deprecations = require("../../utils/deprecations.js");
var import_database_error = require("../database-error");
class UnknownConstraintError extends import_database_error.DatabaseError {
  constraint;
  fields;
  table;
  constructor(options = {}) {
    if ("parent" in options) {
      (0, import_deprecations.useErrorCause)();
    }
    const parent = options.cause ?? options.parent ?? { sql: "", name: "", message: "" };
    super(parent);
    this.name = "SequelizeUnknownConstraintError";
    this.constraint = options.constraint;
    this.fields = options.fields;
    this.table = options.table;
  }
}
//# sourceMappingURL=unknown-constraint-error.js.map
