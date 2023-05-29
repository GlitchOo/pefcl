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
var join_sql_fragments_exports = {};
__export(join_sql_fragments_exports, {
  JoinSQLFragmentsError: () => JoinSQLFragmentsError,
  joinSQLFragments: () => joinSQLFragments
});
module.exports = __toCommonJS(join_sql_fragments_exports);
function doesNotWantLeadingSpace(str) {
  return /^[),;]/.test(str);
}
function doesNotWantTrailingSpace(str) {
  return str.endsWith("(");
}
function singleSpaceJoinHelper(parts) {
  return parts.reduce(
    ({ skipNextLeadingSpace, result }, part) => {
      if (skipNextLeadingSpace || doesNotWantLeadingSpace(part)) {
        result += part.trim();
      } else {
        result += ` ${part.trim()}`;
      }
      return {
        skipNextLeadingSpace: doesNotWantTrailingSpace(part),
        result
      };
    },
    {
      skipNextLeadingSpace: true,
      result: ""
    }
  ).result;
}
function joinSQLFragments(array) {
  if (array.length === 0) {
    return "";
  }
  const truthyArray = array.filter(
    (x) => Boolean(x)
  );
  const flattenedArray = truthyArray.map(
    (fragment) => {
      if (Array.isArray(fragment)) {
        return joinSQLFragments(fragment);
      }
      return fragment;
    }
  );
  for (const fragment of flattenedArray) {
    if (fragment && typeof fragment !== "string") {
      throw new JoinSQLFragmentsError(
        flattenedArray,
        fragment,
        `Tried to construct a SQL string with a non-string, non-falsy fragment (${fragment}).`
      );
    }
  }
  const trimmedArray = flattenedArray.map((x) => x.trim());
  const nonEmptyStringArray = trimmedArray.filter((x) => x !== "");
  return singleSpaceJoinHelper(nonEmptyStringArray);
}
class JoinSQLFragmentsError extends TypeError {
  args;
  fragment;
  // iirc this error is only used when we get an invalid fragment.
  constructor(args, fragment, message) {
    super(message);
    this.args = args;
    this.fragment = fragment;
    this.name = "JoinSQLFragmentsError";
  }
}
//# sourceMappingURL=join-sql-fragments.js.map
