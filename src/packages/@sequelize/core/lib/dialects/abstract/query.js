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
  AbstractQuery: () => AbstractQuery
});
module.exports = __toCommonJS(query_exports);
var import_node_util = __toESM(require("node:util"));
var import_data_types = require("./data-types");
const _ = require("lodash");
const { QueryTypes } = require("../../query-types");
const Dot = require("dottie");
const deprecations = require("../../utils/deprecations");
const crypto = require("node:crypto");
class AbstractQuery {
  constructor(connection, sequelize, options) {
    this.uuid = crypto.randomUUID();
    this.connection = connection;
    this.instance = options.instance;
    this.model = options.model;
    this.sequelize = sequelize;
    this.options = {
      plain: false,
      raw: false,
      logging: console.debug,
      ...options
    };
    this.checkLoggingOption();
    if (options.rawErrors) {
      this.formatError = AbstractQuery.prototype.formatError;
    }
  }
  async logWarnings(results) {
    const warningResults = await this.run("SHOW WARNINGS");
    const warningMessage = `${this.sequelize.dialect.name} warnings (${this.connection.uuid || "default"}): `;
    const messages = [];
    for (const _warningRow of warningResults) {
      if (_warningRow === void 0 || typeof _warningRow[Symbol.iterator] !== "function") {
        continue;
      }
      for (const _warningResult of _warningRow) {
        if (Object.prototype.hasOwnProperty.call(_warningResult, "Message")) {
          messages.push(_warningResult.Message);
        } else {
          for (const _objectKey of _warningResult.keys()) {
            messages.push([_objectKey, _warningResult[_objectKey]].join(": "));
          }
        }
      }
    }
    this.sequelize.log(warningMessage + messages.join("; "), this.options);
    return results;
  }
  /**
   * Formats a raw database error from the database library into a common Sequelize exception.
   *
   * @param {Error} error The exception object.
   * @param {object} errStack The stack trace that started the database query.
   * @returns {BaseError} the new formatted error object.
   */
  formatError(error, errStack) {
    error.stack = errStack;
    return error;
  }
  /**
   * Execute the passed sql query.
   *
   * Examples:
   *
   *     query.run('SELECT 1')
   *
   * @private
   */
  run() {
    throw new Error("The run method wasn't overwritten!");
  }
  /**
   * Check the logging option of the instance and print deprecation warnings.
   *
   * @private
   */
  checkLoggingOption() {
    if (this.options.logging === true) {
      deprecations.noTrueLogging();
      this.options.logging = console.debug;
    }
  }
  /**
   * Get the attributes of an insert query, which contains the just inserted id.
   *
   * @returns {string} The field name.
   * @private
   */
  getInsertIdField() {
    return "insertId";
  }
  getUniqueConstraintErrorMessage(field) {
    if (!field) {
      return "Must be unique";
    }
    const message = `${field} must be unique`;
    if (!this.model) {
      return message;
    }
    for (const index of this.model.getIndexes()) {
      if (!index.unique) {
        continue;
      }
      if (index.fields.includes(field.replace(/"/g, "")) && index.msg) {
        return index.msg;
      }
    }
    return message;
  }
  isRawQuery() {
    return this.options.type === QueryTypes.RAW;
  }
  isVersionQuery() {
    return this.options.type === QueryTypes.VERSION;
  }
  isUpsertQuery() {
    return this.options.type === QueryTypes.UPSERT;
  }
  isInsertQuery(results, metaData) {
    let result = true;
    if (this.options.type === QueryTypes.INSERT) {
      return true;
    }
    result = result && this.sql.toLowerCase().startsWith("insert into");
    result = result && (!results || Object.prototype.hasOwnProperty.call(results, this.getInsertIdField()));
    result = result && (!metaData || Object.prototype.hasOwnProperty.call(metaData, this.getInsertIdField()));
    return result;
  }
  handleInsertQuery(results, metaData) {
    if (!this.instance) {
      return;
    }
    const autoIncrementAttribute = this.model.modelDefinition.autoIncrementAttributeName;
    const id = (results == null ? void 0 : results[this.getInsertIdField()]) ?? (metaData == null ? void 0 : metaData[this.getInsertIdField()]) ?? null;
    this.instance[autoIncrementAttribute] = id;
  }
  isShowTablesQuery() {
    return this.options.type === QueryTypes.SHOWTABLES;
  }
  handleShowTablesQuery(results) {
    return results.flatMap((resultSet) => Object.values(resultSet));
  }
  isShowIndexesQuery() {
    return this.options.type === QueryTypes.SHOWINDEXES;
  }
  isShowConstraintsQuery() {
    return this.options.type === QueryTypes.SHOWCONSTRAINTS;
  }
  isDescribeQuery() {
    return this.options.type === QueryTypes.DESCRIBE;
  }
  isSelectQuery() {
    return this.options.type === QueryTypes.SELECT;
  }
  isBulkUpdateQuery() {
    return this.options.type === QueryTypes.BULKUPDATE;
  }
  isBulkDeleteQuery() {
    return this.options.type === QueryTypes.BULKDELETE;
  }
  isForeignKeysQuery() {
    return this.options.type === QueryTypes.FOREIGNKEYS;
  }
  isUpdateQuery() {
    return this.options.type === QueryTypes.UPDATE;
  }
  handleSelectQuery(results) {
    let result = null;
    if (this.options.fieldMap) {
      const fieldMap = this.options.fieldMap;
      results = results.map((result2) => _.reduce(fieldMap, (result3, name, field) => {
        if (result3[field] !== void 0 && name !== field) {
          result3[name] = result3[field];
          delete result3[field];
        }
        return result3;
      }, result2));
    }
    if (this.options.raw) {
      result = results.map((result2) => {
        let o = {};
        for (const key in result2) {
          if (Object.prototype.hasOwnProperty.call(result2, key)) {
            o[key] = result2[key];
          }
        }
        if (this.options.nest) {
          o = Dot.transform(o);
        }
        return o;
      });
    } else if (this.options.hasJoin === true) {
      results = AbstractQuery._groupJoinData(results, {
        model: this.model,
        includeMap: this.options.includeMap,
        includeNames: this.options.includeNames
      }, {
        checkExisting: this.options.hasMultiAssociation
      });
      result = this.model.bulkBuild(this._parseDataArrayByType(results, this.model, this.options.includeMap), {
        isNewRecord: false,
        include: this.options.include,
        includeNames: this.options.includeNames,
        includeMap: this.options.includeMap,
        includeValidated: true,
        attributes: this.options.originalAttributes || this.options.attributes,
        raw: true,
        comesFromDatabase: true
      });
    } else {
      result = this.model.bulkBuild(this._parseDataArrayByType(results, this.model, this.options.includeMap), {
        isNewRecord: false,
        raw: true,
        comesFromDatabase: true,
        attributes: this.options.originalAttributes || this.options.attributes
      });
    }
    if (this.options.plain) {
      result = result.length === 0 ? null : result[0];
    }
    return result;
  }
  /**
   * Calls {@link AbstractDataType#parseDatabaseValue} on all attributes returned by the database, if a model is specified.
   *
   * This method mutates valueArrays.
   *
   * @param {Array} valueArrays The values to parse
   * @param {Model} model The model these values belong to
   * @param {object} includeMap The list of included associations
   */
  _parseDataArrayByType(valueArrays, model, includeMap) {
    for (const values of valueArrays) {
      this._parseDataByType(values, model, includeMap);
    }
    return valueArrays;
  }
  _parseDataByType(values, model, includeMap) {
    for (const key of Object.keys(values)) {
      if (includeMap && Object.hasOwnProperty.call(includeMap, key)) {
        if (Array.isArray(values[key])) {
          values[key] = this._parseDataArrayByType(values[key], includeMap[key].model, includeMap[key].includeMap);
        } else {
          values[key] = this._parseDataByType(values[key], includeMap[key].model, includeMap[key].includeMap);
        }
        continue;
      }
      const attribute = model == null ? void 0 : model.modelDefinition.attributes.get(key);
      values[key] = this._parseDatabaseValue(values[key], attribute == null ? void 0 : attribute.type);
    }
    return values;
  }
  _parseDatabaseValue(value, attributeType) {
    if (value == null) {
      return value;
    }
    if (!attributeType || !(attributeType instanceof import_data_types.AbstractDataType)) {
      return value;
    }
    return attributeType.parseDatabaseValue(value);
  }
  isShowOrDescribeQuery() {
    let result = false;
    result = result || this.sql.toLowerCase().startsWith("show");
    result = result || this.sql.toLowerCase().startsWith("describe");
    return result;
  }
  isCallQuery() {
    return this.sql.toLowerCase().startsWith("call");
  }
  /**
   * @param {string} sql
   * @param {Function} debugContext
   * @param {Array|object} parameters
   * @protected
   * @returns {Function} A function to call after the query was completed.
   */
  _logQuery(sql, debugContext, parameters) {
    const { connection, options } = this;
    const benchmark = this.sequelize.options.benchmark || options.benchmark;
    const logQueryParameters = this.sequelize.options.logQueryParameters || options.logQueryParameters;
    const startTime = Date.now();
    let logParameter = "";
    if (logQueryParameters && parameters) {
      const delimiter = sql.endsWith(";") ? "" : ";";
      logParameter = `${delimiter} with parameters ${import_node_util.default.inspect(parameters)}`;
    }
    const fmt = `(${connection.uuid || "default"}): ${sql}${logParameter}`;
    const queryLabel = options.queryLabel ? `${options.queryLabel}
` : "";
    const msg = `${queryLabel}Executing ${fmt}`;
    debugContext(msg);
    if (!benchmark) {
      this.sequelize.log(`${queryLabel}Executing ${fmt}`, options);
    }
    return () => {
      const afterMsg = `${queryLabel}Executed ${fmt}`;
      debugContext(afterMsg);
      if (benchmark) {
        this.sequelize.log(afterMsg, Date.now() - startTime, options);
      }
    };
  }
  /**
   * The function takes the result of the query execution and groups
   * the associated data by the callee.
   *
   * Example:
   *   groupJoinData([
   *     {
   *       some: 'data',
   *       id: 1,
   *       association: { foo: 'bar', id: 1 }
   *     }, {
   *       some: 'data',
   *       id: 1,
   *       association: { foo: 'bar', id: 2 }
   *     }, {
   *       some: 'data',
   *       id: 1,
   *       association: { foo: 'bar', id: 3 }
   *     }
   *   ])
   *
   * Result:
   *   Something like this:
   *
   *   [
   *     {
   *       some: 'data',
   *       id: 1,
   *       association: [
   *         { foo: 'bar', id: 1 },
   *         { foo: 'bar', id: 2 },
   *         { foo: 'bar', id: 3 }
   *       ]
   *     }
   *   ]
   *
   * @param {Array} rows
   * @param {object} includeOptions
   * @param {object} options
   * @private
   */
  static _groupJoinData(rows, includeOptions, options) {
    if (rows.length === 0) {
      return [];
    }
    let i;
    let length;
    let $i;
    let $length;
    let rowsI;
    let row;
    const rowsLength = rows.length;
    let keys;
    let key;
    let keyI;
    let keyLength;
    let prevKey;
    let values;
    let topValues;
    let topExists;
    const checkExisting = options.checkExisting;
    let itemHash;
    let parentHash;
    let topHash;
    const results = checkExisting ? [] : new Array(rowsLength);
    const resultMap = {};
    const includeMap = {};
    let $keyPrefix;
    let $keyPrefixString;
    let $prevKeyPrefixString;
    let $prevKeyPrefix;
    let $lastKeyPrefix;
    let $current;
    let $parent;
    let previousPiece;
    const buildIncludeMap = (piece) => {
      if (Object.prototype.hasOwnProperty.call($current.includeMap, piece)) {
        includeMap[key] = $current = $current.includeMap[piece];
        if (previousPiece) {
          previousPiece = `${previousPiece}.${piece}`;
        } else {
          previousPiece = piece;
        }
        includeMap[previousPiece] = $current;
      }
    };
    const keyPrefixStringMemo = {};
    const keyPrefixString = (key2, memo) => {
      if (!Object.prototype.hasOwnProperty.call(memo, key2)) {
        memo[key2] = key2.slice(0, Math.max(0, key2.lastIndexOf(".")));
      }
      return memo[key2];
    };
    const removeKeyPrefixMemo = {};
    const removeKeyPrefix = (key2) => {
      if (!Object.prototype.hasOwnProperty.call(removeKeyPrefixMemo, key2)) {
        const index = key2.lastIndexOf(".");
        removeKeyPrefixMemo[key2] = key2.slice(index === -1 ? 0 : index + 1);
      }
      return removeKeyPrefixMemo[key2];
    };
    const keyPrefixMemo = {};
    const keyPrefix = (key2) => {
      if (!Object.prototype.hasOwnProperty.call(keyPrefixMemo, key2)) {
        const prefixString = keyPrefixString(key2, keyPrefixStringMemo);
        if (!Object.prototype.hasOwnProperty.call(keyPrefixMemo, prefixString)) {
          keyPrefixMemo[prefixString] = prefixString ? prefixString.split(".") : [];
        }
        keyPrefixMemo[key2] = keyPrefixMemo[prefixString];
      }
      return keyPrefixMemo[key2];
    };
    const lastKeyPrefixMemo = {};
    const lastKeyPrefix = (key2) => {
      if (!Object.prototype.hasOwnProperty.call(lastKeyPrefixMemo, key2)) {
        const prefix2 = keyPrefix(key2);
        const length2 = prefix2.length;
        lastKeyPrefixMemo[key2] = !length2 ? "" : prefix2[length2 - 1];
      }
      return lastKeyPrefixMemo[key2];
    };
    const getUniqueKeyAttributes = (model) => {
      let uniqueKeyAttributes2 = _.chain(model.uniqueKeys);
      uniqueKeyAttributes2 = uniqueKeyAttributes2.result(`${uniqueKeyAttributes2.findKey()}.fields`).map((field) => _.findKey(model.attributes, (chr) => chr.field === field)).value();
      return uniqueKeyAttributes2;
    };
    const stringify = (obj) => obj instanceof Buffer ? obj.toString("hex") : obj;
    let primaryKeyAttributes;
    let uniqueKeyAttributes;
    let prefix;
    for (rowsI = 0; rowsI < rowsLength; rowsI++) {
      row = rows[rowsI];
      if (rowsI === 0) {
        keys = Object.keys(row);
        keyLength = keys.length;
      }
      if (checkExisting) {
        topExists = false;
        $length = includeOptions.model.primaryKeyAttributes.length;
        topHash = "";
        if ($length === 1) {
          topHash = stringify(row[includeOptions.model.primaryKeyAttributes[0]]);
        } else if ($length > 1) {
          for ($i = 0; $i < $length; $i++) {
            topHash += stringify(row[includeOptions.model.primaryKeyAttributes[$i]]);
          }
        } else if (!_.isEmpty(includeOptions.model.uniqueKeys)) {
          uniqueKeyAttributes = getUniqueKeyAttributes(includeOptions.model);
          for ($i = 0; $i < uniqueKeyAttributes.length; $i++) {
            topHash += row[uniqueKeyAttributes[$i]];
          }
        }
      }
      topValues = values = {};
      $prevKeyPrefix = void 0;
      for (keyI = 0; keyI < keyLength; keyI++) {
        key = keys[keyI];
        $keyPrefixString = keyPrefixString(key, keyPrefixStringMemo);
        $keyPrefix = keyPrefix(key);
        if (rowsI === 0 && !Object.prototype.hasOwnProperty.call(includeMap, key)) {
          if ($keyPrefix.length === 0) {
            includeMap[key] = includeMap[""] = includeOptions;
          } else {
            $current = includeOptions;
            previousPiece = void 0;
            $keyPrefix.forEach(buildIncludeMap);
          }
        }
        if ($prevKeyPrefix !== void 0 && $prevKeyPrefix !== $keyPrefix) {
          if (checkExisting) {
            length = $prevKeyPrefix.length;
            $parent = null;
            parentHash = null;
            if (length) {
              for (i = 0; i < length; i++) {
                prefix = $parent ? `${$parent}.${$prevKeyPrefix[i]}` : $prevKeyPrefix[i];
                primaryKeyAttributes = includeMap[prefix].model.primaryKeyAttributes;
                $length = primaryKeyAttributes.length;
                itemHash = prefix;
                if ($length === 1) {
                  itemHash += stringify(row[`${prefix}.${primaryKeyAttributes[0]}`]);
                } else if ($length > 1) {
                  for ($i = 0; $i < $length; $i++) {
                    itemHash += stringify(row[`${prefix}.${primaryKeyAttributes[$i]}`]);
                  }
                } else if (!_.isEmpty(includeMap[prefix].model.uniqueKeys)) {
                  uniqueKeyAttributes = getUniqueKeyAttributes(includeMap[prefix].model);
                  for ($i = 0; $i < uniqueKeyAttributes.length; $i++) {
                    itemHash += row[`${prefix}.${uniqueKeyAttributes[$i]}`];
                  }
                }
                if (!parentHash) {
                  parentHash = topHash;
                }
                itemHash = parentHash + itemHash;
                $parent = prefix;
                if (i < length - 1) {
                  parentHash = itemHash;
                }
              }
            } else {
              itemHash = topHash;
            }
            if (itemHash === topHash) {
              if (!resultMap[itemHash]) {
                resultMap[itemHash] = values;
              } else {
                topExists = true;
              }
            } else if (!resultMap[itemHash]) {
              $parent = resultMap[parentHash];
              $lastKeyPrefix = lastKeyPrefix(prevKey);
              if (includeMap[prevKey].association.isSingleAssociation) {
                if ($parent) {
                  $parent[$lastKeyPrefix] = resultMap[itemHash] = values;
                }
              } else {
                if (!$parent[$lastKeyPrefix]) {
                  $parent[$lastKeyPrefix] = [];
                }
                $parent[$lastKeyPrefix].push(resultMap[itemHash] = values);
              }
            }
            values = {};
          } else {
            $current = topValues;
            length = $keyPrefix.length;
            if (length) {
              for (i = 0; i < length; i++) {
                if (i === length - 1) {
                  values = $current[$keyPrefix[i]] = {};
                }
                $current = $current[$keyPrefix[i]] || {};
              }
            }
          }
        }
        values[removeKeyPrefix(key)] = row[key];
        prevKey = key;
        $prevKeyPrefix = $keyPrefix;
        $prevKeyPrefixString = $keyPrefixString;
      }
      if (checkExisting) {
        length = $prevKeyPrefix.length;
        $parent = null;
        parentHash = null;
        if (length) {
          for (i = 0; i < length; i++) {
            prefix = $parent ? `${$parent}.${$prevKeyPrefix[i]}` : $prevKeyPrefix[i];
            primaryKeyAttributes = includeMap[prefix].model.primaryKeyAttributes;
            $length = primaryKeyAttributes.length;
            itemHash = prefix;
            if ($length === 1) {
              itemHash += stringify(row[`${prefix}.${primaryKeyAttributes[0]}`]);
            } else if ($length > 0) {
              for ($i = 0; $i < $length; $i++) {
                itemHash += stringify(row[`${prefix}.${primaryKeyAttributes[$i]}`]);
              }
            } else if (!_.isEmpty(includeMap[prefix].model.uniqueKeys)) {
              uniqueKeyAttributes = getUniqueKeyAttributes(includeMap[prefix].model);
              for ($i = 0; $i < uniqueKeyAttributes.length; $i++) {
                itemHash += row[`${prefix}.${uniqueKeyAttributes[$i]}`];
              }
            }
            if (!parentHash) {
              parentHash = topHash;
            }
            itemHash = parentHash + itemHash;
            $parent = prefix;
            if (i < length - 1) {
              parentHash = itemHash;
            }
          }
        } else {
          itemHash = topHash;
        }
        if (itemHash === topHash) {
          if (!resultMap[itemHash]) {
            resultMap[itemHash] = values;
          } else {
            topExists = true;
          }
        } else if (!resultMap[itemHash]) {
          $parent = resultMap[parentHash];
          $lastKeyPrefix = lastKeyPrefix(prevKey);
          if (includeMap[prevKey].association.isSingleAssociation) {
            if ($parent) {
              $parent[$lastKeyPrefix] = resultMap[itemHash] = values;
            }
          } else {
            if (!$parent[$lastKeyPrefix]) {
              $parent[$lastKeyPrefix] = [];
            }
            $parent[$lastKeyPrefix].push(resultMap[itemHash] = values);
          }
        }
        if (!topExists) {
          results.push(topValues);
        }
      } else {
        results[rowsI] = topValues;
      }
    }
    return results;
  }
}
//# sourceMappingURL=query.js.map
