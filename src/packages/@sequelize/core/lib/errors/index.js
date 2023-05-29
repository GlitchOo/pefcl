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
var errors_exports = {};
__export(errors_exports, {
  AccessDeniedError: () => import_access_denied_error.AccessDeniedError,
  AggregateError: () => import_aggregate_error.AggregateError,
  AssociationError: () => import_association_error.AssociationError,
  AsyncQueueError: () => import_async_queue.AsyncQueueError,
  BaseError: () => import_base_error.BaseError,
  BulkRecordError: () => import_bulk_record_error.BulkRecordError,
  ConnectionAcquireTimeoutError: () => import_connection_acquire_timeout_error.ConnectionAcquireTimeoutError,
  ConnectionError: () => import_connection_error.ConnectionError,
  ConnectionRefusedError: () => import_connection_refused_error.ConnectionRefusedError,
  ConnectionTimedOutError: () => import_connection_timed_out_error.ConnectionTimedOutError,
  DatabaseError: () => import_database_error.DatabaseError,
  EagerLoadingError: () => import_eager_loading_error.EagerLoadingError,
  EmptyResultError: () => import_empty_result_error.EmptyResultError,
  ExclusionConstraintError: () => import_exclusion_constraint_error.ExclusionConstraintError,
  ForeignKeyConstraintError: () => import_foreign_key_constraint_error.ForeignKeyConstraintError,
  HostNotFoundError: () => import_host_not_found_error.HostNotFoundError,
  HostNotReachableError: () => import_host_not_reachable_error.HostNotReachableError,
  InstanceError: () => import_instance_error.InstanceError,
  InvalidConnectionError: () => import_invalid_connection_error.InvalidConnectionError,
  OptimisticLockError: () => import_optimistic_lock_error.OptimisticLockError,
  QueryError: () => import_query_error.QueryError,
  SequelizeScopeError: () => import_sequelize_scope_error.SequelizeScopeError,
  TimeoutError: () => import_timeout_error.TimeoutError,
  UniqueConstraintError: () => import_unique_constraint_error.UniqueConstraintError,
  UnknownConstraintError: () => import_unknown_constraint_error.UnknownConstraintError,
  ValidationError: () => import_validation_error.ValidationError,
  ValidationErrorItem: () => import_validation_error.ValidationErrorItem,
  ValidationErrorItemOrigin: () => import_validation_error.ValidationErrorItemOrigin,
  ValidationErrorItemType: () => import_validation_error.ValidationErrorItemType
});
module.exports = __toCommonJS(errors_exports);
var import_base_error = require("./base-error");
var import_database_error = require("./database-error");
var import_aggregate_error = require("./aggregate-error");
var import_association_error = require("./association-error");
var import_bulk_record_error = require("./bulk-record-error");
var import_connection_error = require("./connection-error");
var import_eager_loading_error = require("./eager-loading-error");
var import_empty_result_error = require("./empty-result-error");
var import_instance_error = require("./instance-error");
var import_optimistic_lock_error = require("./optimistic-lock-error");
var import_query_error = require("./query-error");
var import_sequelize_scope_error = require("./sequelize-scope-error");
var import_validation_error = require("./validation-error");
var import_access_denied_error = require("./connection/access-denied-error");
var import_connection_acquire_timeout_error = require("./connection/connection-acquire-timeout-error");
var import_connection_refused_error = require("./connection/connection-refused-error");
var import_connection_timed_out_error = require("./connection/connection-timed-out-error");
var import_host_not_found_error = require("./connection/host-not-found-error");
var import_host_not_reachable_error = require("./connection/host-not-reachable-error");
var import_invalid_connection_error = require("./connection/invalid-connection-error");
var import_exclusion_constraint_error = require("./database/exclusion-constraint-error");
var import_foreign_key_constraint_error = require("./database/foreign-key-constraint-error");
var import_timeout_error = require("./database/timeout-error");
var import_unknown_constraint_error = require("./database/unknown-constraint-error");
var import_unique_constraint_error = require("./validation/unique-constraint-error");
var import_async_queue = require("../dialects/mssql/async-queue");
//# sourceMappingURL=index.js.map
