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
  Db2QueryInterface: () => Db2QueryInterface
});
module.exports = __toCommonJS(query_interface_exports);
var import_errors = require("../../errors");
var import_query_builder_utils = require("../../utils/query-builder-utils");
var import_sql = require("../../utils/sql");
const _ = require("lodash");
const { Op } = require("../../operators");
const { AbstractQueryInterface } = require("../abstract/query-interface");
const { QueryTypes } = require("../../query-types");
class Db2QueryInterface extends AbstractQueryInterface {
  async getForeignKeyReferencesForTable(tableName, options) {
    const queryOptions = {
      ...options,
      type: QueryTypes.FOREIGNKEYS
    };
    const query = this.queryGenerator.getForeignKeysQuery(tableName, this.sequelize.config.username.toUpperCase());
    return this.sequelize.queryRaw(query, queryOptions);
  }
  async upsert(tableName, insertValues, updateValues, where, options) {
    if (options.bind) {
      (0, import_sql.assertNoReservedBind)(options.bind);
    }
    options = { ...options };
    const model = options.model;
    const wheres = [];
    const attributes = Object.keys(insertValues);
    let indexFields;
    options = _.clone(options);
    if (!(0, import_query_builder_utils.isWhereEmpty)(where)) {
      wheres.push(where);
    }
    const indexes = [];
    for (const value of model.getIndexes()) {
      if (value.unique) {
        indexFields = value.fields.map((field) => {
          if (_.isPlainObject(field)) {
            return field.attribute;
          }
          return field;
        });
        indexes.push(indexFields);
      }
    }
    for (const index of indexes) {
      if (_.intersection(attributes, index).length === index.length) {
        where = {};
        for (const field of index) {
          where[field] = insertValues[field];
        }
        wheres.push(where);
      }
    }
    where = { [Op.or]: wheres };
    options.type = QueryTypes.UPSERT;
    options.raw = true;
    const sql = this.queryGenerator.upsertQuery(tableName, insertValues, updateValues, where, model, options);
    delete options.replacements;
    const result = await this.sequelize.queryRaw(sql, options);
    return [result, void 0];
  }
  async dropSchema(schema, options) {
    const outParams = /* @__PURE__ */ new Map();
    const response = await super.dropSchema(schema, {
      ...options,
      // TODO: db2 supports out parameters. We don't have a proper API for it yet
      //   for now, this temporary API will have to do.
      _unsafe_db2Outparams: outParams
    });
    const errorTable = outParams.get("sequelize_errorTable");
    if (errorTable != null) {
      const errorSchema = outParams.get("sequelize_errorSchema");
      const errorData = await this.sequelize.queryRaw(`SELECT * FROM "${errorSchema}"."${errorTable}"`, {
        type: QueryTypes.SELECT
      });
      const error = new Error(errorData[0].DIAGTEXT);
      error.sqlcode = errorData[0].SQLCODE;
      error.sql = errorData[0].STATEMENT;
      error.state = errorData[0].SQLSTATE;
      const wrappedError = new import_errors.DatabaseError(error);
      try {
        await this.dropTable({
          tableName: errorTable,
          schema: errorSchema
        });
      } catch (dropError) {
        throw new import_errors.AggregateError([
          wrappedError,
          new import_errors.BaseError(`An error occurred while cleaning up table ${errorSchema}.${errorTable}`, { cause: dropError })
        ]);
      }
      if (error.sqlcode === -204 && error.state === "42704") {
        return response;
      }
      throw wrappedError;
    }
    return response;
  }
  // TODO: drop "schema" options from the option bag, it must be passed through tableName instead.
  async createTable(tableName, attributes, options, model) {
    let sql = "";
    options = { ...options };
    if (model) {
      options.uniqueKeys = options.uniqueKeys || model.uniqueKeys;
    }
    attributes = _.mapValues(
      attributes,
      (attribute) => this.sequelize.normalizeAttribute(attribute)
    );
    const modelTable = model == null ? void 0 : model.table;
    if (!tableName.schema && (options.schema || (modelTable == null ? void 0 : modelTable.schema))) {
      tableName = this.queryGenerator.extractTableDetails(tableName);
      tableName.schema = (modelTable == null ? void 0 : modelTable.schema) || options.schema || tableName.schema;
    }
    attributes = this.queryGenerator.attributesToSQL(attributes, { table: tableName, context: "createTable", withoutForeignKeyConstraints: options.withoutForeignKeyConstraints });
    sql = this.queryGenerator.createTableQuery(tableName, attributes, options);
    return await this.sequelize.queryRaw(sql, options);
  }
  async addConstraint(tableName, options) {
    try {
      return await super.addConstraint(tableName, options);
    } catch (error) {
      if (!error.cause) {
        throw error;
      }
      if (error.cause.sqlcode !== -668 || error.cause.state !== "57007") {
        throw error;
      }
      await this.executeTableReorg(tableName);
      await super.addConstraint(tableName, options);
    }
  }
  /**
   * DB2 can put tables in the "reorg pending" state after a structure change (e.g. ALTER)
   * Other changes cannot be done to these tables until the reorg has been completed.
   *
   * This method forces a reorg to happen now.
   *
   * @param {TableName} tableName - The name of the table to reorg
   */
  async executeTableReorg(tableName) {
    return await this.sequelize.query(`CALL SYSPROC.ADMIN_CMD('REORG TABLE ${this.queryGenerator.quoteTable(tableName)}')`);
  }
}
//# sourceMappingURL=query-interface.js.map
