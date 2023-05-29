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
var connection_acquire_timeout_error_exports = {};
__export(connection_acquire_timeout_error_exports, {
  ConnectionAcquireTimeoutError: () => ConnectionAcquireTimeoutError
});
module.exports = __toCommonJS(connection_acquire_timeout_error_exports);
var import_connection_error = require("../connection-error");
class ConnectionAcquireTimeoutError extends import_connection_error.ConnectionError {
  constructor(cause) {
    super(cause);
    this.name = "SequelizeConnectionAcquireTimeoutError";
  }
}
//# sourceMappingURL=connection-acquire-timeout-error.js.map
