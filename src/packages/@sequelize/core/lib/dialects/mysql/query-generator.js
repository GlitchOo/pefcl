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
  MySqlQueryGenerator: () => MySqlQueryGenerator
});
module.exports = __toCommonJS(query_generator_exports);
var import_check = require("../../utils/check");
var import_dialect = require("../../utils/dialect");
var import_join_sql_fragments = require("../../utils/join-sql-fragments");
var import_query_builder_utils = require("../../utils/query-builder-utils");
var import_sequelize_method = require("../../utils/sequelize-method");
var import_string = require("../../utils/string");
var import_data_types_utils = require("../abstract/data-types-utils");
var import_query_generator = require("../abstract/query-generator");
const _ = require("lodash");
const { MySqlQueryGeneratorTypeScript } = require("./query-generator-typescript");
const { Op } = require("../../operators");
const JSON_FUNCTION_REGEX = /^\s*((?:[a-z]+_){0,2}jsonb?(?:_[a-z]+){0,2})\([^)]*\)/i;
const JSON_OPERATOR_REGEX = /^\s*(->>?|@>|<@|\?[&|]?|\|{2}|#-)/i;
const TOKEN_CAPTURE_REGEX = /^\s*((?:(["'`])(?:(?!\2).|\2{2})*\2)|[\s\w]+|[()+,.;-])/i;
const FOREIGN_KEY_FIELDS = [
  "CONSTRAINT_NAME as constraint_name",
  "CONSTRAINT_NAME as constraintName",
  "CONSTRAINT_SCHEMA as constraintSchema",
  "CONSTRAINT_SCHEMA as constraintCatalog",
  "TABLE_NAME as tableName",
  "TABLE_SCHEMA as tableSchema",
  "TABLE_SCHEMA as tableCatalog",
  "COLUMN_NAME as columnName",
  "REFERENCED_TABLE_SCHEMA as referencedTableSchema",
  "REFERENCED_TABLE_SCHEMA as referencedTableCatalog",
  "REFERENCED_TABLE_NAME as referencedTableName",
  "REFERENCED_COLUMN_NAME as referencedColumnName"
].join(",");
const typeWithoutDefault = /* @__PURE__ */ new Set(["BLOB", "TEXT", "GEOMETRY", "JSON"]);
const ADD_COLUMN_QUERY_SUPPORTED_OPTIONS = /* @__PURE__ */ new Set();
const REMOVE_COLUMN_QUERY_SUPPORTED_OPTIONS = /* @__PURE__ */ new Set();
class MySqlQueryGenerator extends MySqlQueryGeneratorTypeScript {
  constructor(options) {
    super(options);
    this.OperatorMap = {
      ...this.OperatorMap,
      [Op.regexp]: "REGEXP",
      [Op.notRegexp]: "NOT REGEXP"
    };
  }
  createSchemaQuery(schemaName, options) {
    return (0, import_join_sql_fragments.joinSQLFragments)([
      "CREATE SCHEMA IF NOT EXISTS",
      this.quoteIdentifier(schemaName),
      (options == null ? void 0 : options.charset) && `DEFAULT CHARACTER SET ${this.escape(options.charset)}`,
      (options == null ? void 0 : options.collate) && `DEFAULT COLLATE ${this.escape(options.collate)}`,
      ";"
    ]);
  }
  dropSchemaQuery(schemaName) {
    return `DROP SCHEMA IF EXISTS ${this.quoteIdentifier(schemaName)};`;
  }
  // TODO: typescript - protected
  _getTechnicalSchemaNames() {
    return ["MYSQL", "INFORMATION_SCHEMA", "PERFORMANCE_SCHEMA", "SYS", "mysql", "information_schema", "performance_schema", "sys"];
  }
  listSchemasQuery(options) {
    const schemasToSkip = this._getTechnicalSchemaNames();
    if (Array.isArray(options == null ? void 0 : options.skip)) {
      schemasToSkip.push(...options.skip);
    }
    return (0, import_join_sql_fragments.joinSQLFragments)([
      "SELECT SCHEMA_NAME as schema_name",
      "FROM INFORMATION_SCHEMA.SCHEMATA",
      `WHERE SCHEMA_NAME NOT IN (${schemasToSkip.map((schema) => this.escape(schema)).join(", ")})`,
      ";"
    ]);
  }
  versionQuery() {
    return "SELECT VERSION() as `version`";
  }
  createTableQuery(tableName, attributes, options) {
    options = {
      engine: "InnoDB",
      charset: null,
      rowFormat: null,
      ...options
    };
    const primaryKeys = [];
    const foreignKeys = {};
    const attrStr = [];
    for (const attr in attributes) {
      if (!Object.prototype.hasOwnProperty.call(attributes, attr)) {
        continue;
      }
      const dataType = attributes[attr];
      let match;
      if (dataType.includes("PRIMARY KEY")) {
        primaryKeys.push(attr);
        if (dataType.includes("REFERENCES")) {
          match = dataType.match(/^(.+) (REFERENCES.*)$/);
          attrStr.push(`${this.quoteIdentifier(attr)} ${match[1].replace("PRIMARY KEY", "")}`);
          foreignKeys[attr] = match[2];
        } else {
          attrStr.push(`${this.quoteIdentifier(attr)} ${dataType.replace("PRIMARY KEY", "")}`);
        }
      } else if (dataType.includes("REFERENCES")) {
        match = dataType.match(/^(.+) (REFERENCES.*)$/);
        attrStr.push(`${this.quoteIdentifier(attr)} ${match[1]}`);
        foreignKeys[attr] = match[2];
      } else {
        attrStr.push(`${this.quoteIdentifier(attr)} ${dataType}`);
      }
    }
    const table = this.quoteTable(tableName);
    let attributesClause = attrStr.join(", ");
    const pkString = primaryKeys.map((pk) => this.quoteIdentifier(pk)).join(", ");
    if (options.uniqueKeys) {
      _.each(options.uniqueKeys, (columns, indexName) => {
        if (typeof indexName !== "string") {
          indexName = `uniq_${tableName}_${columns.fields.join("_")}`;
        }
        attributesClause += `, UNIQUE ${this.quoteIdentifier(indexName)} (${columns.fields.map((field) => this.quoteIdentifier(field)).join(", ")})`;
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
    return (0, import_join_sql_fragments.joinSQLFragments)([
      "CREATE TABLE IF NOT EXISTS",
      table,
      `(${attributesClause})`,
      `ENGINE=${options.engine}`,
      options.comment && typeof options.comment === "string" && `COMMENT ${this.escape(options.comment)}`,
      options.charset && `DEFAULT CHARSET=${options.charset}`,
      options.collate && `COLLATE ${options.collate}`,
      options.initialAutoIncrement && `AUTO_INCREMENT=${options.initialAutoIncrement}`,
      options.rowFormat && `ROW_FORMAT=${options.rowFormat}`,
      ";"
    ]);
  }
  showTablesQuery(schemaName) {
    let query = "SELECT TABLE_NAME, TABLE_SCHEMA FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'";
    if (schemaName) {
      query += ` AND TABLE_SCHEMA = ${this.escape(schemaName)}`;
    } else {
      const technicalSchemas = this._getTechnicalSchemaNames();
      query += ` AND TABLE_SCHEMA NOT IN (${technicalSchemas.map((schema) => this.escape(schema)).join(", ")})`;
    }
    return `${query};`;
  }
  tableExistsQuery(table) {
    const tableName = this.escape(this.quoteTable(table).slice(1, -1));
    return `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME = ${tableName} AND TABLE_SCHEMA = ${this.escape(this.sequelize.config.database)}`;
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
      type: (0, import_data_types_utils.normalizeDataType)(dataType.type, this.dialect)
    };
    return (0, import_join_sql_fragments.joinSQLFragments)([
      "ALTER TABLE",
      this.quoteTable(table),
      "ADD",
      this.quoteIdentifier(key),
      this.attributeToSQL(dataType, {
        context: "addColumn",
        tableName: table,
        foreignKey: key
      }),
      ";"
    ]);
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
    return (0, import_join_sql_fragments.joinSQLFragments)([
      "ALTER TABLE",
      this.quoteTable(tableName),
      "DROP",
      this.quoteIdentifier(attributeName),
      ";"
    ]);
  }
  changeColumnQuery(tableName, attributes) {
    const attrString = [];
    const constraintString = [];
    for (const attributeName in attributes) {
      let definition = attributes[attributeName];
      if (definition.includes("REFERENCES")) {
        const attrName = this.quoteIdentifier(attributeName);
        definition = definition.replace(/.+?(?=REFERENCES)/, "");
        constraintString.push(`FOREIGN KEY (${attrName}) ${definition}`);
      } else {
        attrString.push(`\`${attributeName}\` \`${attributeName}\` ${definition}`);
      }
    }
    return (0, import_join_sql_fragments.joinSQLFragments)([
      "ALTER TABLE",
      this.quoteTable(tableName),
      attrString.length && `CHANGE ${attrString.join(", ")}`,
      constraintString.length && `ADD ${constraintString.join(", ")}`,
      ";"
    ]);
  }
  renameColumnQuery(tableName, attrBefore, attributes) {
    const attrString = [];
    for (const attrName in attributes) {
      const definition = attributes[attrName];
      attrString.push(`\`${attrBefore}\` \`${attrName}\` ${definition}`);
    }
    return (0, import_join_sql_fragments.joinSQLFragments)([
      "ALTER TABLE",
      this.quoteTable(tableName),
      "CHANGE",
      attrString.join(", "),
      ";"
    ]);
  }
  handleSequelizeMethod(smth, tableName, factory, options, prepend) {
    if (smth instanceof import_sequelize_method.Json) {
      if (smth.conditions) {
        const conditions = this.parseConditionObject(smth.conditions).map((condition) => `${this.jsonPathExtractionQuery(condition.path[0], _.tail(condition.path))} = '${condition.value}'`);
        return conditions.join(" AND ");
      }
      if (smth.path) {
        let str;
        if (this._checkValidJsonStatement(smth.path)) {
          str = smth.path;
        } else {
          const paths = _.toPath(smth.path);
          const column = paths.shift();
          str = this.jsonPathExtractionQuery(column, paths);
        }
        if (smth.value) {
          str += ` = ${this.escape(smth.value, void 0, options)}`;
        }
        return str;
      }
    } else if (smth instanceof import_sequelize_method.Cast) {
      if (/timestamp/i.test(smth.type)) {
        smth.type = "datetime";
      } else if (smth.json && /boolean/i.test(smth.type)) {
        smth.type = "char";
      } else if (/double precision/i.test(smth.type) || /boolean/i.test(smth.type) || /integer/i.test(smth.type)) {
        smth.type = "decimal";
      } else if (/text/i.test(smth.type)) {
        smth.type = "char";
      }
    }
    return super.handleSequelizeMethod(smth, tableName, factory, options, prepend);
  }
  _toJSONValue(value) {
    if (typeof value === "boolean") {
      return value.toString();
    }
    if (value === null) {
      return "null";
    }
    return value;
  }
  truncateTableQuery(tableName) {
    return `TRUNCATE ${this.quoteTable(tableName)}`;
  }
  deleteQuery(tableName, where, options = {}, model) {
    let query = `DELETE FROM ${this.quoteTable(tableName)}`;
    where = this.getWhereConditions(where, null, model, options);
    if (where) {
      query += ` WHERE ${where}`;
    }
    if (options.limit) {
      query += ` LIMIT ${this.escape(options.limit, void 0, _.pick(options, ["bind", "replacements"]))}`;
    }
    return query;
  }
  showConstraintsQuery(table, constraintName) {
    const tableName = table.tableName || table;
    const schemaName = table.schema;
    return (0, import_join_sql_fragments.joinSQLFragments)([
      "SELECT CONSTRAINT_CATALOG AS constraintCatalog,",
      "CONSTRAINT_NAME AS constraintName,",
      "CONSTRAINT_SCHEMA AS constraintSchema,",
      "CONSTRAINT_TYPE AS constraintType,",
      "TABLE_NAME AS tableName,",
      "TABLE_SCHEMA AS tableSchema",
      "from INFORMATION_SCHEMA.TABLE_CONSTRAINTS",
      `WHERE table_name='${tableName}'`,
      constraintName && `AND constraint_name = '${constraintName}'`,
      schemaName && `AND TABLE_SCHEMA = '${schemaName}'`,
      ";"
    ]);
  }
  attributeToSQL(attribute, options) {
    if (!_.isPlainObject(attribute)) {
      attribute = {
        type: attribute
      };
    }
    const attributeString = (0, import_data_types_utils.attributeTypeToSql)(attribute.type, { escape: this.escape.bind(this), dialect: this.dialect });
    let template = attributeString;
    if (attribute.allowNull === false) {
      template += " NOT NULL";
    }
    if (attribute.autoIncrement) {
      template += " auto_increment";
    }
    if (!typeWithoutDefault.has(attributeString) && attribute.type._binary !== true && (0, import_query_builder_utils.defaultValueSchemable)(attribute.defaultValue)) {
      template += ` DEFAULT ${this.escape(attribute.defaultValue)}`;
    }
    if (attribute.unique === true) {
      template += " UNIQUE";
    }
    if (attribute.primaryKey) {
      template += " PRIMARY KEY";
    }
    if (attribute.comment) {
      template += ` COMMENT ${this.escape(attribute.comment)}`;
    }
    if (attribute.first) {
      template += " FIRST";
    }
    if (attribute.after) {
      template += ` AFTER ${this.quoteIdentifier(attribute.after)}`;
    }
    if ((!options || !options.withoutForeignKeyConstraints) && attribute.references) {
      if (options && options.context === "addColumn" && options.foreignKey) {
        const fkName = this.quoteIdentifier(`${this.extractTableDetails(options.tableName).tableName}_${options.foreignKey}_foreign_idx`);
        template += `, ADD CONSTRAINT ${fkName} FOREIGN KEY (${this.quoteIdentifier(options.foreignKey)})`;
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
      if (attribute.onUpdate) {
        template += ` ON UPDATE ${attribute.onUpdate.toUpperCase()}`;
      }
    }
    return template;
  }
  attributesToSQL(attributes, options) {
    const result = {};
    for (const key in attributes) {
      const attribute = attributes[key];
      result[attribute.field || key] = this.attributeToSQL(attribute, options);
    }
    return result;
  }
  /**
   * Check whether the statement is json function or simple path
   *
   * @param   {string}  stmt  The statement to validate
   * @returns {boolean}       true if the given statement is json function
   * @throws  {Error}         throw if the statement looks like json function but has invalid token
   * @private
   */
  _checkValidJsonStatement(stmt) {
    if (typeof stmt !== "string") {
      return false;
    }
    let currentIndex = 0;
    let openingBrackets = 0;
    let closingBrackets = 0;
    let hasJsonFunction = false;
    let hasInvalidToken = false;
    while (currentIndex < stmt.length) {
      const string = stmt.slice(currentIndex);
      const functionMatches = JSON_FUNCTION_REGEX.exec(string);
      if (functionMatches) {
        currentIndex += functionMatches[0].indexOf("(");
        hasJsonFunction = true;
        continue;
      }
      const operatorMatches = JSON_OPERATOR_REGEX.exec(string);
      if (operatorMatches) {
        currentIndex += operatorMatches[0].length;
        hasJsonFunction = true;
        continue;
      }
      const tokenMatches = TOKEN_CAPTURE_REGEX.exec(string);
      if (tokenMatches) {
        const capturedToken = tokenMatches[1];
        if (capturedToken === "(") {
          openingBrackets++;
        } else if (capturedToken === ")") {
          closingBrackets++;
        } else if (capturedToken === ";") {
          hasInvalidToken = true;
          break;
        }
        currentIndex += tokenMatches[0].length;
        continue;
      }
      break;
    }
    if (hasJsonFunction && (hasInvalidToken || openingBrackets !== closingBrackets)) {
      throw new Error(`Invalid json statement: ${stmt}`);
    }
    return hasJsonFunction;
  }
  /**
   * Generates an SQL query that returns all foreign keys of a table.
   *
   * @param {object} table The table.
   * @returns {string} The generated sql query.
   * @private
   */
  getForeignKeysQuery(table) {
    const tableName = table.tableName || table;
    const schemaName = table.schema || this.sequelize.config.database;
    return (0, import_join_sql_fragments.joinSQLFragments)([
      "SELECT",
      FOREIGN_KEY_FIELDS,
      `FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE where TABLE_NAME = '${tableName}'`,
      `AND CONSTRAINT_NAME!='PRIMARY' AND CONSTRAINT_SCHEMA='${schemaName}'`,
      "AND REFERENCED_TABLE_NAME IS NOT NULL",
      ";"
    ]);
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
    const quotedSchemaName = table.schema ? wrapSingleQuote(table.schema) : "";
    const quotedTableName = wrapSingleQuote(table.tableName || table);
    const quotedColumnName = wrapSingleQuote(columnName);
    return (0, import_join_sql_fragments.joinSQLFragments)([
      "SELECT",
      FOREIGN_KEY_FIELDS,
      "FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE",
      "WHERE (",
      [
        `REFERENCED_TABLE_NAME = ${quotedTableName}`,
        table.schema && `AND REFERENCED_TABLE_SCHEMA = ${quotedSchemaName}`,
        `AND REFERENCED_COLUMN_NAME = ${quotedColumnName}`
      ],
      ") OR (",
      [
        `TABLE_NAME = ${quotedTableName}`,
        table.schema && `AND TABLE_SCHEMA = ${quotedSchemaName}`,
        `AND COLUMN_NAME = ${quotedColumnName}`,
        "AND REFERENCED_TABLE_NAME IS NOT NULL"
      ],
      ")"
    ]);
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
    return (0, import_join_sql_fragments.joinSQLFragments)([
      "ALTER TABLE",
      this.quoteTable(tableName),
      "DROP FOREIGN KEY",
      this.quoteIdentifier(foreignKey),
      ";"
    ]);
  }
  /**
   * Generates an SQL query that extract JSON property of given path.
   *
   * @param   {string}               column  The JSON column
   * @param   {string|Array<string>} [path]  The path to extract (optional)
   * @returns {string}                       The generated sql query
   * @private
   */
  jsonPathExtractionQuery(column, path) {
    let paths = _.toPath(path);
    const quotedColumn = this.isIdentifierQuoted(column) ? column : this.quoteIdentifier(column);
    paths = paths.map((subPath) => {
      return /\D/.test(subPath) ? (0, import_dialect.addTicks)(subPath, '"') : subPath;
    });
    const pathStr = this.escape(["$"].concat(paths).join(".").replace(/\.(\d+)(?:(?=\.)|$)/g, (__, digit) => `[${digit}]`));
    return `json_unquote(json_extract(${quotedColumn},${pathStr}))`;
  }
}
function wrapSingleQuote(identifier) {
  return (0, import_dialect.addTicks)(identifier, "'");
}
//# sourceMappingURL=query-generator.js.map
