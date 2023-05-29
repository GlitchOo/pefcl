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
var import_models_exports = {};
__export(import_models_exports, {
  importModels: () => importModels
});
module.exports = __toCommonJS(import_models_exports);
var import_fast_glob = __toESM(require("fast-glob"));
var import_uniq = __toESM(require("lodash/uniq"));
var import_model_utils = require("./utils/model-utils.js");
async function importModels(globPaths, modelMatch) {
  if (Array.isArray(globPaths)) {
    const promises2 = [];
    for (const globPath of globPaths) {
      promises2.push(importModels(globPath, modelMatch));
    }
    return (0, import_uniq.default)((await Promise.all(promises2)).flat(1));
  }
  const promises = [];
  for (const path of await (0, import_fast_glob.default)(globPaths)) {
    promises.push(importModelNoGlob(path, modelMatch));
  }
  return (0, import_uniq.default)((await Promise.all(promises)).flat(1));
}
async function importModelNoGlob(path, modelMatch) {
  const module2 = await import(path);
  return Object.keys(module2).filter((exportName) => {
    if (!(0, import_model_utils.isModelStatic)(module2[exportName])) {
      return false;
    }
    if (modelMatch) {
      return modelMatch(path, exportName, module2[exportName]);
    }
    return true;
  }).map((exportName) => module2[exportName]);
}
//# sourceMappingURL=import-models.js.map
