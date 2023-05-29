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
var query_types_exports = {};
__export(query_types_exports, {
  QueryTypes: () => QueryTypes
});
module.exports = __toCommonJS(query_types_exports);
var QueryTypes = /* @__PURE__ */ ((QueryTypes2) => {
  QueryTypes2["SELECT"] = "SELECT";
  QueryTypes2["INSERT"] = "INSERT";
  QueryTypes2["UPDATE"] = "UPDATE";
  QueryTypes2["BULKUPDATE"] = "BULKUPDATE";
  QueryTypes2["BULKDELETE"] = "BULKDELETE";
  QueryTypes2["DELETE"] = "DELETE";
  QueryTypes2["UPSERT"] = "UPSERT";
  QueryTypes2["VERSION"] = "VERSION";
  QueryTypes2["SHOWTABLES"] = "SHOWTABLES";
  QueryTypes2["SHOWINDEXES"] = "SHOWINDEXES";
  QueryTypes2["DESCRIBE"] = "DESCRIBE";
  QueryTypes2["RAW"] = "RAW";
  QueryTypes2["FOREIGNKEYS"] = "FOREIGNKEYS";
  QueryTypes2["SHOWCONSTRAINTS"] = "SHOWCONSTRAINTS";
  return QueryTypes2;
})(QueryTypes || {});
//# sourceMappingURL=query-types.js.map
