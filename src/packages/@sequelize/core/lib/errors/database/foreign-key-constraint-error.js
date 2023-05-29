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
var foreign_key_constraint_error_exports = {};
__export(foreign_key_constraint_error_exports, {
  ForeignKeyConstraintError: () => ForeignKeyConstraintError,
  RelationshipType: () => RelationshipType
});
module.exports = __toCommonJS(foreign_key_constraint_error_exports);
var import_deprecations = require("../../utils/deprecations.js");
var import_database_error = require("../database-error");
var RelationshipType = /* @__PURE__ */ ((RelationshipType2) => {
  RelationshipType2["parent"] = "parent";
  RelationshipType2["child"] = "child";
  return RelationshipType2;
})(RelationshipType || {});
class ForeignKeyConstraintError extends import_database_error.DatabaseError {
  table;
  fields;
  value;
  index;
  reltype;
  constructor(options = {}) {
    if ("parent" in options) {
      (0, import_deprecations.useErrorCause)();
    }
    const parent = options.cause ?? options.parent ?? { sql: "", name: "", message: "" };
    super(parent);
    this.name = "SequelizeForeignKeyConstraintError";
    this.fields = options.fields;
    this.table = options.table;
    this.value = options.value;
    this.index = options.index;
    this.reltype = options.reltype;
  }
}
//# sourceMappingURL=foreign-key-constraint-error.js.map
