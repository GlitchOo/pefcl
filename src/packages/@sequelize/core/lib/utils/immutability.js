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
var immutability_exports = {};
__export(immutability_exports, {
  MapView: () => MapView,
  SetView: () => SetView
});
module.exports = __toCommonJS(immutability_exports);
var import_node_util = __toESM(require("node:util"));
class SetView {
  #target;
  constructor(target) {
    this.#target = target;
  }
  /**
   * @param value
   * @returns a boolean indicating whether an element with the specified value exists in the Set or not.
   */
  has(value) {
    return this.#target.has(value);
  }
  /**
   * @returns the number of (unique) elements in Set.
   */
  get size() {
    return this.#target.size;
  }
  [Symbol.iterator]() {
    return this.#target[Symbol.iterator]();
  }
  values() {
    return this.#target.values();
  }
  toJSON() {
    return [...this.#target];
  }
  [import_node_util.default.inspect.custom](depth, options) {
    const newOptions = Object.assign({}, options, {
      depth: options.depth == null ? null : options.depth - 1
    });
    return import_node_util.default.inspect(this.#target, newOptions).replace(/^Set/, "SetView");
  }
}
class MapView {
  #target;
  constructor(target) {
    this.#target = target;
  }
  /**
   * Returns a specified element from the Map object. If the value that is associated to the provided key is an object, then you will get a reference to that object and any change made to that object will effectively modify it inside the Map.
   *
   * @param key
   * @returns Returns the element associated with the specified key. If no element is associated with the specified key, undefined is returned.
   */
  get(key) {
    return this.#target.get(key);
  }
  /**
   * @param key
   * @returns boolean indicating whether an element with the specified key exists or not.
   */
  has(key) {
    return this.#target.has(key);
  }
  /**
   * @returns the number of elements in the Map.
   */
  get size() {
    return this.#target.size;
  }
  [Symbol.iterator]() {
    return this.#target[Symbol.iterator]();
  }
  entries() {
    return this.#target.entries();
  }
  keys() {
    return this.#target.keys();
  }
  values() {
    return this.#target.values();
  }
  toJSON() {
    return [...this.#target.entries()];
  }
  [import_node_util.default.inspect.custom](depth, options) {
    const newOptions = Object.assign({}, options, {
      depth: options.depth == null ? null : options.depth - 1
    });
    return import_node_util.default.inspect(this.#target, newOptions).replace(/^Map/, "MapView");
  }
}
//# sourceMappingURL=immutability.js.map
