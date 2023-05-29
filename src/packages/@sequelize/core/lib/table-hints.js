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
var table_hints_exports = {};
__export(table_hints_exports, {
  TableHints: () => TableHints
});
module.exports = __toCommonJS(table_hints_exports);
var TableHints = /* @__PURE__ */ ((TableHints2) => {
  TableHints2["NOLOCK"] = "NOLOCK";
  TableHints2["READUNCOMMITTED"] = "READUNCOMMITTED";
  TableHints2["UPDLOCK"] = "UPDLOCK";
  TableHints2["REPEATABLEREAD"] = "REPEATABLEREAD";
  TableHints2["SERIALIZABLE"] = "SERIALIZABLE";
  TableHints2["READCOMMITTED"] = "READCOMMITTED";
  TableHints2["TABLOCK"] = "TABLOCK";
  TableHints2["TABLOCKX"] = "TABLOCKX";
  TableHints2["PAGLOCK"] = "PAGLOCK";
  TableHints2["ROWLOCK"] = "ROWLOCK";
  TableHints2["NOWAIT"] = "NOWAIT";
  TableHints2["READPAST"] = "READPAST";
  TableHints2["XLOCK"] = "XLOCK";
  TableHints2["SNAPSHOT"] = "SNAPSHOT";
  TableHints2["NOEXPAND"] = "NOEXPAND";
  return TableHints2;
})(TableHints || {});
//# sourceMappingURL=table-hints.js.map
