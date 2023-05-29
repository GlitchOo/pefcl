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
var aggregate_error_exports = {};
__export(aggregate_error_exports, {
  AggregateError: () => AggregateError
});
module.exports = __toCommonJS(aggregate_error_exports);
var import_base_error = require("./base-error");
class AggregateError extends import_base_error.BaseError {
  /** the aggregated errors that occurred */
  errors;
  constructor(errors) {
    super();
    this.errors = errors;
    this.name = "AggregateError";
  }
  toString() {
    const message = `AggregateError of:
${this.errors.map((error) => error === this ? "[Circular AggregateError]" : error instanceof AggregateError ? String(error).replace(/\n$/, "").replace(/^/gm, "  ") : String(error).replace(/^/gm, "    ").slice(2)).join("\n")}
`;
    return message;
  }
}
//# sourceMappingURL=aggregate-error.js.map
