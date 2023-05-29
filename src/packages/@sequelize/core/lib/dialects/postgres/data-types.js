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
  BIGINT: () => BIGINT,
  BLOB: () => BLOB,
  DATE: () => DATE,
  DATEONLY: () => DATEONLY,
  DECIMAL: () => DECIMAL,
  DOUBLE: () => DOUBLE,
  ENUM: () => ENUM,
  FLOAT: () => FLOAT,
  GEOGRAPHY: () => GEOGRAPHY,
  GEOMETRY: () => GEOMETRY,
  HSTORE: () => HSTORE,
  INTEGER: () => INTEGER,
  MEDIUMINT: () => MEDIUMINT,
  RANGE: () => RANGE,
  SMALLINT: () => SMALLINT,
  TEXT: () => TEXT,
  TINYINT: () => TINYINT
});
module.exports = __toCommonJS(data_types_exports);
var import_node_assert = __toESM(require("node:assert"));
var import_wkx = __toESM(require("wkx"));
var import_check = require("../../utils/check.js");
var BaseTypes = __toESM(require("../abstract/data-types"));
var Hstore = __toESM(require("./hstore"));
var import_query_generator = require("./query-generator");
var RangeParser = __toESM(require("./range"));
function removeUnsupportedIntegerOptions(dataType, dialect) {
  if (dataType.options.length != null) {
    dialect.warnDataTypeIssue(`${dialect.name} does not support ${dataType.getDataTypeId()} with length specified. This options is ignored.`);
    delete dataType.options.length;
  }
}
class DATEONLY extends BaseTypes.DATEONLY {
  toBindableValue(value, options) {
    if (value === Number.POSITIVE_INFINITY) {
      return "infinity";
    }
    if (value === Number.NEGATIVE_INFINITY) {
      return "-infinity";
    }
    return super.toBindableValue(value, options);
  }
  sanitize(value) {
    if (value === Number.POSITIVE_INFINITY || value === Number.NEGATIVE_INFINITY) {
      return value;
    }
    if (typeof value === "string") {
      const lower = value.toLowerCase();
      if (lower === "infinity") {
        return Number.POSITIVE_INFINITY;
      }
      if (lower === "-infinity") {
        return Number.NEGATIVE_INFINITY;
      }
    }
    return super.sanitize(value);
  }
}
class DECIMAL extends BaseTypes.DECIMAL {
  // TODO: add check constraint >= 0 if unsigned is true
}
class TEXT extends BaseTypes.TEXT {
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    if (this.options.length) {
      dialect.warnDataTypeIssue(
        `${dialect.name} does not support TEXT with options. Plain TEXT will be used instead.`
      );
      this.options.length = void 0;
    }
  }
}
class DATE extends BaseTypes.DATE {
  toSql() {
    if (this.options.precision != null) {
      return `TIMESTAMP(${this.options.precision}) WITH TIME ZONE`;
    }
    return "TIMESTAMP WITH TIME ZONE";
  }
  validate(value) {
    if (value === Number.POSITIVE_INFINITY || value === Number.NEGATIVE_INFINITY) {
      return;
    }
    super.validate(value);
  }
  toBindableValue(value, options) {
    if (value === Number.POSITIVE_INFINITY) {
      return "infinity";
    }
    if (value === Number.NEGATIVE_INFINITY) {
      return "-infinity";
    }
    return super.toBindableValue(value, options);
  }
  sanitize(value) {
    if (value == null) {
      return value;
    }
    if (value === Number.POSITIVE_INFINITY || value === Number.NEGATIVE_INFINITY) {
      return value;
    }
    if (value instanceof Date) {
      return value;
    }
    if (typeof value === "string") {
      const lower = value.toLowerCase();
      if (lower === "infinity") {
        return Number.POSITIVE_INFINITY;
      }
      if (lower === "-infinity") {
        return Number.NEGATIVE_INFINITY;
      }
    }
    return super.sanitize(value);
  }
}
class TINYINT extends BaseTypes.TINYINT {
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    removeUnsupportedIntegerOptions(this, dialect);
  }
  // TODO: add >= 0 =< 2^8-1 check when the unsigned option is true
  // TODO: add >= -2^7 =< 2^7-1 check when the unsigned option is false
  toSql() {
    return "SMALLINT";
  }
}
class SMALLINT extends BaseTypes.SMALLINT {
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    removeUnsupportedIntegerOptions(this, dialect);
  }
  // TODO: add >= 0 =< 2^16-1 check when the unsigned option is true
  toSql() {
    if (this.options.unsigned) {
      return "INTEGER";
    }
    return "SMALLINT";
  }
}
class MEDIUMINT extends BaseTypes.MEDIUMINT {
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    removeUnsupportedIntegerOptions(this, dialect);
  }
  // TODO: add >= 0 =< 2^24-1 check when the unsigned option is true
  // TODO: add >= -2^23 =< 2^23-1 check when the unsigned option is false
  toSql() {
    return "INTEGER";
  }
}
class INTEGER extends BaseTypes.INTEGER {
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    removeUnsupportedIntegerOptions(this, dialect);
  }
  // TODO: add >= 0 =< 2^32-1 check when the unsigned option is true
  toSql() {
    if (this.options.unsigned) {
      return "BIGINT";
    }
    return "INTEGER";
  }
}
class BIGINT extends BaseTypes.BIGINT {
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    removeUnsupportedIntegerOptions(this, dialect);
  }
}
class DOUBLE extends BaseTypes.DOUBLE {
  // TODO: add check constraint >= 0 if unsigned is true
}
class FLOAT extends BaseTypes.FLOAT {
  // TODO: add check constraint >= 0 if unsigned is true
  getNumberSqlTypeName() {
    return "REAL";
  }
}
class BLOB extends BaseTypes.BLOB {
  _checkOptionSupport(dialect) {
    super._checkOptionSupport(dialect);
    if (this.options.length) {
      dialect.warnDataTypeIssue(
        `${dialect.name} does not support BLOB (BYTEA) with options. Plain BYTEA will be used instead.`
      );
      this.options.length = void 0;
    }
  }
  toSql() {
    return "BYTEA";
  }
}
class GEOMETRY extends BaseTypes.GEOMETRY {
  toSql() {
    let result = "GEOMETRY";
    if (this.options.type) {
      result += `(${this.options.type.toUpperCase()}`;
      if (this.options.srid) {
        result += `,${this.options.srid}`;
      }
      result += ")";
    }
    return result;
  }
  parse(value) {
    const b = Buffer.from(value, "hex");
    return import_wkx.default.Geometry.parse(b).toGeoJSON({ shortCrs: true });
  }
  toBindableValue(value, options) {
    return `ST_GeomFromGeoJSON(${options.dialect.escapeString(JSON.stringify(value))})`;
  }
  getBindParamSql(value, options) {
    return `ST_GeomFromGeoJSON(${options.bindParam(value)})`;
  }
}
class GEOGRAPHY extends BaseTypes.GEOGRAPHY {
  toSql() {
    let result = "GEOGRAPHY";
    if (this.options.type) {
      result += `(${this.options.type}`;
      if (this.options.srid) {
        result += `,${this.options.srid}`;
      }
      result += ")";
    }
    return result;
  }
  toBindableValue(value, options) {
    return `ST_GeomFromGeoJSON(${options.dialect.escapeString(JSON.stringify(value))})`;
  }
  getBindParamSql(value, options) {
    return `ST_GeomFromGeoJSON(${options.bindParam(value)})`;
  }
}
class HSTORE extends BaseTypes.HSTORE {
  toBindableValue(value) {
    if (value == null) {
      return value;
    }
    return Hstore.stringify(value);
  }
}
class RANGE extends BaseTypes.RANGE {
  toBindableValue(values, options) {
    if (!Array.isArray(values)) {
      return this.options.subtype.toBindableValue(values, options);
    }
    return RangeParser.stringify(values, (rangePart) => {
      const out = this.options.subtype.toBindableValue(rangePart, options);
      if (!(0, import_check.isString)(out)) {
        throw new Error("DataTypes.RANGE only accepts types that can be stringified.");
      }
      return out;
    });
  }
  escape(values, options) {
    const value = this.toBindableValue(values, options);
    if (!Array.isArray(values)) {
      return `'${value}'::${this.#toCastType()}`;
    }
    return `'${value}'`;
  }
  getBindParamSql(values, options) {
    const value = this.toBindableValue(values, options);
    if (!Array.isArray(values)) {
      return `${options.bindParam(value ?? "")}::${this.#toCastType()}`;
    }
    return options.bindParam(value);
  }
  toSql() {
    const subTypeClass = this.options.subtype.constructor;
    return RANGE.typeMap.subTypes[subTypeClass.getDataTypeId().toLowerCase()];
  }
  #toCastType() {
    const subTypeClass = this.options.subtype.constructor;
    return RANGE.typeMap.castTypes[subTypeClass.getDataTypeId().toLowerCase()];
  }
  static typeMap = {
    subTypes: {
      integer: "int4range",
      decimal: "numrange",
      date: "tstzrange",
      dateonly: "daterange",
      bigint: "int8range"
    },
    castTypes: {
      integer: "int4",
      decimal: "numeric",
      date: "timestamptz",
      dateonly: "date",
      bigint: "int8"
    }
  };
}
class ARRAY extends BaseTypes.ARRAY {
  escape(values, options) {
    const type = this.options.type;
    return `ARRAY[${values.map((value) => {
      return type.escape(value, options);
    }).join(",")}]::${type.toSql(options)}[]`;
  }
  getBindParamSql(values, options) {
    return options.bindParam(values.map((value) => {
      return this.options.type.toBindableValue(value, options);
    }));
  }
}
class ENUM extends BaseTypes.ENUM {
  toSql() {
    const context = this.usageContext;
    if (context == null) {
      throw new Error("Could not determine the name of this enum because it is not attached to an attribute or a column.");
    }
    let tableName;
    let columnName;
    if ("model" in context) {
      tableName = context.model.getTableName();
      const attribute = context.model.getAttributes()[context.attributeName];
      columnName = attribute.field ?? context.attributeName;
    } else {
      tableName = context.tableName;
      columnName = context.columnName;
    }
    const queryGenerator = context.sequelize.dialect.queryGenerator;
    (0, import_node_assert.default)(queryGenerator instanceof import_query_generator.PostgresQueryGenerator, "expected queryGenerator to be PostgresQueryGenerator");
    return queryGenerator.pgEnumName(tableName, columnName);
  }
}
//# sourceMappingURL=data-types.js.map
