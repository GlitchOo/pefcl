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
var async_queue_exports = {};
__export(async_queue_exports, {
  AsyncQueue: () => AsyncQueue,
  AsyncQueueError: () => AsyncQueueError
});
module.exports = __toCommonJS(async_queue_exports);
var import_base_error = require("../../errors/base-error");
var import_connection_error = require("../../errors/connection-error");
class AsyncQueueError extends import_base_error.BaseError {
  constructor(message) {
    super(message);
    this.name = "SequelizeAsyncQueueError";
  }
}
class AsyncQueue {
  previous;
  closed;
  rejectCurrent;
  constructor() {
    this.previous = Promise.resolve();
    this.closed = false;
    this.rejectCurrent = () => {
    };
  }
  close() {
    this.closed = true;
    this.rejectCurrent(
      new import_connection_error.ConnectionError(
        new AsyncQueueError(
          "the connection was closed before this query could finish executing"
        )
      )
    );
  }
  async enqueue(asyncFunction) {
    return new Promise((resolve, reject) => {
      this.previous = this.previous.then(() => {
        this.rejectCurrent = reject;
        if (this.closed) {
          return reject(
            new import_connection_error.ConnectionError(
              new AsyncQueueError(
                "the connection was closed before this query could be executed"
              )
            )
          );
        }
        return asyncFunction().then(resolve, reject);
      });
    });
  }
}
//# sourceMappingURL=async-queue.js.map
