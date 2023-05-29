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
var base_error_exports = {};
__export(base_error_exports, {
  BaseError: () => BaseError
});
module.exports = __toCommonJS(base_error_exports);
var import_deprecations = require("../utils/deprecations.js");
const supportsErrorCause = (() => {
  const err = new Error("Dummy 1", { cause: new Error("Dummy 2") });
  return "cause" in err;
})();
class BaseError extends Error {
  /**
   * @deprecated use {@link cause}.
   */
  get parent() {
    (0, import_deprecations.useErrorCause)();
    return this.cause;
  }
  /**
   * @deprecated use {@link cause}.
   */
  get original() {
    (0, import_deprecations.useErrorCause)();
    return this.cause;
  }
  constructor(message, options) {
    super(supportsErrorCause ? message : addCause(message, options == null ? void 0 : options.cause), options);
    this.name = "SequelizeBaseError";
    if (!supportsErrorCause && (options == null ? void 0 : options.cause)) {
      this.cause = options.cause;
    }
  }
}
const indentation = "  ";
function addCause(message = "", cause) {
  let out = message;
  if (cause) {
    out += `

${indentation}Caused by:
${indentation}${getErrorMessage(cause).replace(/\n/g, `
${indentation}`)}`;
  }
  return out;
}
function getErrorMessage(error) {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
//# sourceMappingURL=base-error.js.map
