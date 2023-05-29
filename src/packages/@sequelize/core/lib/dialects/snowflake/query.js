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
var query_exports = {};
__export(query_exports, {
  SnowflakeQuery: () => SnowflakeQuery
});
module.exports = __toCommonJS(query_exports);
const { AbstractQuery } = require("../abstract/query");
const sequelizeErrors = require("../../errors");
const _ = require("lodash");
const { logger } = require("../../utils/logger");
const ER_DUP_ENTRY = 1062;
const ER_DEADLOCK = 1213;
const ER_ROW_IS_REFERENCED = 1451;
const ER_NO_REFERENCED_ROW = 1452;
const debug = logger.debugContext("sql:snowflake");
class SnowflakeQuery extends AbstractQuery {
  async run(sql, parameters) {
    this.sql = sql;
    const { connection, options } = this;
    const showWarnings = this.sequelize.options.showWarnings || options.showWarnings;
    const complete = this._logQuery(sql, debug, parameters);
    if (parameters) {
      debug("parameters(%j)", parameters);
    }
    let results;
    try {
      results = await new Promise((resolve, reject) => {
        connection.execute({
          sqlText: sql,
          binds: parameters,
          complete(err, _stmt, rows) {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
          }
        });
      });
    } catch (error) {
      if (options.transaction && error.errno === ER_DEADLOCK) {
        try {
          await options.transaction.rollback();
        } catch {
        }
        options.transaction.finished = "rollback";
      }
      error.sql = sql;
      error.parameters = parameters;
      throw this.formatError(error);
    } finally {
      complete();
    }
    if (showWarnings && results && results.warningStatus > 0) {
      await this.logWarnings(results);
    }
    return this.formatResults(results);
  }
  /**
   * High level function that handles the results of a query execution.
   *
   *
   * Example:
   *  query.formatResults([
   *    {
   *      id: 1,              // this is from the main table
   *      attr2: 'snafu',     // this is from the main table
   *      Tasks.id: 1,        // this is from the associated table
   *      Tasks.title: 'task' // this is from the associated table
   *    }
   *  ])
   *
   * @param {Array} data - The result of the query execution.
   * @private
   */
  formatResults(data) {
    var _a;
    let result = this.instance;
    if (this.isInsertQuery(data)) {
      this.handleInsertQuery(data);
      if (!this.instance) {
        const modelDefinition = (_a = this.model) == null ? void 0 : _a.modelDefinition;
        if (data.constructor.name === "ResultSetHeader" && (modelDefinition == null ? void 0 : modelDefinition.autoIncrementAttributeName) && (modelDefinition == null ? void 0 : modelDefinition.autoIncrementAttributeName) === this.model.primaryKeyAttribute) {
          const startId = data[this.getInsertIdField()];
          result = [];
          for (let i = startId; i < startId + data.affectedRows; i++) {
            result.push({ [modelDefinition.getColumnName(this.model.primaryKeyAttribute)]: i });
          }
        } else {
          result = data[this.getInsertIdField()];
        }
      }
    }
    if (this.isSelectQuery()) {
      if (this.options.raw === false && this.sequelize.options.quoteIdentifiers === false) {
        const attrsMap = /* @__PURE__ */ Object.create(null);
        for (const attrName of this.model.modelDefinition.attributes.keys()) {
          attrsMap[attrName.toLowerCase()] = attrName;
        }
        data = data.map((data2) => _.reduce(data2, (prev, value, key) => {
          if (value !== void 0 && attrsMap[key]) {
            prev[attrsMap[key]] = value;
            delete prev[key];
          }
          return prev;
        }, data2));
      }
      this.options.fieldMap = _.mapKeys(this.options.fieldMap, (v, k) => {
        return k.toUpperCase();
      });
      return this.handleSelectQuery(data);
    }
    if (this.isShowTablesQuery()) {
      return this.handleShowTablesQuery(data);
    }
    if (this.isDescribeQuery()) {
      result = {};
      for (const _result of data) {
        result[_result.Field] = {
          type: _result.Type.toUpperCase(),
          allowNull: _result.Null === "YES",
          defaultValue: _result.Default,
          primaryKey: _result.Key === "PRI",
          autoIncrement: Object.prototype.hasOwnProperty.call(_result, "Extra") && _result.Extra.toLowerCase() === "auto_increment",
          comment: _result.Comment ? _result.Comment : null
        };
      }
      return result;
    }
    if (this.isShowIndexesQuery()) {
      return this.handleShowIndexesQuery(data);
    }
    if (this.isCallQuery()) {
      return data[0];
    }
    if (this.isBulkUpdateQuery() || this.isBulkDeleteQuery()) {
      return data[0]["number of rows updated"];
    }
    if (this.isVersionQuery()) {
      return data[0].version;
    }
    if (this.isForeignKeysQuery()) {
      return data;
    }
    if (this.isUpsertQuery()) {
      return [result, data.affectedRows === 1];
    }
    if (this.isInsertQuery() || this.isUpdateQuery()) {
      return [result, data.affectedRows];
    }
    if (this.isShowConstraintsQuery()) {
      return data;
    }
    if (this.isRawQuery()) {
      return [data, data];
    }
    return result;
  }
  formatError(err) {
    const errCode = err.errno || err.code;
    switch (errCode) {
      case ER_DUP_ENTRY: {
        const match = err.message.match(/Duplicate entry '([\S\s]*)' for key '?((.|\s)*?)'?$/);
        let fields = {};
        let message = "Validation error";
        const values = match ? match[1].split("-") : void 0;
        const fieldKey = match ? match[2] : void 0;
        const fieldVal = match ? match[1] : void 0;
        const uniqueKey = this.model && this.model.getIndexes().find((index) => index.unique && index.name === fieldKey);
        if (uniqueKey) {
          if (uniqueKey.msg) {
            message = uniqueKey.msg;
          }
          fields = _.zipObject(uniqueKey.fields, values);
        } else {
          fields[fieldKey] = fieldVal;
        }
        const errors = [];
        _.forOwn(fields, (value, field) => {
          errors.push(new sequelizeErrors.ValidationErrorItem(
            this.getUniqueConstraintErrorMessage(field),
            "unique violation",
            // sequelizeErrors.ValidationErrorItem.Origins.DB,
            field,
            value,
            this.instance,
            "not_unique"
          ));
        });
        return new sequelizeErrors.UniqueConstraintError({ message, errors, cause: err, fields });
      }
      case ER_ROW_IS_REFERENCED:
      case ER_NO_REFERENCED_ROW: {
        const match = err.message.match(
          /CONSTRAINT (["`])(.*)\1 FOREIGN KEY \(\1(.*)\1\) REFERENCES \1(.*)\1 \(\1(.*)\1\)/
        );
        const quoteChar = match ? match[1] : "`";
        const fields = match ? match[3].split(new RegExp(`${quoteChar}, *${quoteChar}`)) : void 0;
        return new sequelizeErrors.ForeignKeyConstraintError({
          reltype: String(errCode) === String(ER_ROW_IS_REFERENCED) ? "parent" : "child",
          table: match ? match[4] : void 0,
          fields,
          value: fields && fields.length && this.instance && this.instance[fields[0]] || void 0,
          index: match ? match[2] : void 0,
          cause: err
        });
      }
      default:
        return new sequelizeErrors.DatabaseError(err);
    }
  }
  handleShowIndexesQuery(data) {
    data = data.reduce((acc, item) => {
      if (!(item.Key_name in acc)) {
        acc[item.Key_name] = item;
        item.fields = [];
      }
      acc[item.Key_name].fields[item.Seq_in_index - 1] = {
        attribute: item.Column_name,
        length: item.Sub_part || void 0,
        order: item.Collation === "A" ? "ASC" : void 0
      };
      delete item.column_name;
      return acc;
    }, {});
    return _.map(data, (item) => ({
      primary: item.Key_name === "PRIMARY",
      fields: item.fields,
      name: item.Key_name,
      tableName: item.Table,
      unique: item.Non_unique !== 1,
      type: item.Index_type
    }));
  }
}
//# sourceMappingURL=query.js.map
