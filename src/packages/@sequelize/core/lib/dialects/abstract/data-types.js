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
var data_types_exports = {};
__export(data_types_exports, {
  ARRAY: () => ARRAY,
  AbstractDataType: () => AbstractDataType,
  BIGINT: () => BIGINT,
  BLOB: () => BLOB,
  BOOLEAN: () => BOOLEAN,
  BaseDecimalNumberDataType: () => BaseDecimalNumberDataType,
  BaseIntegerDataType: () => BaseIntegerDataType,
  BaseNumberDataType: () => BaseNumberDataType,
  CHAR: () => CHAR,
  CIDR: () => CIDR,
  CITEXT: () => CITEXT,
  DATE: () => DATE,
  DATEONLY: () => DATEONLY,
  DECIMAL: () => DECIMAL,
  DOUBLE: () => DOUBLE,
  ENUM: () => ENUM,
  FLOAT: () => FLOAT,
  GEOGRAPHY: () => GEOGRAPHY,
  GEOMETRY: () => GEOMETRY,
  HSTORE: () => HSTORE,
  INET: () => INET,
  INTEGER: () => INTEGER,
  JSON: () => JSON,
  JSONB: () => JSONB,
  MACADDR: () => MACADDR,
  MEDIUMINT: () => MEDIUMINT,
  NOW: () => NOW,
  RANGE: () => RANGE,
  REAL: () => REAL,
  SMALLINT: () => SMALLINT,
  STRING: () => STRING,
  TEXT: () => TEXT,
  TIME: () => TIME,
  TINYINT: () => TINYINT,
  TSVECTOR: () => TSVECTOR,
  UUID: () => UUID,
  UUIDV1: () => UUIDV1,
  UUIDV4: () => UUIDV4,
  VIRTUAL: () => VIRTUAL
});
module.exports = __toCommonJS(data_types_exports);
var import_node_buffer = require("node:buffer");
var import_node_util = __toESM(require("node:util"));
var import_dayjs = __toESM(require("dayjs"));
var import_identity = __toESM(require("lodash/identity.js"));
var import_isEqual = __toESM(require("lodash/isEqual"));
var import_isObject = __toESM(require("lodash/isObject"));
var import_errors = require("../../errors");
var import_geo_json = require("../../geo-json.js");
var import_buffer = require("../../utils/buffer.js");
var import_check = require("../../utils/check.js");
var import_dayjs2 = require("../../utils/dayjs.js");
var import_deprecations = require("../../utils/deprecations.js");
var import_join_sql_fragments = require("../../utils/join-sql-fragments");
var import_parse_number = require("../../utils/parse-number.js");
var import_validator_extras = require("../../utils/validator-extras");
var import_range = require("../postgres/range.js");
var import_data_types_utils = require("./data-types-utils.js");
let Moment;
try {
  Moment = require("moment");
} catch {
}
function isMoment(value) {
  return (Moment == null ? void 0 : Moment.isMoment(value)) ?? false;
}
const kDataTypeIdentifier = Symbol("sequelize.DataTypeIdentifier");
class AbstractDataType {
  static getDataTypeId() {
    return this[kDataTypeIdentifier];
  }
  getDataTypeId() {
    return this.constructor.getDataTypeId();
  }
  /**
   * Where this DataType is being used.
   */
  usageContext;
  #dialect;
  _getDialect() {
    if (!this.#dialect) {
      throw new Error("toDialectDataType has not yet been called on this DataType");
    }
    return this.#dialect;
  }
  // TODO: Remove in v8
  /**
   * @hidden
   */
  static get escape() {
    throw new Error('The "escape" static property has been removed. Each DataType is responsible for escaping its value correctly.');
  }
  // TODO: Remove in v8
  /**
   * @hidden
   */
  static get types() {
    throw new Error('The "types" static property has been removed. Use getDataTypeDialectMeta.');
  }
  // TODO: Remove in v8
  /**
   * @hidden
   */
  static get key() {
    throw new Error('The "key" static property has been removed.');
  }
  // TODO: Remove in v8
  /**
   * @hidden
   */
  get types() {
    throw new Error('The "types" instance property has been removed.');
  }
  // TODO: Remove in v8
  /**
   * @hidden
   */
  get key() {
    throw new Error('The "key" instance property has been removed.');
  }
  // TODO: move to utils?
  _construct(...args) {
    const constructor = this.constructor;
    return new constructor(...args);
  }
  areValuesEqual(value, originalValue) {
    return (0, import_isEqual.default)(value, originalValue);
  }
  /**
   * Called when a value is retrieved from the Database, and its DataType is specified.
   * Used to normalize values from the database.
   *
   * Note: It is also possible to do an initial parsing of a Database value using {@link AbstractDialect#registerDataTypeParser}.
   * That normalization uses the type ID from the database instead of a Sequelize Data Type to determine which parser to use,
   * and is called before this method.
   *
   * @param value The value to parse.
   */
  parseDatabaseValue(value) {
    return value;
  }
  /**
   * Used to normalize a value when {@link Model#set} is called.
   * That is, when a user sets a value on a Model instance.
   *
   * @param value
   */
  sanitize(value) {
    return value;
  }
  /**
   * Checks whether the JS value is compatible with (or can be converted to) the SQL data type.
   * Throws if that is not the case.
   *
   * @param value
   */
  validate(value) {
  }
  /**
   * Escapes a value for the purposes of inlining it in a SQL query.
   * The resulting value will be inlined as-is with no further escaping.
   *
   * @param value The value to escape.
   * @param options Options.
   */
  escape(value, options) {
    const asBindValue = this.toBindableValue(value, options);
    if (!(0, import_check.isString)(asBindValue)) {
      throw new Error(`${this.constructor.name}#stringify has been overridden to return a non-string value, so ${this.constructor.name}#escape must be implemented to handle that value correctly.`);
    }
    return options.dialect.escapeString(asBindValue);
  }
  /**
   * This method is called when {@link AbstractQueryGenerator} needs to add a bind parameter to a query it is building.
   * This method allows for customizing both the SQL to add to the query, and convert the bind parameter value to a DB-compatible value.
   *
   * If you only need to prepare the bind param value, implement {@link toBindableValue} instead.
   *
   * This method must return the SQL to add to the query. You can obtain a bind parameter ID by calling {@link BindParamOptions#bindParam}
   * with the value associated to that bind parameter.
   *
   * An example of a data type that requires customizing the SQL is the {@link GEOMETRY} data type.
   *
   * @param value The value to bind.
   * @param options Options.
   */
  getBindParamSql(value, options) {
    return options.bindParam(this.toBindableValue(value, options));
  }
  /**
   * Converts a JS value to a value compatible with the connector library for this Data Type.
   * Unlike {@link escape}, this value does not need to be escaped. It is passed separately to the database, which
   * will handle escaping.
   *
   * @param value The value to convert.
   * @param _options Options.
   */
  toBindableValue(value, _options) {
    return String(value);
  }
  toString() {
    var _a;
    try {
      return this.toSql({ dialect: (_a = this.usageContext) == null ? void 0 : _a.sequelize.dialect });
    } catch {
      return this.constructor.toString();
    }
  }
  static toString() {
    return this.name;
  }
  /**
   * Override this method to emit an error or a warning if the Data Type, as it is configured, is not compatible
   * with the current dialect.
   *
   * @param dialect The dialect using this data type.
   */
  _checkOptionSupport(dialect) {
    assertDataTypeSupported(dialect, this);
  }
  belongsToDialect(dialect) {
    return this.#dialect === dialect;
  }
  /**
   * Returns this DataType, using its dialect-specific subclass.
   *
   * @param dialect
   */
  toDialectDataType(dialect) {
    if (this.#dialect === dialect) {
      return this;
    }
    const DataTypeClass = this.constructor;
    const subClass = dialect.getDataTypeForDialect(DataTypeClass);
    const replacement = !subClass || subClass === DataTypeClass ? this.#dialect == null ? this : this.clone() : new subClass(this.options);
    replacement.#dialect = dialect;
    replacement._checkOptionSupport(dialect);
    if (this.usageContext) {
      replacement.attachUsageContext(this.usageContext);
    }
    return replacement;
  }
  /**
   * Returns a copy of this DataType, without usage context.
   * Designed to re-use a DataType on another Model.
   */
  clone() {
    return this._construct(this.options);
  }
  /**
   * @param usageContext
   * @private
   */
  attachUsageContext(usageContext) {
    if (this.usageContext && !(0, import_isEqual.default)(this.usageContext, usageContext)) {
      throw new Error(`This DataType is already attached to ${printContext(this.usageContext)}, and therefore cannot be attached to ${printContext(usageContext)}.`);
    }
    this.usageContext = Object.freeze(usageContext);
    return this;
  }
}
function printContext(usageContext) {
  if ("model" in usageContext) {
    return `attribute ${usageContext.model.name}#${usageContext.attributeName}`;
  }
  return `column "${usageContext.tableName}"."${usageContext.columnName}"`;
}
class STRING extends AbstractDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "STRING";
  options;
  constructor(lengthOrOptions, binary) {
    super();
    if ((0, import_isObject.default)(lengthOrOptions)) {
      this.options = {
        length: lengthOrOptions.length,
        binary: lengthOrOptions.binary ?? false
      };
    } else {
      this.options = {
        length: lengthOrOptions,
        binary: binary ?? false
      };
    }
  }
  _checkOptionSupport(dialect) {
    if (!dialect.supports.dataTypes.COLLATE_BINARY && this.options.binary) {
      (0, import_data_types_utils.throwUnsupportedDataType)(dialect, "STRING.BINARY");
    }
  }
  toSql(_options) {
    return (0, import_join_sql_fragments.joinSQLFragments)([
      `VARCHAR(${this.options.length ?? 255})`,
      this.options.binary && "BINARY"
    ]);
  }
  validate(value) {
    if (typeof value === "string") {
      return;
    }
    if (!this.options.binary) {
      import_errors.ValidationErrorItem.throwDataTypeValidationError(
        `${import_node_util.default.inspect(value)} is not a valid string. Only the string type is accepted for non-binary strings.`
      );
    }
    rejectBlobs(value);
    if (Buffer.isBuffer(value)) {
      return;
    }
    if (value instanceof Uint8Array || value instanceof ArrayBuffer) {
      return;
    }
    import_errors.ValidationErrorItem.throwDataTypeValidationError(
      `${import_node_util.default.inspect(value)} is not a valid binary value: Only strings, Buffer, Uint8Array and ArrayBuffer are supported.`
    );
  }
  get BINARY() {
    return this._construct({
      ...this.options,
      binary: true
    });
  }
  static get BINARY() {
    return new this({ binary: true });
  }
  escape(value, options) {
    if (Buffer.isBuffer(value)) {
      return options.dialect.escapeBuffer(value);
    }
    return options.dialect.escapeString(value);
  }
  toBindableValue(value) {
    return this.sanitize(value);
  }
}
class CHAR extends STRING {
  /** @hidden */
  static [kDataTypeIdentifier] = "CHAR";
  _checkOptionSupport(dialect) {
    if (!dialect.supports.dataTypes.CHAR) {
      (0, import_data_types_utils.throwUnsupportedDataType)(dialect, "CHAR");
    }
    if (!dialect.supports.dataTypes.COLLATE_BINARY && this.options.binary) {
      (0, import_data_types_utils.throwUnsupportedDataType)(dialect, "CHAR.BINARY");
    }
  }
  toSql() {
    return (0, import_join_sql_fragments.joinSQLFragments)([
      `CHAR(${this.options.length ?? 255})`,
      this.options.binary && "BINARY"
    ]);
  }
}
const validTextLengths = ["tiny", "medium", "long"];
class TEXT extends AbstractDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "TEXT";
  options;
  /**
   * @param lengthOrOptions could be tiny, medium, long.
   */
  constructor(lengthOrOptions) {
    var _a;
    super();
    const length = (_a = typeof lengthOrOptions === "object" ? lengthOrOptions.length : lengthOrOptions) == null ? void 0 : _a.toLowerCase();
    if (length != null && !validTextLengths.includes(length)) {
      throw new TypeError(`If specified, the "length" option must be one of: ${validTextLengths.join(", ")}`);
    }
    this.options = {
      length
    };
  }
  toSql() {
    switch (this.options.length) {
      case "tiny":
        return "TINYTEXT";
      case "medium":
        return "MEDIUMTEXT";
      case "long":
        return "LONGTEXT";
      default:
        return "TEXT";
    }
  }
  validate(value) {
    if (typeof value !== "string") {
      import_errors.ValidationErrorItem.throwDataTypeValidationError(
        import_node_util.default.format("%s is not a valid string", value)
      );
    }
  }
}
class CITEXT extends AbstractDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "CITEXT";
  toSql() {
    return "CITEXT";
  }
  _checkOptionSupport(dialect) {
    if (!dialect.supports.dataTypes.CITEXT) {
      (0, import_data_types_utils.throwUnsupportedDataType)(dialect, "case-insensitive text (CITEXT)");
    }
  }
  validate(value) {
    if (typeof value !== "string") {
      import_errors.ValidationErrorItem.throwDataTypeValidationError(
        import_node_util.default.format("%s is not a valid string", value)
      );
    }
  }
}
class BaseNumberDataType extends AbstractDataType {
  options;
  constructor(options) {
    super();
    this.options = { ...options };
  }
  getNumberSqlTypeName() {
    throw new Error(`getNumberSqlTypeName has not been implemented in ${this.constructor.name}`);
  }
  toSql(_options) {
    let result = this.getNumberSqlTypeName();
    if (this.options.unsigned && this._supportsNativeUnsigned(_options.dialect)) {
      result += " UNSIGNED";
    }
    if (this.options.zerofill) {
      result += " ZEROFILL";
    }
    return result;
  }
  _supportsNativeUnsigned(_dialect) {
    return false;
  }
  validate(value) {
    if (typeof value === "number" && Number.isInteger(value) && !Number.isSafeInteger(value)) {
      import_errors.ValidationErrorItem.throwDataTypeValidationError(
        import_node_util.default.format(`${this.constructor.name} received an integer % that is not a safely represented using the JavaScript number type. Use a JavaScript bigint or a string instead.`, value)
      );
    }
    if (!import_validator_extras.validator.isFloat(String(value))) {
      import_errors.ValidationErrorItem.throwDataTypeValidationError(
        `${import_node_util.default.inspect(value)} is not a valid ${this.toString().toLowerCase()}`
      );
    }
  }
  escape(value, options) {
    return this.toBindableValue(value, options);
  }
  toBindableValue(num, _options) {
    this.validate(num);
    if (Number.isNaN(num)) {
      return "NaN";
    }
    if (num === Number.NEGATIVE_INFINITY || num === Number.POSITIVE_INFINITY) {
      const sign = num < 0 ? "-" : "";
      return `${sign}Infinity`;
    }
    return String(num);
  }
  getBindParamSql(value, options) {
    return options.bindParam(value);
  }
  get UNSIGNED() {
    return this._construct({ ...this.options, unsigned: true });
  }
  get ZEROFILL() {
    return this._construct({ ...this.options, zerofill: true });
  }
  static get UNSIGNED() {
    return new this({ unsigned: true });
  }
  static get ZEROFILL() {
    return new this({ zerofill: true });
  }
}
class BaseIntegerDataType extends BaseNumberDataType {
  constructor(optionsOrLength) {
    if (typeof optionsOrLength === "number") {
      super({ length: optionsOrLength });
    } else {
      super(optionsOrLength ?? {});
    }
  }
  validate(value) {
    super.validate(value);
    if (typeof value === "number" && !Number.isInteger(value)) {
      import_errors.ValidationErrorItem.throwDataTypeValidationError(`${import_node_util.default.inspect(value)} is not a valid ${this.toString().toLowerCase()}`);
    }
    if (!import_validator_extras.validator.isInt(String(value))) {
      import_errors.ValidationErrorItem.throwDataTypeValidationError(`${import_node_util.default.inspect(value)} is not a valid ${this.toString().toLowerCase()}`);
    }
  }
  sanitize(value) {
    if (typeof value === "string" || typeof value === "bigint") {
      const out = (0, import_parse_number.parseNumber)(value);
      if (Number.isNaN(out)) {
        return value;
      }
      return out;
    }
    return value;
  }
  parseDatabaseValue(value) {
    return this.sanitize(value);
  }
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    if (this.options.zerofill && !dialect.supports.dataTypes.INTS.zerofill) {
      (0, import_data_types_utils.throwUnsupportedDataType)(dialect, `${this.getDataTypeId()}.ZEROFILL`);
    }
  }
  _supportsNativeUnsigned(_dialect) {
    return _dialect.supports.dataTypes.INTS.unsigned;
  }
  toSql(options) {
    let result = this.getNumberSqlTypeName();
    if (this.options.length != null) {
      result += `(${this.options.length})`;
    }
    if (this.options.unsigned && this._supportsNativeUnsigned(options.dialect)) {
      result += " UNSIGNED";
    }
    if (this.options.zerofill) {
      result += " ZEROFILL";
    }
    return result;
  }
}
class TINYINT extends BaseIntegerDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "TINYINT";
  getNumberSqlTypeName() {
    return "TINYINT";
  }
}
class SMALLINT extends BaseIntegerDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "SMALLINT";
  getNumberSqlTypeName() {
    return "SMALLINT";
  }
}
class MEDIUMINT extends BaseIntegerDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "MEDIUMINT";
  getNumberSqlTypeName() {
    return "MEDIUMINT";
  }
}
class INTEGER extends BaseIntegerDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "INTEGER";
  getNumberSqlTypeName() {
    return "INTEGER";
  }
}
class BIGINT extends BaseIntegerDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "BIGINT";
  getNumberSqlTypeName() {
    return "BIGINT";
  }
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    if (this.options.unsigned && !this._supportsNativeUnsigned(dialect)) {
      (0, import_data_types_utils.throwUnsupportedDataType)(dialect, `${this.getDataTypeId()}.UNSIGNED`);
    }
  }
  sanitize(value) {
    if (typeof value === "bigint") {
      return value;
    }
    if (typeof value !== "string" && typeof value !== "number") {
      return value;
    }
    return String((0, import_parse_number.parseBigInt)(value));
  }
}
class BaseDecimalNumberDataType extends BaseNumberDataType {
  constructor(precisionOrOptions, scale) {
    if ((0, import_isObject.default)(precisionOrOptions)) {
      super(precisionOrOptions);
    } else {
      super({});
      this.options.precision = precisionOrOptions;
      this.options.scale = scale;
    }
    if (this.options.scale != null && this.options.precision == null) {
      throw new Error(`The ${this.getDataTypeId()} DataType requires that the "precision" option be specified if the "scale" option is specified.`);
    }
    if (this.options.scale == null && this.options.precision != null) {
      throw new Error(`The ${this.getDataTypeId()} DataType requires that the "scale" option be specified if the "precision" option is specified.`);
    }
  }
  validate(value) {
    var _a, _b;
    if (Number.isNaN(value)) {
      const typeId = this.getDataTypeId();
      const dialect = this._getDialect();
      if ((_a = dialect.supports.dataTypes[typeId]) == null ? void 0 : _a.NaN) {
        return;
      }
      import_errors.ValidationErrorItem.throwDataTypeValidationError(`${import_node_util.default.inspect(value)} is not a valid ${this.toString().toLowerCase()}`);
    }
    if (value === Number.POSITIVE_INFINITY || value === Number.NEGATIVE_INFINITY) {
      const typeId = this.getDataTypeId();
      const dialect = this._getDialect();
      if ((_b = dialect.supports.dataTypes[typeId]) == null ? void 0 : _b.infinity) {
        return;
      }
      import_errors.ValidationErrorItem.throwDataTypeValidationError(`${import_node_util.default.inspect(value)} is not a valid ${this.toString().toLowerCase()}`);
    }
    super.validate(value);
  }
  isUnconstrained() {
    return this.options.scale == null && this.options.precision == null;
  }
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    const typeId = this.getDataTypeId();
    if (typeId !== "FLOAT" && typeId !== "DOUBLE" && typeId !== "DECIMAL" && typeId !== "REAL") {
      return;
    }
    const supportTable = dialect.supports.dataTypes[typeId];
    if (!supportTable) {
      (0, import_data_types_utils.throwUnsupportedDataType)(dialect, this.getDataTypeId());
    }
    if (!supportTable.zerofill && this.options.zerofill) {
      (0, import_data_types_utils.throwUnsupportedDataType)(dialect, `${this.getDataTypeId()}.ZEROFILL`);
    }
    if (typeId === "DECIMAL") {
      return;
    }
    const supportTable2 = dialect.supports.dataTypes[typeId];
    if (!supportTable2.scaleAndPrecision && (this.options.scale != null || this.options.precision != null)) {
      dialect.warnDataTypeIssue(`${dialect.name} does not support ${this.getDataTypeId()} with scale or precision specified. These options are ignored.`);
      delete this.options.scale;
      delete this.options.precision;
    }
  }
  toSql(options) {
    let sql = this.getNumberSqlTypeName();
    if (!this.isUnconstrained()) {
      sql += `(${this.options.precision}, ${this.options.scale})`;
    }
    if (this.options.unsigned && this._supportsNativeUnsigned(options.dialect)) {
      sql += " UNSIGNED";
    }
    if (this.options.zerofill) {
      sql += " ZEROFILL";
    }
    return sql;
  }
}
class FLOAT extends BaseDecimalNumberDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "FLOAT";
  getNumberSqlTypeName() {
    throw new Error(`getNumberSqlTypeName is not implemented by default in the FLOAT DataType because 'float' has very different meanings in different dialects.
In Sequelize, DataTypes.FLOAT must be a single-precision floating point, and DataTypes.DOUBLE must be a double-precision floating point.
Please override this method in your dialect, and provide the best available type for single-precision floating points.
If single-precision floating points are not available in your dialect, you may return a double-precision floating point type instead, as long as you print a warning.
If neither single precision nor double precision IEEE 754 floating point numbers are available in your dialect, you must throw an error in the _checkOptionSupport method.`);
  }
  _supportsNativeUnsigned(_dialect) {
    return _dialect.supports.dataTypes.FLOAT.unsigned;
  }
}
class REAL extends BaseDecimalNumberDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "REAL";
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    (0, import_deprecations.doNotUseRealDataType)();
  }
  _supportsNativeUnsigned(_dialect) {
    return _dialect.supports.dataTypes.REAL.unsigned;
  }
  getNumberSqlTypeName() {
    return "REAL";
  }
}
class DOUBLE extends BaseDecimalNumberDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "DOUBLE";
  _supportsNativeUnsigned(_dialect) {
    return _dialect.supports.dataTypes.DOUBLE.unsigned;
  }
  getNumberSqlTypeName() {
    return "DOUBLE PRECISION";
  }
}
class DECIMAL extends BaseDecimalNumberDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "DECIMAL";
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    const decimalSupport = dialect.supports.dataTypes.DECIMAL;
    if (!decimalSupport) {
      (0, import_data_types_utils.throwUnsupportedDataType)(dialect, "DECIMAL");
    }
    if (this.isUnconstrained() && !decimalSupport.unconstrained) {
      throw new Error(`${dialect.name} does not support unconstrained DECIMAL types. Please specify the "precision" and "scale" options.`);
    }
    if (!this.isUnconstrained() && !decimalSupport.constrained) {
      dialect.warnDataTypeIssue(`${dialect.name} does not support constrained DECIMAL types. The "precision" and "scale" options will be ignored.`);
      this.options.scale = void 0;
      this.options.precision = void 0;
    }
  }
  sanitize(value) {
    if (typeof value === "number") {
      if (Number.isNaN(value)) {
        return value;
      }
      if (Number.isInteger(value) && !Number.isSafeInteger(value)) {
        throw new Error(`${this.getDataTypeId()} received an integer ${import_node_util.default.inspect(value)} that is not a safely represented using the JavaScript number type. Use a JavaScript bigint or a string instead.`);
      }
    }
    return String(value);
  }
  _supportsNativeUnsigned(_dialect) {
    const decimalSupport = _dialect.supports.dataTypes.DECIMAL;
    return decimalSupport && decimalSupport.unsigned;
  }
  getNumberSqlTypeName() {
    return "DECIMAL";
  }
}
class BOOLEAN extends AbstractDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "BOOLEAN";
  toSql() {
    return "BOOLEAN";
  }
  validate(value) {
    if (typeof value !== "boolean") {
      import_errors.ValidationErrorItem.throwDataTypeValidationError(
        import_node_util.default.format("%O is not a valid boolean", value)
      );
    }
  }
  parseDatabaseValue(value) {
    if (typeof value === "boolean") {
      return value;
    }
    if (value === 1) {
      return true;
    }
    if (value === 0) {
      return false;
    }
    if (Buffer.isBuffer(value) && value.length === 1) {
      if (value[0] === 1) {
        return true;
      }
      if (value[0] === 0) {
        return false;
      }
    }
    throw new Error(`Received invalid boolean value from DB: ${import_node_util.default.inspect(value)}`);
  }
  escape(value) {
    return value ? "true" : "false";
  }
  toBindableValue(value) {
    return value ? "true" : "false";
  }
}
class TIME extends AbstractDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "TIME";
  options;
  /**
   * @param precisionOrOptions precision to allow storing milliseconds
   */
  constructor(precisionOrOptions) {
    super();
    this.options = {
      precision: typeof precisionOrOptions === "object" ? precisionOrOptions.precision : precisionOrOptions
    };
  }
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    if (this.options.precision != null && !dialect.supports.dataTypes.TIME.precision) {
      (0, import_data_types_utils.throwUnsupportedDataType)(dialect, "TIME(precision)");
    }
  }
  toSql() {
    if (this.options.precision != null) {
      return `TIME(${this.options.precision})`;
    }
    return "TIME";
  }
}
class DATE extends AbstractDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "DATE";
  options;
  /**
   * @param precisionOrOptions precision to allow storing milliseconds
   */
  constructor(precisionOrOptions) {
    super();
    this.options = {
      precision: typeof precisionOrOptions === "object" ? precisionOrOptions.precision : precisionOrOptions
    };
    if (this.options.precision != null && (this.options.precision < 0 || !Number.isInteger(this.options.precision))) {
      throw new TypeError('Option "precision" must be a positive integer');
    }
  }
  toSql() {
    if (this.options.precision != null) {
      return `DATETIME(${this.options.precision})`;
    }
    return "DATETIME";
  }
  validate(value) {
    if (!import_validator_extras.validator.isDate(String(value))) {
      import_errors.ValidationErrorItem.throwDataTypeValidationError(
        import_node_util.default.format("%O is not a valid date", value)
      );
    }
  }
  sanitize(value) {
    if (value instanceof Date || import_dayjs.default.isDayjs(value) || isMoment(value)) {
      return value;
    }
    if (typeof value === "string" || typeof value === "number") {
      return new Date(value);
    }
    throw new TypeError(`${import_node_util.default.inspect(value)} cannot be converted to a Date object, and is not a DayJS nor Moment object`);
  }
  parseDatabaseValue(value) {
    return this.sanitize(value);
  }
  areValuesEqual(value, originalValue) {
    if (originalValue && Boolean(value) && (value === originalValue || value instanceof Date && originalValue instanceof Date && value.getTime() === originalValue.getTime())) {
      return true;
    }
    if (!originalValue && !value && originalValue === value) {
      return true;
    }
    return false;
  }
  _applyTimezone(date, options) {
    if (options.timezone) {
      if ((0, import_dayjs2.isValidTimeZone)(options.timezone)) {
        return (0, import_dayjs.default)(date).tz(options.timezone);
      }
      return (0, import_dayjs.default)(date).utcOffset(options.timezone);
    }
    return (0, import_dayjs.default)(date);
  }
  toBindableValue(date, options) {
    return this._applyTimezone(date, options).format("YYYY-MM-DD HH:mm:ss.SSS Z");
  }
}
class DATEONLY extends AbstractDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "DATEONLY";
  toSql() {
    return "DATE";
  }
  toBindableValue(date, _options) {
    return import_dayjs.default.utc(date).format("YYYY-MM-DD");
  }
  sanitize(value) {
    if (typeof value !== "string" && typeof value !== "number" && !(value instanceof Date)) {
      throw new TypeError(`${value} cannot be normalized into a DateOnly string.`);
    }
    if (value) {
      return import_dayjs.default.utc(value).format("YYYY-MM-DD");
    }
    return value;
  }
  areValuesEqual(value, originalValue) {
    if (originalValue && Boolean(value) && originalValue === value) {
      return true;
    }
    if (!originalValue && !value && originalValue === value) {
      return true;
    }
    return false;
  }
}
class HSTORE extends AbstractDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "HSTORE";
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    if (!dialect.supports.dataTypes.HSTORE) {
      (0, import_data_types_utils.throwUnsupportedDataType)(dialect, "HSTORE");
    }
  }
  validate(value) {
    if (!(0, import_check.isPlainObject)(value)) {
      import_errors.ValidationErrorItem.throwDataTypeValidationError(import_node_util.default.format("%O is not a valid hstore, it must be a plain object", value));
    }
    const hstore = value;
    for (const key of Object.keys(hstore)) {
      if (!(0, import_check.isString)(hstore[key])) {
        import_errors.ValidationErrorItem.throwDataTypeValidationError(import_node_util.default.format(`%O is not a valid hstore, its values must be strings but ${key} is %O`, hstore, hstore[key]));
      }
    }
  }
  toSql() {
    return "HSTORE";
  }
}
class JSON extends AbstractDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "JSON";
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    if (!dialect.supports.dataTypes.JSON) {
      (0, import_data_types_utils.throwUnsupportedDataType)(dialect, "JSON");
    }
  }
  toBindableValue(value) {
    return globalThis.JSON.stringify(value);
  }
  toSql() {
    return "JSON";
  }
}
class JSONB extends JSON {
  /** @hidden */
  static [kDataTypeIdentifier] = "JSONB";
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    if (!dialect.supports.dataTypes.JSONB) {
      (0, import_data_types_utils.throwUnsupportedDataType)(dialect, "JSONB");
    }
  }
  toSql() {
    return "JSONB";
  }
}
class NOW extends AbstractDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "NOW";
  toSql() {
    return "NOW";
  }
}
class BLOB extends AbstractDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "BLOB";
  options;
  /**
   * @param lengthOrOptions could be tiny, medium, long.
   */
  constructor(lengthOrOptions) {
    super();
    this.options = {
      length: typeof lengthOrOptions === "object" ? lengthOrOptions.length : lengthOrOptions
    };
  }
  toSql() {
    switch (this.options.length) {
      case "tiny":
        return "TINYBLOB";
      case "medium":
        return "MEDIUMBLOB";
      case "long":
        return "LONGBLOB";
      default:
        return "BLOB";
    }
  }
  validate(value) {
    if (Buffer.isBuffer(value) || typeof value === "string" || value instanceof Uint8Array || value instanceof ArrayBuffer) {
      return;
    }
    rejectBlobs(value);
    import_errors.ValidationErrorItem.throwDataTypeValidationError(
      `${import_node_util.default.inspect(value)} is not a valid binary value: Only strings, Buffer, Uint8Array and ArrayBuffer are supported.`
    );
  }
  sanitize(value) {
    if (value instanceof Uint8Array || value instanceof ArrayBuffer) {
      return (0, import_buffer.makeBufferFromTypedArray)(value);
    }
    if (typeof value === "string") {
      return Buffer.from(value);
    }
    return value;
  }
  escape(value, options) {
    const buf = typeof value === "string" ? Buffer.from(value, "binary") : value;
    return options.dialect.escapeBuffer(buf);
  }
  getBindParamSql(value, options) {
    return options.bindParam(value);
  }
}
const defaultRangeParser = (0, import_range.buildRangeParser)(import_identity.default);
class RANGE extends AbstractDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "RANGE";
  options;
  /**
   * @param subtypeOrOptions A subtype for range, like RANGE(DATE)
   */
  constructor(subtypeOrOptions) {
    super();
    const subtypeRaw = ((0, import_data_types_utils.isDataType)(subtypeOrOptions) ? subtypeOrOptions : subtypeOrOptions == null ? void 0 : subtypeOrOptions.subtype) ?? new INTEGER();
    const subtype = (0, import_data_types_utils.isDataTypeClass)(subtypeRaw) ? new subtypeRaw() : subtypeRaw;
    this.options = {
      subtype
    };
  }
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    if (!dialect.supports.dataTypes.RANGE) {
      (0, import_data_types_utils.throwUnsupportedDataType)(dialect, "RANGE");
    }
  }
  toDialectDataType(dialect) {
    let replacement = super.toDialectDataType(dialect);
    if (replacement === this) {
      replacement = replacement.clone();
    }
    replacement.options.subtype = replacement.options.subtype.toDialectDataType(dialect);
    return replacement;
  }
  parseDatabaseValue(value) {
    if (typeof value === "string") {
      value = defaultRangeParser(value);
    }
    if (!Array.isArray(value)) {
      throw new Error(`DataTypes.RANGE received a non-range value from the database: ${import_node_util.default.inspect(value)}`);
    }
    return value.map((part) => {
      return {
        ...part,
        value: this.options.subtype.parseDatabaseValue(part.value)
      };
    });
  }
  sanitize(value) {
    if (!Array.isArray(value)) {
      return value;
    }
    if (value.length === 0) {
      return value;
    }
    let [low, high] = value;
    if (!(0, import_check.isPlainObject)(low)) {
      low = { value: low ?? null, inclusive: true };
    }
    if (!(0, import_check.isPlainObject)(high)) {
      high = { value: high ?? null, inclusive: false };
    }
    return [this.#sanitizeSide(low), this.#sanitizeSide(high)];
  }
  #sanitizeSide(rangePart) {
    if (rangePart.value == null) {
      return rangePart;
    }
    return { ...rangePart, value: this.options.subtype.sanitize(rangePart.value) };
  }
  validate(value) {
    if (!Array.isArray(value) || value.length !== 2 && value.length !== 0) {
      import_errors.ValidationErrorItem.throwDataTypeValidationError(
        `A range must either be an array with two elements, or an empty array for the empty range. Got ${import_node_util.default.inspect(value)}.`
      );
    }
  }
  toSql() {
    throw new Error("RANGE has not been implemented in this dialect.");
  }
}
class UUID extends AbstractDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "UUID";
  validate(value) {
    if (typeof value !== "string" || !import_validator_extras.validator.isUUID(value)) {
      import_errors.ValidationErrorItem.throwDataTypeValidationError(
        import_node_util.default.format("%O is not a valid uuid", value)
      );
    }
  }
  toSql() {
    return "UUID";
  }
}
class UUIDV1 extends AbstractDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "UUIDV1";
  validate(value) {
    if (typeof value !== "string" || !import_validator_extras.validator.isUUID(value, 1)) {
      import_errors.ValidationErrorItem.throwDataTypeValidationError(
        import_node_util.default.format("%O is not a valid uuidv1", value)
      );
    }
  }
  toSql() {
    throw new Error("toSQL should not be called on DataTypes.UUIDV1");
  }
}
class UUIDV4 extends AbstractDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "UUIDV4";
  validate(value) {
    if (typeof value !== "string" || !import_validator_extras.validator.isUUID(value, 4)) {
      import_errors.ValidationErrorItem.throwDataTypeValidationError(
        import_node_util.default.format("%O is not a valid uuidv4", value)
      );
    }
  }
  toSql() {
    throw new Error("toSQL should not be called on DataTypes.UUIDV4");
  }
}
class VIRTUAL extends AbstractDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "VIRTUAL";
  options;
  /**
   * @param [returnTypeOrOptions] return type for virtual type, or an option bag
   * @param [attributeDependencies] array of attributes this virtual type is dependent on
   */
  constructor(returnTypeOrOptions, attributeDependencies) {
    super();
    const returnType = returnTypeOrOptions == null ? void 0 : (0, import_data_types_utils.isDataType)(returnTypeOrOptions) ? returnTypeOrOptions : returnTypeOrOptions.returnType;
    this.options = {
      returnType: returnType ? (0, import_data_types_utils.dataTypeClassOrInstanceToInstance)(returnType) : void 0,
      attributeDependencies: ((0, import_data_types_utils.isDataType)(returnTypeOrOptions) ? attributeDependencies : returnTypeOrOptions == null ? void 0 : returnTypeOrOptions.attributeDependencies) ?? []
    };
  }
  toSql() {
    throw new Error("toSQL should not be called on DataTypes.VIRTUAL");
  }
  get returnType() {
    return this.options.returnType;
  }
  get attributeDependencies() {
    return this.options.attributeDependencies;
  }
}
class ENUM extends AbstractDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "ENUM";
  options;
  constructor(...args) {
    super();
    let values;
    if ((0, import_isObject.default)(args[0])) {
      if (args.length > 1) {
        throw new TypeError("DataTypes.ENUM has been constructed incorrectly: Its first parameter is the option bag or the array of values, but more than one parameter has been provided.");
      }
      if (Array.isArray(args[0])) {
        values = args[0];
      } else {
        values = args[0].values;
      }
    } else {
      values = args;
    }
    if (values.length === 0) {
      throw new TypeError(`
DataTypes.ENUM cannot be used without specifying its possible enum values.

Note that the "values" property has been removed from column definitions. The following is no longer supported:

sequelize.define('MyModel', {
  roles: {
    type: DataTypes.ENUM,
    values: ['admin', 'user'],
  },
});

Instead, define enum values like this:

sequelize.define('MyModel', {
  roles: {
    type: DataTypes.ENUM(['admin', 'user']),
  },
});
`.trim());
    }
    for (const value of values) {
      if (typeof value !== "string") {
        throw new TypeError(import_node_util.default.format(`One of the possible values passed to DataTypes.ENUM (%O) is not a string. Only strings can be used as enum values.`, value));
      }
    }
    this.options = {
      values
    };
  }
  validate(value) {
    if (!this.options.values.includes(value)) {
      import_errors.ValidationErrorItem.throwDataTypeValidationError(
        import_node_util.default.format("%O is not a valid choice for enum %O", value, this.options.values)
      );
    }
  }
  toSql(options) {
    throw new Error(`ENUM has not been implemented in the ${options.dialect.name} dialect.`);
  }
}
class ARRAY extends AbstractDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "ARRAY";
  options;
  /**
   * @param typeOrOptions type of array values
   */
  constructor(typeOrOptions) {
    super();
    const rawType = (0, import_data_types_utils.isDataType)(typeOrOptions) ? typeOrOptions : typeOrOptions == null ? void 0 : typeOrOptions.type;
    if (!rawType) {
      throw new TypeError("DataTypes.ARRAY is missing type definition for its values.");
    }
    this.options = {
      type: (0, import_data_types_utils.dataTypeClassOrInstanceToInstance)(rawType)
    };
  }
  toSql(options) {
    return `${this.options.type.toSql(options)}[]`;
  }
  validate(value) {
    if (!Array.isArray(value)) {
      import_errors.ValidationErrorItem.throwDataTypeValidationError(
        import_node_util.default.format("%O is not a valid array", value)
      );
    }
    for (const item of value) {
      this.options.type.validate(item);
    }
  }
  sanitize(value) {
    if (!Array.isArray(value)) {
      return value;
    }
    return value.map((item) => this.options.type.sanitize(item));
  }
  parseDatabaseValue(value) {
    if (!Array.isArray(value)) {
      throw new Error(`DataTypes.ARRAY Received a non-array value from database: ${import_node_util.default.inspect(value)}`);
    }
    return value.map((item) => this.options.type.parseDatabaseValue(item));
  }
  toBindableValue(value, _options) {
    return value.map((val) => this.options.type.toBindableValue(val, _options));
  }
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    if (!dialect.supports.dataTypes.ARRAY) {
      (0, import_data_types_utils.throwUnsupportedDataType)(dialect, "ARRAY");
    }
  }
  toDialectDataType(dialect) {
    let replacement = super.toDialectDataType(dialect);
    if (replacement === this) {
      replacement = replacement.clone();
    }
    replacement.options.type = replacement.options.type.toDialectDataType(dialect);
    return replacement;
  }
  attachUsageContext(usageContext) {
    this.options.type.attachUsageContext(usageContext);
    return super.attachUsageContext(usageContext);
  }
  static is(obj, type) {
    return obj instanceof ARRAY && obj.options.type instanceof type;
  }
}
class GEOMETRY extends AbstractDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "GEOMETRY";
  options;
  constructor(typeOrOptions, srid) {
    super();
    this.options = (0, import_isObject.default)(typeOrOptions) ? { ...typeOrOptions } : { type: typeOrOptions, srid };
  }
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    if (!dialect.supports.dataTypes.GEOMETRY) {
      (0, import_data_types_utils.throwUnsupportedDataType)(dialect, "GEOMETRY");
    }
  }
  validate(value) {
    try {
      (0, import_geo_json.assertIsGeoJson)(value);
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }
      import_errors.ValidationErrorItem.throwDataTypeValidationError(error.message);
    }
    return super.validate(value);
  }
  toSql() {
    return "GEOMETRY";
  }
}
class GEOGRAPHY extends GEOMETRY {
  /** @hidden */
  static [kDataTypeIdentifier] = "GEOGRAPHY";
  _checkOptionSupport(dialect) {
    if (!dialect.supports.dataTypes.GEOGRAPHY) {
      (0, import_data_types_utils.throwUnsupportedDataType)(dialect, "GEOGRAPHY");
    }
  }
  toSql() {
    return "GEOGRAPHY";
  }
}
class CIDR extends AbstractDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "CIDR";
  _checkOptionSupport(dialect) {
    if (!dialect.supports.dataTypes.CIDR) {
      (0, import_data_types_utils.throwUnsupportedDataType)(dialect, "CIDR");
    }
  }
  validate(value) {
    if (typeof value !== "string" || !import_validator_extras.validator.isIPRange(value)) {
      import_errors.ValidationErrorItem.throwDataTypeValidationError(
        import_node_util.default.format("%O is not a valid CIDR", value)
      );
    }
  }
  toSql() {
    return "CIDR";
  }
}
class INET extends AbstractDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "INET";
  _checkOptionSupport(dialect) {
    if (!dialect.supports.dataTypes.INET) {
      (0, import_data_types_utils.throwUnsupportedDataType)(dialect, "INET");
    }
  }
  validate(value) {
    if (typeof value !== "string" || !import_validator_extras.validator.isIP(value)) {
      import_errors.ValidationErrorItem.throwDataTypeValidationError(
        import_node_util.default.format("%O is not a valid INET", value)
      );
    }
  }
  toSql() {
    return "INET";
  }
}
class MACADDR extends AbstractDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "MACADDR";
  _checkOptionSupport(dialect) {
    if (!dialect.supports.dataTypes.MACADDR) {
      (0, import_data_types_utils.throwUnsupportedDataType)(dialect, "MACADDR");
    }
  }
  validate(value) {
    if (typeof value !== "string" || !import_validator_extras.validator.isMACAddress(value)) {
      import_errors.ValidationErrorItem.throwDataTypeValidationError(
        import_node_util.default.format("%O is not a valid MACADDR", value)
      );
    }
  }
  toSql() {
    return "MACADDR";
  }
}
class TSVECTOR extends AbstractDataType {
  /** @hidden */
  static [kDataTypeIdentifier] = "TSVECTOR";
  validate(value) {
    if (typeof value !== "string") {
      import_errors.ValidationErrorItem.throwDataTypeValidationError(
        import_node_util.default.format("%O is not a valid string", value)
      );
    }
  }
  _checkOptionSupport(dialect) {
    if (!dialect.supports.dataTypes.TSVECTOR) {
      (0, import_data_types_utils.throwUnsupportedDataType)(dialect, "TSVECTOR");
    }
  }
  toSql() {
    return "TSVECTOR";
  }
}
function rejectBlobs(value) {
  if (import_node_buffer.Blob && value instanceof import_node_buffer.Blob) {
    import_errors.ValidationErrorItem.throwDataTypeValidationError("Blob instances are not supported values, because reading their data is an async operation. Call blob.arrayBuffer() to get a buffer, and pass that to Sequelize instead.");
  }
}
function assertDataTypeSupported(dialect, dataType) {
  const typeId = dataType.getDataTypeId();
  if (typeId in dialect.supports.dataTypes && !dialect.supports.dataTypes[typeId]) {
    (0, import_data_types_utils.throwUnsupportedDataType)(dialect, typeId);
  }
}
//# sourceMappingURL=data-types.js.map
