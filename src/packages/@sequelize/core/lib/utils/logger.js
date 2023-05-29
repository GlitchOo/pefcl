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
var logger_exports = {};
__export(logger_exports, {
  Logger: () => Logger,
  logger: () => logger
});
module.exports = __toCommonJS(logger_exports);
var import_node_util = __toESM(require("node:util"));
var import_debug = __toESM(require("debug"));
class Logger {
  config;
  constructor({ context = "sequelize", ...rest } = {}) {
    this.config = {
      context,
      ...rest
    };
  }
  /**
   * Logs a warning in the logger's context.
   *
   * @param message The message of the warning.
   */
  warn(message) {
    console.warn(`(${this.config.context}) Warning: ${message}`);
  }
  /**
   * Uses node's util.inspect to stringify a value.
   *
   * @param value The value which should be inspected.
   * @returns The string of the inspected value.
   */
  inspect(value) {
    return import_node_util.default.inspect(value, {
      showHidden: false,
      depth: 1
    });
  }
  /**
   * Gets a debugger for a context.
   *
   * @param name The name of the context.
   * @returns A debugger interace which can be used to debug.
   */
  debugContext(name) {
    return (0, import_debug.default)(`${this.config.context}:${name}`);
  }
}
const logger = new Logger();
//# sourceMappingURL=logger.js.map
