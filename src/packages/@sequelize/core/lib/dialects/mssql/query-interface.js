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
  MsSqlQueryInterface: () => MsSqlQueryInterface
});
module.exports = __toCommonJS(query_interface_exports);
var import_query_builder_utils = require("../../utils/query-builder-utils");
var import_sql = require("../../utils/sql");
const _ = require("lodash");
const { QueryTypes } = require("../../query-types");
const { Op } = require("../../operators");
const { AbstractQueryInterface } = require("../abstract/query-interface");
class MsSqlQueryInterface extends AbstractQueryInterface {
  /**
  * A wrapper that fixes MSSQL's inability to cleanly remove columns from existing tables if they have a default constraint.
  *
  * @override
  */
  async removeColumn(tableName, attributeName, options) {
    options = { raw: true, ...options };
    const findConstraintSql = this.queryGenerator.getDefaultConstraintQuery(tableName, attributeName);
    const [results0] = await this.sequelize.queryRaw(findConstraintSql, options);
    if (results0.length > 0) {
      const dropConstraintSql = this.queryGenerator.dropConstraintQuery(tableName, results0[0].name);
      await this.sequelize.queryRaw(dropConstraintSql, options);
    }
    const findForeignKeySql = this.queryGenerator.getForeignKeyQuery(tableName, attributeName);
    const [results] = await this.sequelize.queryRaw(findForeignKeySql, options);
    if (results.length > 0) {
      const dropForeignKeySql = this.queryGenerator.dropForeignKeyQuery(tableName, results[0].constraint_name);
      await this.sequelize.queryRaw(dropForeignKeySql, options);
    }
    const primaryKeyConstraintSql = this.queryGenerator.getPrimaryKeyConstraintQuery(tableName, attributeName);
    const [result] = await this.sequelize.queryRaw(primaryKeyConstraintSql, options);
    if (result.length > 0) {
      const dropConstraintSql = this.queryGenerator.dropConstraintQuery(tableName, result[0].constraintName);
      await this.sequelize.queryRaw(dropConstraintSql, options);
    }
    const removeSql = this.queryGenerator.removeColumnQuery(tableName, attributeName);
    return this.sequelize.queryRaw(removeSql, options);
  }
  /**
    * @override
    */
  async bulkInsert(tableName, records, options, attributes) {
    if (records.length > 1e3 && !options.transaction) {
      throw new Error(`MSSQL doesn't allow for inserting more than 1,000 rows at a time, so Sequelize executes the insert as multiple queries. Please run this in a transaction to ensure safe rollbacks`);
    }
    return super.bulkInsert(tableName, records, options, attributes);
  }
  /**
   * @override
   */
  async upsert(tableName, insertValues, updateValues, where, options) {
    if (options.bind) {
      (0, import_sql.assertNoReservedBind)(options.bind);
    }
    const model = options.model;
    const wheres = [];
    options = { ...options };
    if (!(0, import_query_builder_utils.isWhereEmpty)(where)) {
      wheres.push(where);
    }
    const uniqueColumnNames = Object.values(model.getIndexes()).filter((c) => c.unique && c.fields.length > 0).map((c) => c.fields);
    const attributes = Object.keys(insertValues);
    for (const index of uniqueColumnNames) {
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
    return await this.sequelize.queryRaw(sql, options);
  }
}
//# sourceMappingURL=query-interface.js.map
