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
var deferrable_exports = {};
__export(deferrable_exports, {
  Deferrable: () => Deferrable
});
module.exports = __toCommonJS(deferrable_exports);
var import_class_to_invokable = require("./utils/class-to-invokable.js");
class Deferrable {
  static toString(queryGenerator) {
    return new this().toString(queryGenerator);
  }
  toString(queryGenerator) {
    return this.toSql(queryGenerator);
  }
  toSql(_queryGenerator) {
    throw new Error("toSql implementation missing");
  }
  static INITIALLY_DEFERRED = (0, import_class_to_invokable.classToInvokable)(class INITIALLY_DEFERRED extends Deferrable {
    toSql() {
      return "DEFERRABLE INITIALLY DEFERRED";
    }
  });
  static INITIALLY_IMMEDIATE = (0, import_class_to_invokable.classToInvokable)(class INITIALLY_IMMEDIATE extends Deferrable {
    toSql() {
      return "DEFERRABLE INITIALLY IMMEDIATE";
    }
  });
  /**
   * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
   * it impossible to dynamically defer the constraints within a transaction.
   */
  static NOT = (0, import_class_to_invokable.classToInvokable)(class NOT extends Deferrable {
    toSql() {
      return "NOT DEFERRABLE";
    }
  });
  /**
   * Will trigger an additional query at the beginning of a
   * transaction which sets the constraints to deferred.
   */
  static SET_DEFERRED = (0, import_class_to_invokable.classToInvokable)(class SET_DEFERRED extends Deferrable {
    #constraints;
    /**
     * @param constraints An array of constraint names. Will defer all constraints by default.
     */
    constructor(constraints) {
      super();
      this.#constraints = constraints;
    }
    toSql(queryGenerator) {
      return queryGenerator.setDeferredQuery(this.#constraints);
    }
  });
  /**
   * Will trigger an additional query at the beginning of a
   * transaction which sets the constraints to immediately.
   */
  static SET_IMMEDIATE = (0, import_class_to_invokable.classToInvokable)(class SET_IMMEDIATE extends Deferrable {
    #constraints;
    /**
     * @param constraints An array of constraint names. Will defer all constraints by default.
     */
    constructor(constraints) {
      super();
      this.#constraints = constraints;
    }
    toSql(queryGenerator) {
      return queryGenerator.setImmediateQuery(this.#constraints);
    }
  });
}
//# sourceMappingURL=deferrable.js.map
