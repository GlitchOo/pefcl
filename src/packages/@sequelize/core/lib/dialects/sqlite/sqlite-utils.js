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
var sqlite_utils_exports = {};
__export(sqlite_utils_exports, {
  withSqliteForeignKeysOff: () => withSqliteForeignKeysOff
});
module.exports = __toCommonJS(sqlite_utils_exports);
async function withSqliteForeignKeysOff(sequelize, options, cb) {
  try {
    await sequelize.queryRaw("PRAGMA foreign_keys = OFF", options);
    return await cb();
  } finally {
    await sequelize.queryRaw("PRAGMA foreign_keys = ON", options);
  }
}
//# sourceMappingURL=sqlite-utils.js.map
