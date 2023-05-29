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
var string_exports = {};
__export(string_exports, {
  camelize: () => camelize,
  camelizeIf: () => camelizeIf,
  generateIndexName: () => generateIndexName,
  nameIndex: () => nameIndex,
  pluralize: () => pluralize,
  removeTrailingSemicolon: () => removeTrailingSemicolon,
  singularize: () => singularize,
  spliceStr: () => spliceStr,
  underscore: () => underscore,
  underscoredIf: () => underscoredIf,
  useInflection: () => useInflection
});
module.exports = __toCommonJS(string_exports);
var import_node_util = __toESM(require("node:util"));
var _inflection = __toESM(require("inflection"));
var import_sequelize_method = require("./sequelize-method.js");
let inflection = _inflection;
function useInflection(newInflection) {
  inflection = newInflection;
}
function camelizeIf(str, condition) {
  let result = str;
  if (condition) {
    result = camelize(str);
  }
  return result;
}
function camelize(str) {
  return str.trim().replace(/[-_\s]+(.)?/g, (match, c) => c.toUpperCase());
}
function underscoredIf(str, condition) {
  let result = str;
  if (condition) {
    result = underscore(str);
  }
  return result;
}
function underscore(str) {
  return inflection.underscore(str);
}
function spliceStr(str, index, count, add) {
  return str.slice(0, index) + add + str.slice(index + count);
}
function singularize(str) {
  return inflection.singularize(str);
}
function pluralize(str) {
  return inflection.pluralize(str);
}
function nameIndex(index, tableName) {
  if (Object.prototype.hasOwnProperty.call(index, "name")) {
    return index;
  }
  index.name = generateIndexName(tableName, index);
  return index;
}
function generateIndexName(tableName, index) {
  if (typeof tableName !== "string" && tableName.tableName) {
    tableName = tableName.tableName;
  }
  if (!index.fields) {
    throw new Error(`Index on table ${tableName} has not fields:
${import_node_util.default.inspect(index)}`);
  }
  const fields = index.fields.map((field) => {
    if (typeof field === "string") {
      return field;
    }
    if (field instanceof import_sequelize_method.SequelizeMethod) {
      throw new Error(`Index on table ${tableName} uses Sequelize's ${field.constructor.name} as one of its fields. You need to name this index manually.`);
    }
    if ("attribute" in field) {
      throw new Error('Property "attribute" in IndexField has been renamed to "name"');
    }
    return field.name;
  });
  let out = `${tableName}_${fields.join("_")}`;
  if (index.unique) {
    out += "_unique";
  }
  return underscore(out);
}
function removeTrailingSemicolon(str) {
  if (!str.endsWith(";")) {
    return str;
  }
  return str.slice(0, Math.max(0, str.length - 1));
}
//# sourceMappingURL=string.js.map
