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
  PostgresQueryInterface: () => PostgresQueryInterface
});
module.exports = __toCommonJS(query_interface_exports);
var import_deferrable = require("../../deferrable");
var import_object = require("../../utils/object");
const DataTypes = require("../../data-types");
const { QueryTypes } = require("../../query-types");
const { AbstractQueryInterface } = require("../abstract/query-interface");
class PostgresQueryInterface extends AbstractQueryInterface {
  /**
   * Ensure enum and their values.
   *
   * @param {string} tableName  Name of table to create
   * @param {object} attributes Object representing a list of normalized table attributes
   * @param {object} [options]
   * @param {Model}  [model]
   *
   * @protected
   */
  async ensureEnums(tableName, attributes, options, model) {
    const keys = Object.keys(attributes);
    const keyLen = keys.length;
    let sql = "";
    let promises = [];
    let i = 0;
    for (i = 0; i < keyLen; i++) {
      const attribute = attributes[keys[i]];
      const type = attribute.type;
      if (type instanceof DataTypes.ENUM || type instanceof DataTypes.ARRAY && type.options.type instanceof DataTypes.ENUM) {
        sql = this.queryGenerator.pgListEnums(tableName, attribute.field || keys[i], options);
        promises.push(this.sequelize.queryRaw(
          sql,
          { ...options, plain: true, raw: true, type: QueryTypes.SELECT }
        ));
      }
    }
    const results = await Promise.all(promises);
    promises = [];
    let enumIdx = 0;
    const addEnumValue = (field, value, relativeValue, position = "before", spliceStart = promises.length) => {
      const valueOptions = { ...options };
      valueOptions.before = null;
      valueOptions.after = null;
      switch (position) {
        case "after":
          valueOptions.after = relativeValue;
          break;
        case "before":
        default:
          valueOptions.before = relativeValue;
          break;
      }
      promises.splice(spliceStart, 0, () => {
        return this.sequelize.queryRaw(this.queryGenerator.pgEnumAdd(
          tableName,
          field,
          value,
          valueOptions
        ), valueOptions);
      });
    };
    for (i = 0; i < keyLen; i++) {
      const attribute = attributes[keys[i]];
      const type = attribute.type;
      const enumType = type instanceof DataTypes.ARRAY ? type.options.type : type;
      const field = attribute.field || keys[i];
      if (type instanceof DataTypes.ENUM || type instanceof DataTypes.ARRAY && enumType instanceof DataTypes.ENUM) {
        if (!results[enumIdx]) {
          promises.push(() => {
            return this.sequelize.queryRaw(this.queryGenerator.pgEnum(tableName, field, enumType, options), { ...options, raw: true });
          });
        } else if (Boolean(results[enumIdx]) && Boolean(model)) {
          const enumVals = this.queryGenerator.fromArray(results[enumIdx].enum_value);
          const vals = enumType.options.values;
          let lastOldEnumValue;
          let rightestPosition = -1;
          for (let oldIndex = 0; oldIndex < enumVals.length; oldIndex++) {
            const enumVal = enumVals[oldIndex];
            const newIdx = vals.indexOf(enumVal);
            lastOldEnumValue = enumVal;
            if (newIdx === -1) {
              continue;
            }
            const newValuesBefore = vals.slice(0, newIdx);
            const promisesLength = promises.length;
            for (let reverseIdx = newValuesBefore.length - 1; reverseIdx >= 0; reverseIdx--) {
              if (~enumVals.indexOf(newValuesBefore[reverseIdx])) {
                break;
              }
              addEnumValue(field, newValuesBefore[reverseIdx], lastOldEnumValue, "before", promisesLength);
            }
            if (newIdx > rightestPosition) {
              rightestPosition = newIdx;
            }
          }
          if (lastOldEnumValue && rightestPosition < vals.length - 1) {
            const remainingEnumValues = vals.slice(rightestPosition + 1);
            for (let reverseIdx = remainingEnumValues.length - 1; reverseIdx >= 0; reverseIdx--) {
              addEnumValue(field, remainingEnumValues[reverseIdx], lastOldEnumValue, "after");
            }
          }
          enumIdx++;
        }
      }
    }
    const result = await promises.reduce(async (promise, asyncFunction) => await asyncFunction(await promise), Promise.resolve());
    if (promises.length > 0) {
      await this.sequelize.dialect.connectionManager.refreshDynamicOids();
    }
    return result;
  }
  /**
   * @override
   */
  async getForeignKeyReferencesForTable(table, options) {
    const queryOptions = {
      ...options,
      type: QueryTypes.FOREIGNKEYS
    };
    const query = this.queryGenerator.getForeignKeyReferencesQuery(table.tableName || table, this.sequelize.config.database);
    const result = await this.sequelize.queryRaw(query, queryOptions);
    return result.map((fkMeta) => {
      const { initiallyDeferred, isDeferrable, ...remaining } = (0, import_object.camelizeObjectKeys)(fkMeta);
      return {
        ...remaining,
        deferrable: isDeferrable === "NO" ? import_deferrable.Deferrable.NOT : initiallyDeferred === "NO" ? import_deferrable.Deferrable.INITIALLY_IMMEDIATE : import_deferrable.Deferrable.INITIALLY_DEFERRED
      };
    });
  }
  /**
   * Drop specified enum from database (Postgres only)
   *
   * @param {string} [enumName]  Enum name to drop
   * @param {object} options Query options
   *
   * @returns {Promise}
   */
  async dropEnum(enumName, options) {
    options = options || {};
    return this.sequelize.queryRaw(
      this.queryGenerator.pgEnumDrop(null, null, this.queryGenerator.pgEscapeAndQuote(enumName)),
      { ...options, raw: true }
    );
  }
  /**
   * Drop all enums from database (Postgres only)
   *
   * @param {object} options Query options
   *
   * @returns {Promise}
   */
  async dropAllEnums(options) {
    options = options || {};
    const enums = await this.pgListEnums(null, options);
    return await Promise.all(enums.map((result) => this.sequelize.queryRaw(
      this.queryGenerator.pgEnumDrop(null, null, this.queryGenerator.pgEscapeAndQuote(result.enum_name)),
      { ...options, raw: true }
    )));
  }
  /**
   * List all enums (Postgres only)
   *
   * @param {string} [tableName]  Table whose enum to list
   * @param {object} [options]    Query options
   *
   * @returns {Promise}
   */
  async pgListEnums(tableName, options) {
    options = options || {};
    const sql = this.queryGenerator.pgListEnums(tableName);
    return this.sequelize.queryRaw(sql, { ...options, plain: false, raw: true, type: QueryTypes.SELECT });
  }
  /**
   * Since postgres has a special case for enums, we should drop the related
   * enum type within the table and attribute
   *
   * @override
   */
  async dropTable(tableName, options) {
    await super.dropTable(tableName, options);
    const promises = [];
    const model = this.sequelize.modelManager.getModel(tableName, { attribute: "tableName" });
    if (!model) {
      return;
    }
    const getTableName = (!options || !options.schema || options.schema === "public" ? "" : `${options.schema}_`) + tableName;
    const attributes = model.modelDefinition.attributes;
    for (const attribute of attributes.values()) {
      if (!(attribute.type instanceof DataTypes.ENUM)) {
        continue;
      }
      const sql = this.queryGenerator.pgEnumDrop(getTableName, attribute.attributeName);
      promises.push(this.sequelize.queryRaw(sql, {
        ...options,
        raw: true,
        supportsSearchPath: false
      }));
    }
    await Promise.all(promises);
  }
}
//# sourceMappingURL=query-interface.js.map
