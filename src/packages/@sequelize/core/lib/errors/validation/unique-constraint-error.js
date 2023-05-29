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
var unique_constraint_error_exports = {};
__export(unique_constraint_error_exports, {
  UniqueConstraintError: () => UniqueConstraintError
});
module.exports = __toCommonJS(unique_constraint_error_exports);
var import_deprecations = require("../../utils/deprecations.js");
var import_validation_error = require("../validation-error");
class UniqueConstraintError extends import_validation_error.ValidationError {
  fields;
  sql;
  constructor(options = {}) {
    if ("parent" in options) {
      (0, import_deprecations.useErrorCause)();
    }
    const parent = options.cause ?? options.parent ?? { sql: "", name: "", message: "" };
    const message = options.message || parent.message || "Validation Error";
    const errors = options.errors ?? [];
    super(message, errors, { cause: parent });
    this.name = "SequelizeUniqueConstraintError";
    this.fields = options.fields ?? {};
    this.sql = parent.sql;
  }
}
//# sourceMappingURL=unique-constraint-error.js.map
