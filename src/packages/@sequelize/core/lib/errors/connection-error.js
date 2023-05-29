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
var connection_error_exports = {};
__export(connection_error_exports, {
  ConnectionError: () => ConnectionError
});
module.exports = __toCommonJS(connection_error_exports);
var import_base_error = require("./base-error");
class ConnectionError extends import_base_error.BaseError {
  constructor(parent) {
    super(parent ? parent.message : "", { cause: parent });
    this.name = "SequelizeConnectionError";
  }
}
//# sourceMappingURL=connection-error.js.map
