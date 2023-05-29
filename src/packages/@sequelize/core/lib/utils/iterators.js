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
var iterators_exports = {};
__export(iterators_exports, {
  combinedIterator: () => combinedIterator,
  every: () => every,
  find: () => find,
  map: () => map,
  some: () => some
});
module.exports = __toCommonJS(iterators_exports);
function* map(iterable, cb) {
  let i = 0;
  for (const item of iterable) {
    yield cb(item, i++);
  }
}
function some(iterable, cb) {
  for (const item of iterable) {
    if (cb(item)) {
      return true;
    }
  }
  return false;
}
function every(iterable, cb) {
  for (const item of iterable) {
    if (!cb(item)) {
      return false;
    }
  }
  return true;
}
function find(iterable, cb) {
  for (const item of iterable) {
    if (cb(item)) {
      return item;
    }
  }
  return void 0;
}
function* combinedIterator(...iterables) {
  for (const iterable of iterables) {
    yield* iterable;
  }
}
//# sourceMappingURL=iterators.js.map
