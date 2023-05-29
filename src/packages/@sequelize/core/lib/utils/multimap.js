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
var multimap_exports = {};
__export(multimap_exports, {
  Multimap: () => Multimap
});
module.exports = __toCommonJS(multimap_exports);
class Multimap {
  #internalMap = /* @__PURE__ */ new Map();
  clear() {
    this.#internalMap.clear();
  }
  append(key, value) {
    const valueSet = this.#internalMap.get(key);
    if (valueSet != null) {
      valueSet.push(value);
      return this;
    }
    this.#internalMap.set(key, [value]);
    return this;
  }
  delete(key, value) {
    const valueSet = this.#internalMap.get(key);
    if (valueSet == null) {
      return false;
    }
    const index = valueSet.indexOf(value);
    if (index === -1) {
      return false;
    }
    valueSet.splice(index, 1);
    return true;
  }
  keys() {
    return this.#internalMap.keys();
  }
  getAll(key) {
    const values = this.#internalMap.get(key);
    if (values) {
      return [...values];
    }
    return [];
  }
  count(key) {
    const values = this.#internalMap.get(key);
    return (values == null ? void 0 : values.length) ?? 0;
  }
}
//# sourceMappingURL=multimap.js.map
