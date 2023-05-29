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
var query_exports = {};
__export(query_exports, {
  MariaDbQuery: () => MariaDbQuery
});
module.exports = __toCommonJS(query_exports);
var import_node_util = __toESM(require("node:util"));
const { AbstractQuery } = require("../abstract/query");
const sequelizeErrors = require("../../errors");
const _ = require("lodash");
const DataTypes = require("../../data-types");
const { logger } = require("../../utils/logger");
const ER_DUP_ENTRY = 1062;
const ER_DEADLOCK = 1213;
const ER_ROW_IS_REFERENCED = 1451;
const ER_NO_REFERENCED_ROW = 1452;
const debug = logger.debugContext("sql:mariadb");
class MariaDbQuery extends AbstractQuery {
  constructor(connection, sequelize, options) {
    super(connection, sequelize, { showWarnings: false, ...options });
  }
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
      results = await connection.query(this.sql, parameters);
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
    if (this.isBulkUpdateQuery() || this.isBulkDeleteQuery()) {
      return data.affectedRows;
    }
    if (this.isUpsertQuery()) {
      return [result, data.affectedRows === 1];
    }
    if (this.isInsertQuery(data)) {
      this.handleInsertQuery(data);
      if (!this.instance) {
        const modelDefinition = (_a = this.model) == null ? void 0 : _a.modelDefinition;
        if ((modelDefinition == null ? void 0 : modelDefinition.autoIncrementAttributeName) && (modelDefinition == null ? void 0 : modelDefinition.autoIncrementAttributeName) === this.model.primaryKeyAttribute) {
          const startId = data[this.getInsertIdField()];
          result = new Array(data.affectedRows);
          const pkColumnName = modelDefinition.attributes.get(this.model.primaryKeyAttribute).columnName;
          for (let i = 0; i < data.affectedRows; i++) {
            result[i] = { [pkColumnName]: startId + i };
          }
          return [result, data.affectedRows];
        }
        return [data[this.getInsertIdField()], data.affectedRows];
      }
    }
    if (this.isSelectQuery()) {
      this.handleJsonSelectQuery(data);
      return this.handleSelectQuery(data);
    }
    if (this.isInsertQuery() || this.isUpdateQuery()) {
      return [result, data.affectedRows];
    }
    if (this.isCallQuery()) {
      return data[0];
    }
    if (this.isRawQuery()) {
      const meta = data.meta;
      delete data.meta;
      return [data, meta];
    }
    if (this.isShowIndexesQuery()) {
      return this.handleShowIndexesQuery(data);
    }
    if (this.isForeignKeysQuery() || this.isShowConstraintsQuery()) {
      return data;
    }
    if (this.isShowTablesQuery()) {
      return this.handleShowTablesQuery(data);
    }
    if (this.isDescribeQuery()) {
      result = {};
      for (const _result of data) {
        result[_result.Field] = {
          type: _result.Type.toLowerCase().startsWith("enum") ? _result.Type.replace(
            /^enum/i,
            "ENUM"
          ) : _result.Type.toUpperCase(),
          allowNull: _result.Null === "YES",
          defaultValue: _result.Default,
          primaryKey: _result.Key === "PRI",
          autoIncrement: Object.prototype.hasOwnProperty.call(_result, "Extra") && _result.Extra.toLowerCase() === "auto_increment",
          comment: _result.Comment ? _result.Comment : null
        };
      }
      return result;
    }
    if (this.isVersionQuery()) {
      return data[0].version;
    }
    return result;
  }
  handleJsonSelectQuery(rows) {
    if (!this.model || !this.model.fieldRawAttributesMap) {
      return;
    }
    for (const _field of Object.keys(this.model.fieldRawAttributesMap)) {
      const modelField = this.model.fieldRawAttributesMap[_field];
      if (modelField.type instanceof DataTypes.JSON) {
        rows = rows.map((row) => {
          if (row[modelField.fieldName] && typeof row[modelField.fieldName] === "string" && !this.connection.info.hasMinVersion(10, 5, 2)) {
            row[modelField.fieldName] = JSON.parse(row[modelField.fieldName]);
          }
          if (DataTypes.JSON.parse) {
            return DataTypes.JSON.parse(
              modelField,
              this.sequelize.options,
              row[modelField.fieldName]
            );
          }
          return row;
        });
      }
    }
  }
  formatError(err) {
    switch (err.errno) {
      case ER_DUP_ENTRY: {
        const match = err.message.match(
          /Duplicate entry '([\S\s]*)' for key '?((.|\s)*?)'?\s.*$/
        );
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
          reltype: err.errno === ER_ROW_IS_REFERENCED ? "parent" : "child",
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
  handleShowTablesQuery(results) {
    return results.map((resultSet) => ({
      tableName: resultSet.TABLE_NAME,
      schema: resultSet.TABLE_SCHEMA
    }));
  }
  handleShowIndexesQuery(data) {
    let currItem;
    const result = [];
    for (const item of data) {
      if (!currItem || currItem.name !== item.Key_name) {
        currItem = {
          primary: item.Key_name === "PRIMARY",
          fields: [],
          name: item.Key_name,
          tableName: item.Table,
          unique: item.Non_unique !== "1",
          type: item.Index_type
        };
        result.push(currItem);
      }
      currItem.fields[item.Seq_in_index - 1] = {
        attribute: item.Column_name,
        length: item.Sub_part || void 0,
        order: item.Collation === "A" ? "ASC" : item.Collation === "D" ? "DESC" : item.Collation === null ? null : (() => {
          throw new Error(`Unknown index collation ${import_node_util.default.inspect(item.Collation)}`);
        })()
      };
    }
    return result;
  }
}
//# sourceMappingURL=query.js.map
