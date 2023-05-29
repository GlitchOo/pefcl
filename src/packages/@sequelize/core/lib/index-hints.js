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
var index_hints_exports = {};
__export(index_hints_exports, {
  IndexHints: () => IndexHints
});
module.exports = __toCommonJS(index_hints_exports);
var IndexHints = /* @__PURE__ */ ((IndexHints2) => {
  IndexHints2["USE"] = "USE";
  IndexHints2["FORCE"] = "FORCE";
  IndexHints2["IGNORE"] = "IGNORE";
  return IndexHints2;
})(IndexHints || {});
//# sourceMappingURL=index-hints.js.map
