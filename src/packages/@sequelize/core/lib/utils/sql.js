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
var sql_exports = {};
__export(sql_exports, {
  assertNoReservedBind: () => assertNoReservedBind,
  combineBinds: () => combineBinds,
  createNamedParamBindCollector: () => createNamedParamBindCollector,
  createSpecifiedOrderedBindCollector: () => createSpecifiedOrderedBindCollector,
  createUnspecifiedOrderedBindCollector: () => createUnspecifiedOrderedBindCollector,
  injectReplacements: () => injectReplacements,
  mapBindParameters: () => mapBindParameters
});
module.exports = __toCommonJS(sql_exports);
var import_isPlainObject = __toESM(require("lodash/isPlainObject"));
var import_sql_string = require("../sql-string");
function mapBindParametersAndReplacements(sqlString, dialect, replacements, onBind, options) {
  var _a, _b, _c, _d;
  const isNamedReplacements = (0, import_isPlainObject.default)(replacements);
  const isPositionalReplacements = Array.isArray(replacements);
  let lastConsumedPositionalReplacementIndex = -1;
  let output = "";
  let currentDollarStringTagName = null;
  let isString = false;
  let isColumn = false;
  let previousSliceEnd = 0;
  let isSingleLineComment = false;
  let isCommentBlock = false;
  let stringIsBackslashEscapable = false;
  for (let i = 0; i < sqlString.length; i++) {
    const char = sqlString[i];
    if (isColumn) {
      if (char === dialect.TICK_CHAR_RIGHT) {
        isColumn = false;
      }
      continue;
    }
    if (isString) {
      if (char === `'` && (!stringIsBackslashEscapable || !isBackslashEscaped(sqlString, i - 1))) {
        isString = false;
        stringIsBackslashEscapable = false;
      }
      continue;
    }
    if (currentDollarStringTagName !== null) {
      if (char !== "$") {
        continue;
      }
      const remainingString = sqlString.slice(i, sqlString.length);
      const dollarStringStartMatch = remainingString.match(/^\$(?<name>[a-z_][0-9a-z_])?(\$)/i);
      const tagName = ((_a = dollarStringStartMatch == null ? void 0 : dollarStringStartMatch.groups) == null ? void 0 : _a.name) ?? "";
      if (currentDollarStringTagName === tagName) {
        currentDollarStringTagName = null;
      }
      continue;
    }
    if (isSingleLineComment) {
      if (char === "\n") {
        isSingleLineComment = false;
      }
      continue;
    }
    if (isCommentBlock) {
      if (char === "*" && sqlString[i + 1] === "/") {
        isCommentBlock = false;
      }
      continue;
    }
    if (char === dialect.TICK_CHAR_LEFT) {
      isColumn = true;
      continue;
    }
    if (char === `'`) {
      isString = true;
      stringIsBackslashEscapable = dialect.canBackslashEscape() || dialect.supports.escapeStringConstants && (sqlString[i - 1] === "E" || sqlString[i - 1] === "e") && canPrecedeNewToken(sqlString[i - 2]);
      continue;
    }
    if (char === "-" && sqlString.slice(i, i + 3) === "-- ") {
      isSingleLineComment = true;
      continue;
    }
    if (char === "/" && sqlString.slice(i, i + 2) === "/*") {
      isCommentBlock = true;
      continue;
    }
    if (char === "$") {
      const previousChar = sqlString[i - 1];
      if (/[0-9a-z_]/i.test(previousChar)) {
        continue;
      }
      const remainingString = sqlString.slice(i, sqlString.length);
      const dollarStringStartMatch = remainingString.match(/^\$(?<name>[a-z_][0-9a-z_]*)?\$/i);
      if (dollarStringStartMatch) {
        currentDollarStringTagName = ((_b = dollarStringStartMatch.groups) == null ? void 0 : _b.name) ?? "";
        continue;
      }
      if (onBind) {
        if (!canPrecedeNewToken(previousChar)) {
          continue;
        }
        const match = remainingString.match(/^\$(?<name>([a-z_][0-9a-z_]*|[1-9][0-9]*))(?:\)|,|$|\s|::|;)/i);
        const bindParamName = (_c = match == null ? void 0 : match.groups) == null ? void 0 : _c.name;
        if (!bindParamName) {
          continue;
        }
        const newName = onBind(bindParamName);
        output += sqlString.slice(previousSliceEnd, i);
        previousSliceEnd = i + bindParamName.length + 1;
        output += newName;
      }
      continue;
    }
    if (isNamedReplacements && char === ":") {
      const previousChar = sqlString[i - 1];
      if (!canPrecedeNewToken(previousChar) && previousChar !== "[") {
        continue;
      }
      const remainingString = sqlString.slice(i, sqlString.length);
      const match = remainingString.match(/^:(?<name>[a-z_][0-9a-z_]*)(?:\)|,|$|\s|::|;|])/i);
      const replacementName = (_d = match == null ? void 0 : match.groups) == null ? void 0 : _d.name;
      if (!replacementName) {
        continue;
      }
      const replacementValue = replacements[replacementName];
      if (!Object.prototype.hasOwnProperty.call(replacements, replacementName) || replacementValue === void 0) {
        throw new Error(`Named replacement ":${replacementName}" has no entry in the replacement map.`);
      }
      const escapedReplacement = (0, import_sql_string.escape)(replacementValue, void 0, dialect, true);
      output += sqlString.slice(previousSliceEnd, i);
      previousSliceEnd = i + replacementName.length + 1;
      output += escapedReplacement;
      continue;
    }
    if (isPositionalReplacements && char === "?") {
      const previousChar = sqlString[i - 1];
      if (!canPrecedeNewToken(previousChar) && previousChar !== "[") {
        continue;
      }
      const nextChar = sqlString[i + 1];
      if (nextChar === "|" || nextChar === "&") {
        continue;
      }
      if (options == null ? void 0 : options.onPositionalReplacement) {
        options.onPositionalReplacement();
      }
      const replacementIndex = ++lastConsumedPositionalReplacementIndex;
      const replacementValue = replacements[lastConsumedPositionalReplacementIndex];
      if (replacementValue === void 0) {
        throw new Error(`Positional replacement (?) ${replacementIndex} has no entry in the replacement map (replacements[${replacementIndex}] is undefined).`);
      }
      const escapedReplacement = (0, import_sql_string.escape)(replacementValue, void 0, dialect, true);
      output += sqlString.slice(previousSliceEnd, i);
      previousSliceEnd = i + 1;
      output += escapedReplacement;
    }
  }
  if (isString) {
    throw new Error(`The following SQL query includes an unterminated string literal:
${sqlString}`);
  }
  output += sqlString.slice(previousSliceEnd, sqlString.length);
  return output;
}
function canPrecedeNewToken(char) {
  return char === void 0 || /[\s(>,=]/.test(char);
}
function mapBindParameters(sqlString, dialect) {
  const parameterCollector = dialect.createBindCollector();
  const parameterSet = /* @__PURE__ */ new Set();
  const newSql = mapBindParametersAndReplacements(sqlString, dialect, void 0, (foundBindParamName) => {
    parameterSet.add(foundBindParamName);
    return parameterCollector.collect(foundBindParamName);
  });
  return { sql: newSql, bindOrder: parameterCollector.getBindParameterOrder(), parameterSet };
}
function injectReplacements(sqlString, dialect, replacements, opts) {
  if (replacements == null) {
    return sqlString;
  }
  if (!Array.isArray(replacements) && !(0, import_isPlainObject.default)(replacements)) {
    throw new TypeError(`"replacements" must be an array or a plain object, but received ${JSON.stringify(replacements)} instead.`);
  }
  return mapBindParametersAndReplacements(sqlString, dialect, replacements, void 0, opts);
}
function isBackslashEscaped(string, pos) {
  let escaped = false;
  for (let i = pos; i >= 0; i--) {
    const char = string[i];
    if (char !== "\\") {
      break;
    }
    escaped = !escaped;
  }
  return escaped;
}
function createUnspecifiedOrderedBindCollector(token = "?") {
  const parameterOrder = [];
  return {
    collect(bindParameterName) {
      parameterOrder.push(bindParameterName);
      return token;
    },
    getBindParameterOrder() {
      return parameterOrder;
    }
  };
}
function createSpecifiedOrderedBindCollector(prefix = "$") {
  const parameterOrder = [];
  return {
    collect(bindParameterName) {
      const cachedPosition = parameterOrder.indexOf(bindParameterName);
      if (cachedPosition === -1) {
        parameterOrder.push(bindParameterName);
        return `${prefix}${parameterOrder.length}`;
      }
      return `${prefix}${cachedPosition + 1}`;
    },
    getBindParameterOrder() {
      return parameterOrder;
    }
  };
}
function createNamedParamBindCollector(parameterPrefix) {
  return {
    collect(bindParameterName) {
      return parameterPrefix + bindParameterName;
    },
    getBindParameterOrder() {
      return null;
    }
  };
}
function assertNoReservedBind(bind) {
  if (Array.isArray(bind)) {
    return;
  }
  for (const key of Object.keys(bind)) {
    if (key.startsWith("sequelize_")) {
      throw new Error('Bind parameters cannot start with "sequelize_", these bind parameters are reserved by Sequelize.');
    }
  }
}
function combineBinds(bindA, bindB) {
  if (Array.isArray(bindA)) {
    bindA = arrayBindToNamedBind(bindA);
  }
  return {
    ...bindA,
    ...bindB
  };
}
function arrayBindToNamedBind(bind) {
  const out = /* @__PURE__ */ Object.create(null);
  for (let i = 0; i < bind.length; i++) {
    out[i + 1] = bind[i];
  }
  return out;
}
//# sourceMappingURL=sql.js.map
