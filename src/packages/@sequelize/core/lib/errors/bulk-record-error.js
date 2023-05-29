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
var bulk_record_error_exports = {};
__export(bulk_record_error_exports, {
  BulkRecordError: () => BulkRecordError
});
module.exports = __toCommonJS(bulk_record_error_exports);
var import_base_error = require("./base-error");
class BulkRecordError extends import_base_error.BaseError {
  errors;
  record;
  constructor(error, record, options) {
    super(error.message, options);
    this.name = "SequelizeBulkRecordError";
    this.errors = error;
    this.record = record;
  }
}
//# sourceMappingURL=bulk-record-error.js.map
