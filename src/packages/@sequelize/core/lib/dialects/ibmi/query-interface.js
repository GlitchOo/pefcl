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
var query_interface_exports = {};
__export(query_interface_exports, {
  IBMiQueryInterface: () => IBMiQueryInterface
});
module.exports = __toCommonJS(query_interface_exports);
const { Transaction } = require("../../transaction");
const { AbstractQueryInterface } = require("../abstract/query-interface");
class IBMiQueryInterface extends AbstractQueryInterface {
  startTransaction(transaction, options) {
    if (!(transaction instanceof Transaction)) {
      throw new TypeError("Unable to start a transaction without transaction object!");
    }
    options = { ...options, transaction: transaction.parent || transaction };
    options.transaction.name = transaction.parent ? transaction.name : void 0;
    return transaction.connection.beginTransaction();
  }
  commitTransaction(transaction) {
    if (!(transaction instanceof Transaction)) {
      throw new TypeError("Unable to commit a transaction without transaction object!");
    }
    if (transaction.parent) {
      throw new Error("Unable to commit a transaction that has a parent transaction!");
    }
    const promise = transaction.connection.commit();
    transaction.finished = "commit";
    return promise;
  }
  rollbackTransaction(transaction, options) {
    if (!(transaction instanceof Transaction)) {
      throw new TypeError("Unable to rollback a transaction without transaction object!");
    }
    options = {
      ...options,
      transaction: transaction.parent || transaction,
      supportsSearchPath: false,
      completesTransaction: true
    };
    options.transaction.name = transaction.parent ? transaction.name : void 0;
    const promise = transaction.connection.rollback();
    transaction.finished = "commit";
    return promise;
  }
}
//# sourceMappingURL=query-interface.js.map
