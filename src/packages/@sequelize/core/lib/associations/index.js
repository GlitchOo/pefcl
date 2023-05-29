"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var associations_exports = {};
module.exports = __toCommonJS(associations_exports);
__reExport(associations_exports, require("./base"), module.exports);
__reExport(associations_exports, require("./belongs-to"), module.exports);
__reExport(associations_exports, require("./has-one"), module.exports);
__reExport(associations_exports, require("./has-many"), module.exports);
__reExport(associations_exports, require("./belongs-to-many"), module.exports);
//# sourceMappingURL=index.js.map
