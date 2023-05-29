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
  MsSqlQueryGenerator: () => MsSqlQueryGenerator
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
const DataTypes = require("../../data-types");
const { TableHints } = require("../../table-hints");
const { MsSqlQueryGeneratorTypeScript } = require("./query-generator-typescript");
const randomBytes = require("node:crypto").randomBytes;
const semver = require("semver");
const { Op } = require("../../operators");
function throwMethodUndefined(methodName) {
  throw new Error(`The method "${methodName}" is not defined! Please add it to your sql dialect.`);
}
const CREATE_DATABASE_QUERY_SUPPORTED_OPTIONS = /* @__PURE__ */ new Set(["collate"]);
const CREATE_SCHEMA_QUERY_SUPPORTED_OPTIONS = /* @__PURE__ */ new Set();
const DROP_TABLE_QUERY_SUPPORTED_OPTIONS = /* @__PURE__ */ new Set();
const ADD_COLUMN_QUERY_SUPPORTED_OPTIONS = /* @__PURE__ */ new Set();
class MsSqlQueryGenerator extends MsSqlQueryGeneratorTypeScript {
  createDatabaseQuery(databaseName, options) {
    if (options) {
      (0, import_check.rejectInvalidOptions)(
        "createDatabaseQuery",
        this.dialect.name,
        import_query_generator.CREATE_DATABASE_QUERY_SUPPORTABLE_OPTIONS,
        CREATE_DATABASE_QUERY_SUPPORTED_OPTIONS,
        options
      );
    }
    const collation = (options == null ? void 0 : options.collate) ? `COLLATE ${this.escape(options.collate)}` : "";
    return [
      "IF NOT EXISTS (SELECT * FROM sys.databases WHERE name =",
      wrapSingleQuote(databaseName),
      ")",
      "BEGIN",
      "CREATE DATABASE",
      this.quoteIdentifier(databaseName),
      `${collation};`,
      "END;"
    ].join(" ");
  }
  dropDatabaseQuery(databaseName) {
    return [
      "IF EXISTS (SELECT * FROM sys.databases WHERE name =",
      wrapSingleQuote(databaseName),
      ")",
      "BEGIN",
      "DROP DATABASE",
      this.quoteIdentifier(databaseName),
      ";",
      "END;"
    ].join(" ");
  }
  listDatabasesQuery() {
    return `SELECT name FROM sys.databases;`;
  }
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
    return [
      "IF NOT EXISTS (SELECT schema_name",
      "FROM information_schema.schemata",
      "WHERE schema_name =",
      wrapSingleQuote(schema),
      ")",
      "BEGIN",
      "EXEC sp_executesql N'CREATE SCHEMA",
      this.quoteIdentifier(schema),
      ";'",
      "END;"
    ].join(" ");
  }
  dropSchemaQuery(schema) {
    const quotedSchema = wrapSingleQuote(schema);
    return [
      "IF EXISTS (SELECT schema_name",
      "FROM information_schema.schemata",
      "WHERE schema_name =",
      quotedSchema,
      ")",
      "BEGIN",
      "DECLARE @id INT, @ms_sql NVARCHAR(2000);",
      "DECLARE @cascade TABLE (",
      "id INT NOT NULL IDENTITY PRIMARY KEY,",
      "ms_sql NVARCHAR(2000) NOT NULL );",
      "INSERT INTO @cascade ( ms_sql )",
      "SELECT CASE WHEN o.type IN ('F','PK')",
      "THEN N'ALTER TABLE ['+ s.name + N'].[' + p.name + N'] DROP CONSTRAINT [' + o.name + N']'",
      "ELSE N'DROP TABLE ['+ s.name + N'].[' + o.name + N']' END",
      "FROM sys.objects o",
      "JOIN sys.schemas s on o.schema_id = s.schema_id",
      "LEFT OUTER JOIN sys.objects p on o.parent_object_id = p.object_id",
      "WHERE o.type IN ('F', 'PK', 'U') AND s.name = ",
      quotedSchema,
      "ORDER BY o.type ASC;",
      "SELECT TOP 1 @id = id, @ms_sql = ms_sql FROM @cascade ORDER BY id;",
      "WHILE @id IS NOT NULL",
      "BEGIN",
      "BEGIN TRY EXEC sp_executesql @ms_sql; END TRY",
      "BEGIN CATCH BREAK; THROW; END CATCH;",
      "DELETE FROM @cascade WHERE id = @id;",
      "SELECT @id = NULL, @ms_sql = NULL;",
      "SELECT TOP 1 @id = id, @ms_sql = ms_sql FROM @cascade ORDER BY id;",
      "END",
      "EXEC sp_executesql N'DROP SCHEMA",
      this.quoteIdentifier(schema),
      ";'",
      "END;"
    ].join(" ");
  }
  listSchemasQuery(options) {
    const schemasToSkip = ["INFORMATION_SCHEMA", "dbo", "guest", "sys", "archive"];
    if (options == null ? void 0 : options.skip) {
      schemasToSkip.push(...options.skip);
    }
    return [
      'SELECT "name" as "schema_name" FROM sys.schemas as s',
      'WHERE "s"."name" NOT IN (',
      schemasToSkip.map((schema) => this.escape(schema)).join(", "),
      `) AND "s"."name" NOT LIKE 'db_%'`
    ].join(" ");
  }
  versionQuery() {
    return [
      "DECLARE @ms_ver NVARCHAR(20);",
      "SET @ms_ver = REVERSE(CONVERT(NVARCHAR(20), SERVERPROPERTY('ProductVersion')));",
      "SELECT REVERSE(SUBSTRING(@ms_ver, CHARINDEX('.', @ms_ver)+1, 20)) AS 'version'"
    ].join(" ");
  }
  createTableQuery(tableName, attributes, options) {
    const primaryKeys = [];
    const foreignKeys = {};
    const attributesClauseParts = [];
    let commentStr = "";
    for (const attr in attributes) {
      if (Object.prototype.hasOwnProperty.call(attributes, attr)) {
        let dataType = attributes[attr];
        let match;
        if (dataType.includes("COMMENT ")) {
          const commentMatch = dataType.match(/^(.+) (COMMENT.*)$/);
          const commentText = commentMatch[2].replace("COMMENT", "").trim();
          commentStr += this.commentTemplate(commentText, tableName, attr);
          dataType = commentMatch[1];
        }
        if (dataType.includes("PRIMARY KEY")) {
          primaryKeys.push(attr);
          if (dataType.includes("REFERENCES")) {
            match = dataType.match(/^(.+) (REFERENCES.*)$/);
            attributesClauseParts.push(`${this.quoteIdentifier(attr)} ${match[1].replace("PRIMARY KEY", "")}`);
            foreignKeys[attr] = match[2];
          } else {
            attributesClauseParts.push(`${this.quoteIdentifier(attr)} ${dataType.replace("PRIMARY KEY", "")}`);
          }
        } else if (dataType.includes("REFERENCES")) {
          match = dataType.match(/^(.+) (REFERENCES.*)$/);
          attributesClauseParts.push(`${this.quoteIdentifier(attr)} ${match[1]}`);
          foreignKeys[attr] = match[2];
        } else {
          attributesClauseParts.push(`${this.quoteIdentifier(attr)} ${dataType}`);
        }
      }
    }
    const pkString = primaryKeys.map((pk) => this.quoteIdentifier(pk)).join(", ");
    if (options.uniqueKeys) {
      _.each(options.uniqueKeys, (columns, indexName) => {
        if (typeof indexName !== "string") {
          indexName = (0, import_string.generateIndexName)(tableName, columns);
        }
        attributesClauseParts.push(`CONSTRAINT ${this.quoteIdentifier(indexName)} UNIQUE (${columns.fields.map((field) => this.quoteIdentifier(field)).join(", ")})`);
      });
    }
    if (pkString.length > 0) {
      attributesClauseParts.push(`PRIMARY KEY (${pkString})`);
    }
    for (const fkey in foreignKeys) {
      if (Object.prototype.hasOwnProperty.call(foreignKeys, fkey)) {
        attributesClauseParts.push(`FOREIGN KEY (${this.quoteIdentifier(fkey)}) ${foreignKeys[fkey]}`);
      }
    }
    const quotedTableName = this.quoteTable(tableName);
    return (0, import_join_sql_fragments.joinSQLFragments)([
      `IF OBJECT_ID(${this.escape(quotedTableName)}, 'U') IS NULL`,
      `CREATE TABLE ${quotedTableName} (${attributesClauseParts.join(", ")})`,
      ";",
      commentStr
    ]);
  }
  renameTableQuery(before, after) {
    return `EXEC sp_rename ${this.quoteTable(before)}, ${this.quoteTable(after)};`;
  }
  showTablesQuery() {
    return "SELECT TABLE_NAME, TABLE_SCHEMA FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';";
  }
  tableExistsQuery(table) {
    const tableName = table.tableName || table;
    const schemaName = table.schema || "dbo";
    return `SELECT TABLE_NAME, TABLE_SCHEMA FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME = ${this.escape(tableName)} AND TABLE_SCHEMA = ${this.escape(schemaName)}`;
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
    const quoteTbl = this.quoteTable(tableName);
    return (0, import_join_sql_fragments.joinSQLFragments)([
      `IF OBJECT_ID('${quoteTbl}', 'U') IS NOT NULL`,
      "DROP TABLE",
      quoteTbl,
      ";"
    ]);
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
    let commentStr = "";
    if (dataType.comment && _.isString(dataType.comment)) {
      commentStr = this.commentTemplate(dataType.comment, table, key);
      delete dataType.comment;
    }
    return (0, import_join_sql_fragments.joinSQLFragments)([
      "ALTER TABLE",
      this.quoteTable(table),
      "ADD",
      this.quoteIdentifier(key),
      this.attributeToSQL(dataType, { context: "addColumn" }),
      ";",
      commentStr
    ]);
  }
  commentTemplate(comment, table, column) {
    return ` EXEC sp_addextendedproperty @name = N'MS_Description', @value = ${this.escape(comment)}, @level0type = N'Schema', @level0name = 'dbo', @level1type = N'Table', @level1name = ${this.quoteTable(table)}, @level2type = N'Column', @level2name = ${this.quoteIdentifier(column)};`;
  }
  removeColumnQuery(tableName, attributeName, options = {}) {
    const ifExists = options.ifExists ? "IF EXISTS" : "";
    return (0, import_join_sql_fragments.joinSQLFragments)([
      "ALTER TABLE",
      this.quoteTable(tableName),
      "DROP COLUMN",
      ifExists,
      this.quoteIdentifier(attributeName),
      ";"
    ]);
  }
  changeColumnQuery(tableName, attributes) {
    const attrString = [];
    const constraintString = [];
    let commentString = "";
    for (const attributeName in attributes) {
      const quotedAttrName = this.quoteIdentifier(attributeName);
      let definition = attributes[attributeName];
      if (definition.includes("COMMENT ")) {
        const commentMatch = definition.match(/^(.+) (COMMENT.*)$/);
        const commentText = commentMatch[2].replace("COMMENT", "").trim();
        commentString += this.commentTemplate(commentText, tableName, attributeName);
        definition = commentMatch[1];
      }
      if (definition.includes("REFERENCES")) {
        constraintString.push(`FOREIGN KEY (${quotedAttrName}) ${definition.replace(/.+?(?=REFERENCES)/, "")}`);
      } else {
        attrString.push(`${quotedAttrName} ${definition}`);
      }
    }
    return (0, import_join_sql_fragments.joinSQLFragments)([
      "ALTER TABLE",
      this.quoteTable(tableName),
      attrString.length && `ALTER COLUMN ${attrString.join(", ")}`,
      constraintString.length && `ADD ${constraintString.join(", ")}`,
      ";",
      commentString
    ]);
  }
  renameColumnQuery(tableName, attrBefore, attributes) {
    const newName = Object.keys(attributes)[0];
    return (0, import_join_sql_fragments.joinSQLFragments)([
      "EXEC sp_rename",
      `'${this.quoteTable(tableName)}.${attrBefore}',`,
      `'${newName}',`,
      "'COLUMN'",
      ";"
    ]);
  }
  bulkInsertQuery(tableName, attrValueHashes, options, attributes) {
    const quotedTable = this.quoteTable(tableName);
    options = options || {};
    attributes = attributes || {};
    const tuples = [];
    const allAttributes = [];
    const allQueries = [];
    let needIdentityInsertWrapper = false;
    let outputFragment = "";
    if (options.returning) {
      const returnValues = this.generateReturnValues(attributes, options);
      outputFragment = returnValues.outputFragment;
    }
    const emptyQuery = `INSERT INTO ${quotedTable}${outputFragment} DEFAULT VALUES`;
    for (const attrValueHash of attrValueHashes) {
      const fields = Object.keys(attrValueHash);
      const firstAttr = attributes[fields[0]];
      if (fields.length === 1 && firstAttr && firstAttr.autoIncrement && attrValueHash[fields[0]] === null) {
        allQueries.push(emptyQuery);
        continue;
      }
      _.forOwn(attrValueHash, (value, key) => {
        if (value !== null && attributes[key] && attributes[key].autoIncrement) {
          needIdentityInsertWrapper = true;
        }
        if (!allAttributes.includes(key)) {
          if (value === null && attributes[key] && attributes[key].autoIncrement) {
            return;
          }
          allAttributes.push(key);
        }
      });
    }
    if (allAttributes.length > 0) {
      for (const attrValueHash of attrValueHashes) {
        tuples.push(`(${allAttributes.map((key) => this.escape(attrValueHash[key], void 0, options)).join(",")})`);
      }
      const quotedAttributes = allAttributes.map((attr) => this.quoteIdentifier(attr)).join(",");
      allQueries.push((tupleStr) => `INSERT INTO ${quotedTable} (${quotedAttributes})${outputFragment} VALUES ${tupleStr}`);
    }
    const commands = [];
    let offset = 0;
    while (offset < Math.max(tuples.length, 1)) {
      const tupleStr = tuples.slice(offset, Math.min(tuples.length, offset + 1e3));
      let generatedQuery = allQueries.map((v) => typeof v === "string" ? v : v(tupleStr)).join(";");
      if (needIdentityInsertWrapper) {
        generatedQuery = `SET IDENTITY_INSERT ${quotedTable} ON; ${generatedQuery}; SET IDENTITY_INSERT ${quotedTable} OFF`;
      }
      commands.push(generatedQuery);
      offset += 1e3;
    }
    return `${commands.join(";")};`;
  }
  updateQuery(tableName, attrValueHash, where, options = {}, attributes) {
    const sql = super.updateQuery(tableName, attrValueHash, where, options, attributes);
    if (options.limit) {
      const updateArgs = `UPDATE TOP(${this.escape(options.limit, void 0, options)})`;
      sql.query = sql.query.replace("UPDATE", updateArgs);
    }
    return sql;
  }
  upsertQuery(tableName, insertValues, updateValues, where, model, options) {
    const targetTableAlias = this.quoteTable(`${tableName}_target`);
    const sourceTableAlias = this.quoteTable(`${tableName}_source`);
    const primaryKeysColumns = [];
    const identityColumns = [];
    const uniqueColumns = [];
    const tableNameQuoted = this.quoteTable(tableName);
    let needIdentityInsertWrapper = false;
    const modelDefinition = model.modelDefinition;
    for (const attribute of modelDefinition.attributes.values()) {
      if (attribute.primaryKey) {
        primaryKeysColumns.push(attribute.columnName);
      }
      if (attribute.autoIncrement) {
        identityColumns.push(attribute.columnName);
      }
    }
    for (const index of model.getIndexes()) {
      if (index.unique && index.fields) {
        for (const field of index.fields) {
          const columnName = typeof field === "string" ? field : field.name || field.attribute;
          if (!uniqueColumns.includes(columnName) && modelDefinition.attributes.has(columnName)) {
            uniqueColumns.push(columnName);
          }
        }
      }
    }
    const updateKeys = Object.keys(updateValues);
    const insertKeys = Object.keys(insertValues);
    const insertKeysQuoted = insertKeys.map((key) => this.quoteIdentifier(key)).join(", ");
    const insertValuesEscaped = insertKeys.map((key) => this.escape(insertValues[key], void 0, options)).join(", ");
    const sourceTableQuery = `VALUES(${insertValuesEscaped})`;
    let joinCondition;
    for (const key of identityColumns) {
      if (insertValues[key] && insertValues[key] !== null) {
        needIdentityInsertWrapper = true;
      }
    }
    const clauses = where[Op.or].filter((clause) => {
      let valid = true;
      for (const key of Object.keys(clause)) {
        if (clause[key] == null) {
          valid = false;
          break;
        }
      }
      return valid;
    });
    const getJoinSnippet = (array) => {
      return array.map((key) => {
        key = this.quoteIdentifier(key);
        return `${targetTableAlias}.${key} = ${sourceTableAlias}.${key}`;
      });
    };
    if (clauses.length === 0) {
      throw new Error("Primary Key or Unique key should be passed to upsert query");
    } else {
      for (const key in clauses) {
        const keys = Object.keys(clauses[key]);
        if (primaryKeysColumns.includes(keys[0])) {
          joinCondition = getJoinSnippet(primaryKeysColumns).join(" AND ");
          break;
        }
      }
      if (!joinCondition) {
        joinCondition = getJoinSnippet(uniqueColumns).join(" AND ");
      }
    }
    const filteredUpdateClauses = updateKeys.filter((key) => !identityColumns.includes(key)).map((key) => {
      const value = this.escape(updateValues[key], void 0, options);
      key = this.quoteIdentifier(key);
      return `${targetTableAlias}.${key} = ${value}`;
    });
    const updateSnippet = filteredUpdateClauses.length > 0 ? `WHEN MATCHED THEN UPDATE SET ${filteredUpdateClauses.join(", ")}` : "";
    const insertSnippet = `(${insertKeysQuoted}) VALUES(${insertValuesEscaped})`;
    let query = `MERGE INTO ${tableNameQuoted} WITH(HOLDLOCK) AS ${targetTableAlias} USING (${sourceTableQuery}) AS ${sourceTableAlias}(${insertKeysQuoted}) ON ${joinCondition}`;
    query += ` ${updateSnippet} WHEN NOT MATCHED THEN INSERT ${insertSnippet} OUTPUT $action, INSERTED.*;`;
    if (needIdentityInsertWrapper) {
      query = `SET IDENTITY_INSERT ${tableNameQuoted} ON; ${query} SET IDENTITY_INSERT ${tableNameQuoted} OFF;`;
    }
    return query;
  }
  truncateTableQuery(tableName) {
    return `TRUNCATE TABLE ${this.quoteTable(tableName)}`;
  }
  deleteQuery(tableName, where, options = {}, model) {
    const table = this.quoteTable(tableName);
    const whereClause = this.getWhereConditions(where, null, model, options);
    return (0, import_join_sql_fragments.joinSQLFragments)([
      "DELETE",
      options.limit && `TOP(${this.escape(options.limit, void 0, options)})`,
      "FROM",
      table,
      whereClause && `WHERE ${whereClause}`,
      ";",
      "SELECT @@ROWCOUNT AS AFFECTEDROWS",
      ";"
    ]);
  }
  showConstraintsQuery(tableName) {
    return `EXEC sp_helpconstraint @objname = ${this.escape(this.quoteTable(tableName))};`;
  }
  attributeToSQL(attribute, options) {
    if (!_.isPlainObject(attribute)) {
      attribute = {
        type: attribute
      };
    }
    if (attribute.references && attribute.Model && this.isSameTable(attribute.Model.tableName, attribute.references.table)) {
      this.sequelize.log("MSSQL does not support self-referential constraints, we will remove it but we recommend restructuring your query");
      attribute.onDelete = "";
      attribute.onUpdate = "";
    }
    let template;
    if (attribute.type instanceof DataTypes.ENUM) {
      template = attribute.type.toSql({ dialect: this.dialect });
      template += ` CHECK (${this.quoteIdentifier(attribute.field)} IN(${attribute.type.options.values.map((value) => {
        return this.escape(value, void 0, options);
      }).join(", ")}))`;
      return template;
    }
    template = (0, import_data_types_utils.attributeTypeToSql)(attribute.type, { dialect: this.dialect });
    if (attribute.allowNull === false) {
      template += " NOT NULL";
    } else if (!attribute.primaryKey && !(0, import_query_builder_utils.defaultValueSchemable)(attribute.defaultValue)) {
      template += " NULL";
    }
    if (attribute.autoIncrement) {
      template += " IDENTITY(1,1)";
    }
    if (attribute.type !== "TEXT" && attribute.type._binary !== true && (0, import_query_builder_utils.defaultValueSchemable)(attribute.defaultValue)) {
      template += ` DEFAULT ${this.escape(attribute.defaultValue, attribute, options)}`;
    }
    if (attribute.unique === true && ((options == null ? void 0 : options.context) !== "changeColumn" || this.dialect.supports.alterColumn.unique)) {
      template += " UNIQUE";
    }
    if (attribute.primaryKey) {
      template += " PRIMARY KEY";
    }
    if ((!options || !options.withoutForeignKeyConstraints) && attribute.references) {
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
    if (attribute.comment && typeof attribute.comment === "string") {
      template += ` COMMENT ${attribute.comment}`;
    }
    return template;
  }
  attributesToSQL(attributes, options) {
    const result = /* @__PURE__ */ Object.create(null);
    const existingConstraints = [];
    for (const key of Object.keys(attributes)) {
      const attribute = { ...attributes[key] };
      if (attribute.references) {
        if (existingConstraints.includes(this.quoteTable(attribute.references.table))) {
          attribute.onDelete = "";
          attribute.onUpdate = "";
        } else {
          existingConstraints.push(this.quoteTable(attribute.references.table));
          attribute.onUpdate = "";
        }
      }
      if (key && !attribute.field) {
        attribute.field = key;
      }
      result[attribute.field || key] = this.attributeToSQL(attribute, options);
    }
    return result;
  }
  createTrigger() {
    throwMethodUndefined("createTrigger");
  }
  dropTrigger() {
    throwMethodUndefined("dropTrigger");
  }
  renameTrigger() {
    throwMethodUndefined("renameTrigger");
  }
  createFunction() {
    throwMethodUndefined("createFunction");
  }
  dropFunction() {
    throwMethodUndefined("dropFunction");
  }
  renameFunction() {
    throwMethodUndefined("renameFunction");
  }
  /**
   * Generate common SQL prefix for ForeignKeysQuery.
   *
   * @param {string} catalogName
   * @returns {string}
   */
  _getForeignKeysQueryPrefix(catalogName) {
    return `SELECT constraint_name = OBJ.NAME, constraintName = OBJ.NAME, ${catalogName ? `constraintCatalog = '${catalogName}', ` : ""}constraintSchema = SCHEMA_NAME(OBJ.SCHEMA_ID), tableName = TB.NAME, tableSchema = SCHEMA_NAME(TB.SCHEMA_ID), ${catalogName ? `tableCatalog = '${catalogName}', ` : ""}columnName = COL.NAME, referencedTableSchema = SCHEMA_NAME(RTB.SCHEMA_ID), ${catalogName ? `referencedCatalog = '${catalogName}', ` : ""}referencedTableName = RTB.NAME, referencedColumnName = RCOL.NAME FROM sys.foreign_key_columns FKC INNER JOIN sys.objects OBJ ON OBJ.OBJECT_ID = FKC.CONSTRAINT_OBJECT_ID INNER JOIN sys.tables TB ON TB.OBJECT_ID = FKC.PARENT_OBJECT_ID INNER JOIN sys.columns COL ON COL.COLUMN_ID = PARENT_COLUMN_ID AND COL.OBJECT_ID = TB.OBJECT_ID INNER JOIN sys.tables RTB ON RTB.OBJECT_ID = FKC.REFERENCED_OBJECT_ID INNER JOIN sys.columns RCOL ON RCOL.COLUMN_ID = REFERENCED_COLUMN_ID AND RCOL.OBJECT_ID = RTB.OBJECT_ID`;
  }
  /**
   * Generates an SQL query that returns all foreign keys details of a table.
   *
   * @param {string|object} table
   * @param {string} catalogName database name
   * @returns {string}
   */
  getForeignKeysQuery(table, catalogName) {
    const tableName = table.tableName || table;
    let sql = `${this._getForeignKeysQueryPrefix(catalogName)} WHERE TB.NAME =${wrapSingleQuote(tableName)}`;
    if (table.schema) {
      sql += ` AND SCHEMA_NAME(TB.SCHEMA_ID) =${wrapSingleQuote(table.schema)}`;
    }
    return sql;
  }
  getForeignKeyQuery(table, attributeName) {
    const tableName = table.tableName || table;
    return (0, import_join_sql_fragments.joinSQLFragments)([
      this._getForeignKeysQueryPrefix(),
      "WHERE",
      `TB.NAME =${wrapSingleQuote(tableName)}`,
      "AND",
      `COL.NAME =${wrapSingleQuote(attributeName)}`,
      table.schema && `AND SCHEMA_NAME(TB.SCHEMA_ID) =${wrapSingleQuote(table.schema)}`
    ]);
  }
  getPrimaryKeyConstraintQuery(table, attributeName) {
    const tableName = wrapSingleQuote(table.tableName || table);
    return (0, import_join_sql_fragments.joinSQLFragments)([
      "SELECT K.TABLE_NAME AS tableName,",
      "K.COLUMN_NAME AS columnName,",
      "K.CONSTRAINT_NAME AS constraintName",
      "FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS C",
      "JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS K",
      "ON C.TABLE_NAME = K.TABLE_NAME",
      "AND C.CONSTRAINT_CATALOG = K.CONSTRAINT_CATALOG",
      "AND C.CONSTRAINT_SCHEMA = K.CONSTRAINT_SCHEMA",
      "AND C.CONSTRAINT_NAME = K.CONSTRAINT_NAME",
      "WHERE C.CONSTRAINT_TYPE = 'PRIMARY KEY'",
      `AND K.COLUMN_NAME = ${wrapSingleQuote(attributeName)}`,
      `AND K.TABLE_NAME = ${tableName}`,
      ";"
    ]);
  }
  dropForeignKeyQuery(tableName, foreignKey) {
    return (0, import_join_sql_fragments.joinSQLFragments)([
      "ALTER TABLE",
      this.quoteTable(tableName),
      "DROP",
      this.quoteIdentifier(foreignKey)
    ]);
  }
  getDefaultConstraintQuery(tableName, attributeName) {
    const quotedTable = this.quoteTable(tableName);
    return (0, import_join_sql_fragments.joinSQLFragments)([
      "SELECT name FROM sys.default_constraints",
      `WHERE PARENT_OBJECT_ID = OBJECT_ID('${quotedTable}', 'U')`,
      `AND PARENT_COLUMN_ID = (SELECT column_id FROM sys.columns WHERE NAME = ('${attributeName}')`,
      `AND object_id = OBJECT_ID('${quotedTable}', 'U'))`,
      ";"
    ]);
  }
  dropConstraintQuery(tableName, constraintName) {
    return (0, import_join_sql_fragments.joinSQLFragments)([
      "ALTER TABLE",
      this.quoteTable(tableName),
      "DROP CONSTRAINT",
      this.quoteIdentifier(constraintName),
      ";"
    ]);
  }
  setIsolationLevelQuery() {
  }
  generateTransactionId() {
    return randomBytes(10).toString("hex");
  }
  startTransactionQuery(transaction) {
    if (transaction.parent) {
      return `SAVE TRANSACTION ${this.quoteIdentifier(transaction.name)};`;
    }
    return "BEGIN TRANSACTION;";
  }
  commitTransactionQuery(transaction) {
    if (transaction.parent) {
      return;
    }
    return "COMMIT TRANSACTION;";
  }
  rollbackTransactionQuery(transaction) {
    if (transaction.parent) {
      return `ROLLBACK TRANSACTION ${this.quoteIdentifier(transaction.name)};`;
    }
    return "ROLLBACK TRANSACTION;";
  }
  selectFromTableFragment(options, model, attributes, tables, mainTableAs, where) {
    this._throwOnEmptyAttributes(attributes, { modelName: model && model.name, as: mainTableAs });
    return (0, import_join_sql_fragments.joinSQLFragments)([
      "SELECT",
      attributes.join(", "),
      `FROM ${tables}`,
      mainTableAs && `AS ${mainTableAs}`,
      options.tableHint && TableHints[options.tableHint] && `WITH (${TableHints[options.tableHint]})`
    ]);
  }
  addLimitAndOffset(options, model) {
    const offset = options.offset || 0;
    const isSubQuery = options.subQuery === void 0 ? options.hasIncludeWhere || options.hasIncludeRequired || options.hasMultiAssociation : options.subQuery;
    let fragment = "";
    let orders = {};
    if (options.order) {
      orders = this.getQueryOrders(options, model, isSubQuery);
    }
    if (options.limit || options.offset) {
      if (!options.order || options.order.length === 0 || options.include && orders.subQueryOrder.length === 0) {
        let primaryKey = model.primaryKeyField;
        const tablePkFragment = `${this.quoteTable(options.tableAs || model.name)}.${this.quoteIdentifier(primaryKey)}`;
        const aliasedAttribute = this._getAliasForFieldFromQueryOptions(primaryKey, options);
        if (aliasedAttribute) {
          const modelName = this.quoteIdentifier(options.tableAs || model.name);
          const alias = this._getAliasForField(modelName, aliasedAttribute[1], options);
          primaryKey = alias || aliasedAttribute[1];
        }
        if (!orders.mainQueryOrder || orders.mainQueryOrder.length === 0) {
          fragment += ` ORDER BY ${tablePkFragment}`;
        } else {
          const orderFieldNames = (options.order || []).map((order) => {
            const value = Array.isArray(order) ? order[0] : order;
            if (value instanceof import_sequelize_method.Col) {
              return value.col;
            }
            if (value instanceof import_sequelize_method.Literal) {
              return value.val;
            }
            return value;
          });
          const primaryKeyFieldAlreadyPresent = orderFieldNames.includes(
            primaryKey.col || primaryKey
          );
          if (!primaryKeyFieldAlreadyPresent) {
            fragment += options.order && !isSubQuery ? ", " : " ORDER BY ";
            fragment += tablePkFragment;
          }
        }
      }
      if (options.offset || options.limit) {
        fragment += ` OFFSET ${this.escape(offset, void 0, options)} ROWS`;
      }
      if (options.limit) {
        fragment += ` FETCH NEXT ${this.escape(options.limit, void 0, options)} ROWS ONLY`;
      }
    }
    return fragment;
  }
  booleanValue(value) {
    return value ? 1 : 0;
  }
}
function wrapSingleQuote(identifier) {
  return (0, import_dialect.addTicks)((0, import_dialect.removeTicks)(identifier, "'"), "'");
}
//# sourceMappingURL=query-generator.js.map
