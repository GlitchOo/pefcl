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
var query_generator_exports = {};
__export(query_generator_exports, {
  IBMiQueryGenerator: () => IBMiQueryGenerator
});
module.exports = __toCommonJS(query_generator_exports);
var import_inflection = require("inflection");
var import_model_internals = require("../../model-internals");
var import_check = require("../../utils/check");
var import_dialect = require("../../utils/dialect");
var import_sequelize_method = require("../../utils/sequelize-method");
var import_string = require("../../utils/string");
var import_query_builder_utils = require("../../utils/query-builder-utils");
var import_data_types_utils = require("../abstract/data-types-utils");
var import_query_generator = require("../abstract/query-generator");
const util = require("node:util");
const _ = require("lodash");
const { IBMiQueryGeneratorTypeScript } = require("./query-generator-typescript");
const DataTypes = require("../../data-types");
const { Model } = require("../../model");
const SqlString = require("../../sql-string");
const typeWithoutDefault = /* @__PURE__ */ new Set(["BLOB"]);
const CREATE_SCHEMA_QUERY_SUPPORTED_OPTIONS = /* @__PURE__ */ new Set();
const DROP_TABLE_QUERY_SUPPORTED_OPTIONS = /* @__PURE__ */ new Set();
const ADD_COLUMN_QUERY_SUPPORTED_OPTIONS = /* @__PURE__ */ new Set();
const REMOVE_COLUMN_QUERY_SUPPORTED_OPTIONS = /* @__PURE__ */ new Set();
class IBMiQueryGenerator extends IBMiQueryGeneratorTypeScript {
  // Version queries
  versionQuery() {
    return "SELECT CONCAT(OS_VERSION, CONCAT('.', OS_RELEASE)) AS VERSION FROM SYSIBMADM.ENV_SYS_INFO";
  }
  // Schema queries
  createSchemaQuery(schema, options) {
    if (options) {
      (0, import_check.rejectInvalidOptions)(
        "createSchemaQuery",
        this.dialect.name,
        import_query_generator.CREATE_SCHEMA_QUERY_SUPPORTABLE_OPTIONS,
        CREATE_SCHEMA_QUERY_SUPPORTED_OPTIONS,
        options
      );
    }
    return `CREATE SCHEMA "${schema}"`;
  }
  dropSchemaQuery(schema) {
    return `BEGIN IF EXISTS (SELECT * FROM SYSIBM.SQLSCHEMAS WHERE TABLE_SCHEM = ${schema ? `'${schema}'` : "CURRENT SCHEMA"}) THEN SET TRANSACTION ISOLATION LEVEL NO COMMIT; DROP SCHEMA "${schema ? `${schema}` : "CURRENT SCHEMA"}"; COMMIT; END IF; END`;
  }
  listSchemasQuery(options) {
    let skippedSchemas = "";
    if (options == null ? void 0 : options.skip) {
      for (let i = 0; i < options.skip.length; i++) {
        skippedSchemas += ` AND SCHEMA_NAME != ${this.escape(options.skip[i])}`;
      }
    }
    return `SELECT DISTINCT SCHEMA_NAME AS "schema_name" FROM QSYS2.SYSSCHEMAAUTH WHERE GRANTEE = CURRENT USER${skippedSchemas}`;
  }
  // Table queries
  createTableQuery(tableName, attributes, options) {
    const primaryKeys = [];
    const foreignKeys = /* @__PURE__ */ Object.create(null);
    const attrStr = [];
    for (const attr in attributes) {
      if (!Object.prototype.hasOwnProperty.call(attributes, attr)) {
        continue;
      }
      const dataType = attributes[attr];
      if (dataType.includes("PRIMARY KEY")) {
        primaryKeys.push(attr);
        attrStr.push(`${this.quoteIdentifier(attr)} ${dataType.replace("PRIMARY KEY", "")}`);
      } else {
        attrStr.push(`${this.quoteIdentifier(attr)} ${dataType}`);
      }
    }
    let attributesClause = attrStr.join(", ");
    const pkString = primaryKeys.map((pk) => this.quoteIdentifier(pk)).join(", ");
    if (options.uniqueKeys) {
      const sortedPrimaryKeys = [...primaryKeys];
      sortedPrimaryKeys.sort();
      _.each(options.uniqueKeys, (columns, indexName) => {
        const sortedColumnFields = [...columns.fields];
        sortedColumnFields.sort();
        const uniqueIsPrimary = sortedColumnFields.length === primaryKeys.length && sortedColumnFields.every((value, index) => {
          return value === sortedPrimaryKeys[index];
        });
        if (uniqueIsPrimary) {
          return true;
        }
        if (typeof indexName !== "string") {
          indexName = `uniq_${tableName}_${columns.fields.join("_")}`;
        }
        attributesClause += `, CONSTRAINT ${this.quoteIdentifier(indexName)} UNIQUE (${columns.fields.map((field) => this.quoteIdentifier(field)).join(", ")})`;
      });
    }
    if (pkString.length > 0) {
      attributesClause += `, PRIMARY KEY (${pkString})`;
    }
    for (const fkey in foreignKeys) {
      if (Object.prototype.hasOwnProperty.call(foreignKeys, fkey)) {
        attributesClause += `, FOREIGN KEY (${this.quoteIdentifier(fkey)}) ${foreignKeys[fkey]}`;
      }
    }
    let tableObject;
    if (typeof tableName === "string") {
      tableObject = { table: tableName };
    } else {
      tableObject = tableName;
    }
    return `BEGIN
    DECLARE CONTINUE HANDLER FOR SQLSTATE VALUE '42710'
      BEGIN END;
      CREATE TABLE ${tableName.schema ? `"${tableObject.schema}".` : ""}"${tableObject.table ? tableObject.table : tableObject.tableName}" (${attributesClause});
      END`;
  }
  dropTableQuery(tableName, options) {
    if (options) {
      (0, import_check.rejectInvalidOptions)(
        "dropTableQuery",
        this.dialect.name,
        import_query_generator.DROP_TABLE_QUERY_SUPPORTABLE_OPTIONS,
        DROP_TABLE_QUERY_SUPPORTED_OPTIONS,
        options
      );
    }
    return `DROP TABLE IF EXISTS ${this.quoteTable(tableName)}`;
  }
  showTablesQuery(schema) {
    return `SELECT TABLE_NAME FROM SYSIBM.SQLTABLES WHERE TABLE_TYPE = 'TABLE' AND TABLE_SCHEM = ${schema ? `'${schema}'` : "CURRENT SCHEMA"}`;
  }
  addColumnQuery(table, key, dataType, options) {
    if (options) {
      (0, import_check.rejectInvalidOptions)(
        "addColumnQuery",
        this.dialect.name,
        import_query_generator.ADD_COLUMN_QUERY_SUPPORTABLE_OPTIONS,
        ADD_COLUMN_QUERY_SUPPORTED_OPTIONS,
        options
      );
    }
    dataType = {
      ...dataType,
      // TODO: attributeToSQL SHOULD be using attributes in addColumnQuery
      //       but instead we need to pass the key along as the field here
      field: key,
      type: (0, import_data_types_utils.normalizeDataType)(dataType.type, this.dialect)
    };
    const definition = this.attributeToSQL(dataType, {
      context: "addColumn",
      tableName: table,
      foreignKey: key
    });
    return `ALTER TABLE ${this.quoteTable(table)} ADD ${this.quoteIdentifier(key)} ${definition}`;
  }
  removeColumnQuery(tableName, attributeName, options) {
    if (options) {
      (0, import_check.rejectInvalidOptions)(
        "removeColumnQuery",
        this.dialect.name,
        import_query_generator.REMOVE_COLUMN_QUERY_SUPPORTABLE_OPTIONS,
        REMOVE_COLUMN_QUERY_SUPPORTED_OPTIONS,
        options
      );
    }
    return `ALTER TABLE ${this.quoteTable(tableName)} DROP COLUMN ${this.quoteIdentifier(attributeName)}`;
  }
  changeColumnQuery(tableName, attributes) {
    const attrString = [];
    const constraintString = [];
    for (const attributeName in attributes) {
      let definition = attributes[attributeName];
      if (definition.includes("REFERENCES")) {
        const attrName = this.quoteIdentifier(attributeName);
        definition = definition.replace(/.+?(?=REFERENCES)/, "");
        const foreignKey = this.quoteIdentifier(`${attributeName}`);
        constraintString.push(`${foreignKey} FOREIGN KEY (${attrName}) ${definition}`);
      } else {
        attrString.push(`"${attributeName}" SET DATA TYPE ${definition}`);
      }
    }
    let finalQuery = "";
    if (attrString.length) {
      finalQuery += `ALTER COLUMN ${attrString.join(", ")}`;
      finalQuery += constraintString.length ? " " : "";
    }
    if (constraintString.length) {
      finalQuery += `ADD CONSTRAINT ${constraintString.join(", ")}`;
    }
    return `ALTER TABLE ${this.quoteTable(tableName)} ${finalQuery}`;
  }
  renameTableQuery(before, after) {
    return `RENAME TABLE ${this.quoteTable(before)} TO ${this.quoteTable(after)}`;
  }
  renameColumnQuery(tableName, attrBefore, attributes) {
    const attrString = [];
    for (const attrName in attributes) {
      const definition = attributes[attrName];
      attrString.push(`\`${attrBefore}\` \`${attrName}\` ${definition}`);
    }
    return `ALTER TABLE ${this.quoteTable(tableName)} RENAME COLUMN ${attrString.join(", ")};`;
  }
  handleSequelizeMethod(smth, tableName, factory, options, prepend) {
    if (smth instanceof import_sequelize_method.Json) {
      if (smth.conditions) {
        const conditions = this.parseConditionObject(smth.conditions).map((condition) => `${this.quoteIdentifier(condition.path[0])}->>'$.${_.tail(condition.path).join(".")}' = '${condition.value}'`);
        return conditions.join(" and ");
      }
      if (smth.path) {
        let str;
        if (this._checkValidJsonStatement(smth.path)) {
          str = smth.path;
        } else {
          let path = smth.path;
          let startWithDot = true;
          path = path.replace(/\.(\d+)\./g, "[$1].");
          path = path.replace(/\.(\d+)$/, "[$1]");
          path = path.split(".");
          let columnName = path.shift();
          const match = columnName.match(/\[\d+\]$/);
          if (match !== null) {
            path.unshift(columnName.slice(match.index));
            columnName = columnName.slice(0, Math.max(0, match.index));
            startWithDot = false;
          }
          str = `${this.quoteIdentifier(columnName)}->>'$${startWithDot ? "." : ""}${path.join(".")}'`;
        }
        if (smth.value) {
          str += util.format(" = %s", this.escape(smth.value, void 0, { replacements: options.replacements }));
        }
        return str;
      }
    } else if (smth instanceof import_sequelize_method.Cast) {
      if (/timestamp/i.test(smth.type)) {
        smth.type = "timestamp";
      } else if (smth.json && /boolean/i.test(smth.type)) {
        smth.type = "char";
      } else if (/double precision/i.test(smth.type) || /boolean/i.test(smth.type) || /integer/i.test(smth.type)) {
        smth.type = "integer";
      } else if (/text/i.test(smth.type)) {
        smth.type = "char";
      }
    }
    return super.handleSequelizeMethod(smth, tableName, factory, options, prepend);
  }
  escape(value, attribute, options) {
    if (value instanceof import_sequelize_method.SequelizeMethod) {
      return this.handleSequelizeMethod(value, void 0, void 0, { replacements: options.replacements });
    }
    if (value == null || (attribute == null ? void 0 : attribute.type) == null || typeof attribute.type === "string") {
      const format = value === null && options.where;
      return SqlString.escape(value, this.options.timezone, this.dialect, format);
    }
    if (!attribute.type.belongsToDialect(this.dialect)) {
      attribute = {
        ...attribute,
        type: attribute.type.toDialectDataType(this.dialect)
      };
    }
    if (options.isList && Array.isArray(value)) {
      const escapeOptions = { ...options, isList: false };
      return `(${value.map((valueItem) => {
        return this.escape(valueItem, attribute, escapeOptions);
      }).join(", ")})`;
    }
    this.validate(value, attribute);
    return attribute.type.escape(value, {
      // Users shouldn't have to worry about these args - just give them a function that takes a single arg
      escape: this.simpleEscape,
      field: attribute,
      timezone: this.options.timezone,
      operation: options.operation,
      dialect: this.dialect
    });
  }
  /*
    Returns an add index query.
    Parameters:
      - tableName -> Name of an existing table, possibly with schema.
      - options:
        - type: UNIQUE|FULLTEXT|SPATIAL
        - name: The name of the index. Default is <table>_<attr1>_<attr2>
        - fields: An array of attributes as string or as hash.
                  If the attribute is a hash, it must have the following content:
                  - name: The name of the attribute/column
                  - length: An integer. Optional
                  - order: 'ASC' or 'DESC'. Optional
        - parser
        - using
        - operator
        - concurrently: Pass CONCURRENT so other operations run while the index is created
      - rawTablename, the name of the table, without schema. Used to create the name of the index
   @private
  */
  addIndexQuery(tableName, _attributes, _options, rawTablename) {
    let options = _options || /* @__PURE__ */ Object.create(null);
    if (!Array.isArray(_attributes)) {
      options = _attributes;
    } else {
      options.fields = _attributes;
    }
    options.prefix = options.prefix || rawTablename || tableName;
    if (options.prefix && typeof options.prefix === "string") {
      options.prefix = options.prefix.replace(/\./g, "_");
    }
    const fieldsSql = options.fields.map((field) => {
      if (typeof field === "string") {
        return this.quoteIdentifier(field);
      }
      if (field instanceof import_sequelize_method.SequelizeMethod) {
        return this.handleSequelizeMethod(field);
      }
      let result = "";
      if (field.attribute) {
        field.name = field.attribute;
      }
      if (!field.name) {
        throw new Error(`The following index field has no name: ${util.inspect(field)}`);
      }
      result += this.quoteIdentifier(field.name);
      if (this.dialect.supports.index.length && field.length) {
        result += `(${field.length})`;
      }
      if (field.order) {
        result += ` ${field.order}`;
      }
      return result;
    });
    if (options.include) {
      throw new Error(`The include attribute for indexes is not supported by ${this.dialect.name} dialect`);
    }
    if (!options.name) {
      options = (0, import_string.nameIndex)(options, options.prefix);
    }
    options = (0, import_model_internals.conformIndex)(options);
    if (!this.dialect.supports.index.type) {
      delete options.type;
    }
    if (options.where) {
      options.where = this.whereQuery(options.where);
    }
    tableName = this.quoteTable(tableName);
    let schema;
    if (typeof options.schema === "string") {
      schema = this.quoteIdentifiers(options.schema);
    }
    if (options.unique) {
      return `BEGIN
      DECLARE CONTINUE HANDLER FOR SQLSTATE VALUE '42891'
        BEGIN END;
        ALTER TABLE ${tableName} ADD CONSTRAINT ${this.quoteIdentifiers(options.name)} UNIQUE (${fieldsSql.join(", ")}${options.operator ? ` ${options.operator}` : ""})${options.where ? ` ${options.where}` : ""};
      END`;
    }
    return `CREATE${options.unique ? " UNIQUE" : ""} INDEX ${schema ? ` ${schema}.` : ""}${this.quoteIdentifiers(options.name)} ON ${tableName} (${fieldsSql.join(", ")}${options.operator ? ` ${options.operator}` : ""})${options.where ? ` ${options.where}` : ""}`;
  }
  addConstraintQuery(tableName, options) {
    const query = super.addConstraintQuery(tableName, options);
    return query.replace(/;$/, "");
  }
  // _toJSONValue(value) {
  //   // true/false are stored as strings in mysql
  //   if (typeof value === 'boolean') {
  //     return value.toString();
  //   }
  //   // null is stored as a string in mysql
  //   if (value === null) {
  //     return 'null';
  //   }
  //   return value;
  // }
  updateQuery(tableName, attrValueHash, where, options, columnDefinitions) {
    const out = super.updateQuery(tableName, attrValueHash, where, options, columnDefinitions);
    out.query = (0, import_string.removeTrailingSemicolon)(out.query);
    return out;
  }
  arithmeticQuery(operator, tableName, where, incrementAmountsByField, extraAttributesToBeUpdated, options) {
    return (0, import_string.removeTrailingSemicolon)(super.arithmeticQuery(operator, tableName, where, incrementAmountsByField, extraAttributesToBeUpdated, options));
  }
  upsertQuery(tableName, insertValues, updateValues, where, model, options) {
    const aliasTable = `temp_${this.quoteTable(tableName)}`;
    let query = `MERGE INTO ${this.quoteTable(tableName)} `;
    const usingClause = `USING (
      SELECT * FROM (${this.quoteTable(tableName)}
      VALUES(42)
      ) AS ${aliasTable}("id") ON (${aliasTable}."id" = ${this.quoteTable(tableName)}."id")`;
    query += usingClause;
    query += ` WHEN MATCHED THEN ${this.updateQuery(tableName, tableName, where, options, updateValues)}
    WHEN NOT MATCHED THEN ${this.insertQuery(tableName, insertValues, model, options).sql}`;
    return query;
  }
  insertQuery(table, valueHash, modelAttributes, options) {
    const query = super.insertQuery(table, valueHash, modelAttributes, options);
    if (query.query[query.query.length - 1] === ";") {
      query.query = query.query.slice(0, -1);
      query.query = `SELECT * FROM FINAL TABLE (${query.query})`;
    }
    return query;
  }
  selectQuery(tableName, options, model) {
    let query = super.selectQuery(tableName, options, model);
    if (query[query.length - 1] === ";") {
      query = query.slice(0, -1);
    }
    return query;
  }
  bulkInsertQuery(tableName, fieldValueHashes, options, fieldMappedAttributes) {
    let query = super.bulkInsertQuery(tableName, fieldValueHashes, options, fieldMappedAttributes);
    if (query[query.length - 1] === ";") {
      query = query.slice(0, -1);
      query = `SELECT * FROM FINAL TABLE (${query})`;
    }
    return query;
  }
  truncateTableQuery(tableName) {
    return `TRUNCATE TABLE ${this.quoteTable(tableName)} IMMEDIATE`;
  }
  deleteQuery(tableName, where, options = {}, model) {
    let query = `DELETE FROM ${this.quoteTable(tableName)}`;
    where = this.getWhereConditions(where, null, model, options);
    if (where) {
      query += ` WHERE ${where}`;
    }
    if (options.offset || options.limit) {
      query += this.addLimitAndOffset(options, model);
    }
    return query;
  }
  /**
   * Returns an SQL fragment for adding result constraints.
   *
   * @param  {object} options An object with selectQuery options.
   * @returns {string}         The generated sql query.
   * @private
   */
  addLimitAndOffset(options) {
    let fragment = "";
    if (options.offset) {
      fragment += ` OFFSET ${this.escape(options.offset, void 0, options)} ROWS`;
    }
    if (options.limit) {
      fragment += ` FETCH NEXT ${this.escape(options.limit, void 0, options)} ROWS ONLY`;
    }
    return fragment;
  }
  // Indexes and constraints
  showConstraintsQuery(table, constraintName) {
    const tableName = table.tableName || table;
    const schemaName = table.schema;
    let sql = [
      'SELECT CONSTRAINT_NAME AS "constraintName",',
      'CONSTRAINT_SCHEMA AS "constraintSchema",',
      'CONSTRAINT_TYPE AS "constraintType",',
      'TABLE_NAME AS "tableName",',
      'TABLE_SCHEMA AS "tableSchema"',
      "from QSYS2.SYSCST",
      `WHERE table_name='${tableName}'`
    ].join(" ");
    if (constraintName) {
      sql += ` AND CONSTRAINT_NAME = '${constraintName}'`;
    }
    if (schemaName) {
      sql += ` AND TABLE_SCHEMA = '${schemaName}'`;
    }
    return sql;
  }
  // bindParam(bind) {
  //   return value => {
  //     bind.push(value);
  //     return '?';
  //   };
  // }
  attributeToSQL(attribute, options) {
    if (!_.isPlainObject(attribute)) {
      attribute = {
        type: attribute
      };
    }
    const attributeString = attribute.type.toString({ escape: this.escape.bind(this), dialect: this.dialect });
    let template = attributeString;
    if (attribute.type instanceof DataTypes.ENUM) {
      template = attribute.type.toSql({ dialect: this.dialect });
      if (options && options.context) {
        template += options.context === "changeColumn" ? " ADD" : "";
      }
      template += ` CHECK (${this.quoteIdentifier(attribute.field)} IN(${attribute.type.options.values.map((value) => {
        return this.escape(value, void 0, { replacements: options == null ? void 0 : options.replacements });
      }).join(", ")}))`;
    } else {
      template = (0, import_data_types_utils.attributeTypeToSql)(attribute.type, { dialect: this.dialect });
    }
    if (attribute.allowNull === false) {
      template += " NOT NULL";
    } else if (attribute.allowNull === true && (options && options.context === "changeColumn")) {
      template += " DROP NOT NULL";
    }
    if (attribute.autoIncrement) {
      template += " GENERATED BY DEFAULT AS IDENTITY (START WITH 1, INCREMENT BY 1)";
    }
    if (!typeWithoutDefault.has(attributeString) && attribute.type._binary !== true && (0, import_query_builder_utils.defaultValueSchemable)(attribute.defaultValue)) {
      if (attribute.defaultValue === true) {
        attribute.defaultValue = 1;
      } else if (attribute.defaultValue === false) {
        attribute.defaultValue = 0;
      }
      template += ` DEFAULT ${this.escape(attribute.defaultValue, void 0, { replacements: options == null ? void 0 : options.replacements })}`;
    }
    if (attribute.unique === true && !attribute.primaryKey) {
      template += " UNIQUE";
    }
    if (attribute.primaryKey) {
      template += " PRIMARY KEY";
    }
    if (attribute.first) {
      template += " FIRST";
    }
    if (attribute.after) {
      template += ` AFTER ${this.quoteIdentifier(attribute.after)}`;
    }
    if (attribute.references) {
      if (options && options.context === "addColumn" && options.foreignKey) {
        const attrName = this.quoteIdentifier(options.foreignKey);
        const fkName = this.quoteIdentifier(`${options.tableName}_${attrName}_foreign_idx`);
        template += ` ADD CONSTRAINT ${fkName} FOREIGN KEY (${attrName})`;
      }
      template += ` REFERENCES ${this.quoteTable(attribute.references.table)}`;
      if (attribute.references.key) {
        template += ` (${this.quoteIdentifier(attribute.references.key)})`;
      } else {
        template += ` (${this.quoteIdentifier("id")})`;
      }
      if (attribute.onDelete) {
        template += ` ON DELETE ${attribute.onDelete.toUpperCase()}`;
      }
      if (attribute.onUpdate && attribute.onUpdate.toUpperCase() !== "CASCADE") {
        template += ` ON UPDATE ${attribute.onUpdate.toUpperCase()}`;
      }
    }
    return template;
  }
  attributesToSQL(attributes, options) {
    const result = /* @__PURE__ */ Object.create(null);
    for (const key of Object.keys(attributes)) {
      const attribute = {
        ...attributes[key],
        field: attributes[key].field || key
      };
      result[attribute.field || key] = this.attributeToSQL(attribute, options);
    }
    return result;
  }
  /**
   * Generates an SQL query that returns all foreign keys of a table.
   *
   * @param  {object} table  The table.
   * @param  {string} schemaName The name of the schema.
   * @returns {string}            The generated sql query.
   * @private
   */
  getForeignKeysQuery(table, schemaName) {
    const quotedSchemaName = schemaName ? wrapSingleQuote(schemaName) : "CURRENT SCHEMA";
    const quotedTableName = wrapSingleQuote(table.tableName || table);
    const sql = [
      'SELECT FK_NAME AS "constraintName",',
      'PKTABLE_CAT AS "referencedTableCatalog",',
      'PKTABLE_SCHEM AS "referencedTableSchema",',
      'PKTABLE_NAME AS "referencedTableName",',
      'PKCOLUMN_NAME AS "referencedColumnName",',
      'FKTABLE_CAT AS "tableCatalog",',
      'FKTABLE_SCHEM AS "tableSchema",',
      'FKTABLE_NAME AS "tableName",',
      'FKTABLE_SCHEM AS "tableSchema",',
      'FKCOLUMN_NAME AS "columnName"',
      "FROM SYSIBM.SQLFOREIGNKEYS",
      `WHERE FKTABLE_SCHEM = ${quotedSchemaName}`,
      `AND FKTABLE_NAME = ${quotedTableName}`
    ].join(" ");
    return sql;
  }
  /**
   * Generates an SQL query that returns the foreign key constraint of a given column.
   *
   * @param  {object} table  The table.
   * @param  {string} columnName The name of the column.
   * @returns {string}            The generated sql query.
   * @private
   */
  getForeignKeyQuery(table, columnName) {
    const quotedSchemaName = table.schema ? wrapSingleQuote(table.schema) : "CURRENT SCHEMA";
    const quotedTableName = wrapSingleQuote(table.tableName || table);
    const quotedColumnName = wrapSingleQuote(columnName);
    const sql = [
      'SELECT FK_NAME AS "constraintName",',
      'PKTABLE_CAT AS "referencedTableCatalog",',
      'PKTABLE_SCHEM AS "referencedTableSchema",',
      'PKTABLE_NAME AS "referencedTableName",',
      'PKCOLUMN_NAME AS "referencedColumnName",',
      'FKTABLE_CAT AS "tableCatalog",',
      'FKTABLE_SCHEM AS "tableSchema",',
      'FKTABLE_NAME AS "tableName",',
      'FKTABLE_SCHEM AS "tableSchema",',
      'FKCOLUMN_NAME AS "columnName"',
      "FROM SYSIBM.SQLFOREIGNKEYS",
      `WHERE FKTABLE_SCHEM = ${quotedSchemaName}`,
      `AND FKTABLE_NAME = ${quotedTableName}`,
      `AND FKCOLUMN_NAME = ${quotedColumnName}`
    ].join(" ");
    return sql;
  }
  /**
   * Generates an SQL query that removes a foreign key from a table.
   *
   * @param  {string} tableName  The name of the table.
   * @param  {string} foreignKey The name of the foreign key constraint.
   * @returns {string}            The generated sql query.
   * @private
   */
  dropForeignKeyQuery(tableName, foreignKey) {
    return `ALTER TABLE ${this.quoteTable(tableName)}
      DROP FOREIGN KEY ${this.quoteIdentifier(foreignKey)};`;
  }
  booleanValue(value) {
    if (value) {
      return 1;
    }
    return 0;
  }
}
function wrapSingleQuote(identifier) {
  return (0, import_dialect.addTicks)(identifier, "'");
}
//# sourceMappingURL=query-generator.js.map
