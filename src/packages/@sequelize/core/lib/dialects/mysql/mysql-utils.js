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
var mysql_utils_exports = {};
__export(mysql_utils_exports, {
  escapeMysqlString: () => escapeMysqlString
});
module.exports = __toCommonJS(mysql_utils_exports);
function escapeMysqlString(value) {
  value = value.replace(/[\b\0\t\n\r\u001A"'\\]/g, (s) => {
    switch (s) {
      case "\0":
        return "\\0";
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case "\b":
        return "\\b";
      case "	":
        return "\\t";
      case "":
        return "\\Z";
      default:
        return `\\${s}`;
    }
  });
  return `'${value}'`;
}
//# sourceMappingURL=mysql-utils.js.map
