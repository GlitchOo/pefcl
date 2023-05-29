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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var legacy_exports = {};
__export(legacy_exports, {
  BelongsTo: () => import_associations.BelongsTo,
  BelongsToMany: () => import_associations.BelongsToMany,
  HasMany: () => import_associations.HasMany,
  HasOne: () => import_associations.HasOne
});
module.exports = __toCommonJS(legacy_exports);
__reExport(legacy_exports, require("./model-hooks.js"), module.exports);
__reExport(legacy_exports, require("./attribute.js"), module.exports);
__reExport(legacy_exports, require("./table.js"), module.exports);
__reExport(legacy_exports, require("./validation.js"), module.exports);
var import_associations = require("./associations.js");
//# sourceMappingURL=index.js.map
