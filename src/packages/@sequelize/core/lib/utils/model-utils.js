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
var model_utils_exports = {};
__export(model_utils_exports, {
  isModelStatic: () => isModelStatic,
  isSameInitialModel: () => isSameInitialModel
});
module.exports = __toCommonJS(model_utils_exports);
function isModelStatic(val) {
  const { Model: TmpModel } = require("../model");
  return typeof val === "function" && val.prototype instanceof TmpModel;
}
function isSameInitialModel(a, b) {
  return isModelStatic(a) && isModelStatic(b) && a.getInitialModel() === b.getInitialModel();
}
//# sourceMappingURL=model-utils.js.map
