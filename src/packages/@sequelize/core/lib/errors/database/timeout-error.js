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
var timeout_error_exports = {};
__export(timeout_error_exports, {
  TimeoutError: () => TimeoutError
});
module.exports = __toCommonJS(timeout_error_exports);
var import_database_error = require("../database-error");
class TimeoutError extends import_database_error.DatabaseError {
  constructor(parent) {
    super(parent);
    this.name = "SequelizeTimeoutError";
  }
}
//# sourceMappingURL=timeout-error.js.map
