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
var query_interface_typescript_exports = {};
__export(query_interface_typescript_exports, {
  AbstractQueryInterfaceTypeScript: () => AbstractQueryInterfaceTypeScript
});
module.exports = __toCommonJS(query_interface_typescript_exports);
var import_query_types = require("../../query-types");
class AbstractQueryInterfaceTypeScript {
  sequelize;
  queryGenerator;
  constructor(options) {
    this.sequelize = options.sequelize;
    this.queryGenerator = options.queryGenerator;
  }
  /**
   * Create a new database schema.
   *
   * **Note:** this is a schema in the [postgres sense of the word](http://www.postgresql.org/docs/9.1/static/ddl-schemas.html),
   * not a database table. In mysql and mariadb, this command will create what they call a database.
   *
   * @see
   * {@link Model.schema}
   *
   * @param schema Name of the schema
   * @param options
   */
  async createSchema(schema, options) {
    const sql = this.queryGenerator.createSchemaQuery(schema, options);
    await this.sequelize.queryRaw(sql, options);
  }
  /**
   * Drop a single schema
   *
   * **Note:** this is a schema in the [postgres sense of the word](http://www.postgresql.org/docs/9.1/static/ddl-schemas.html),
   * not a database table. In mysql and mariadb, this drop a table matching the schema name.
   *
   * @param schema Name of the schema
   * @param options
   */
  async dropSchema(schema, options) {
    const dropSchemaQuery = this.queryGenerator.dropSchemaQuery(schema);
    let sql;
    let queryRawOptions;
    if (typeof dropSchemaQuery === "string") {
      sql = dropSchemaQuery;
      queryRawOptions = options;
    } else {
      sql = dropSchemaQuery.query;
      queryRawOptions = { ...options, bind: dropSchemaQuery.bind };
    }
    await this.sequelize.queryRaw(sql, queryRawOptions);
  }
  /**
   * Show all defined schemas
   *
   * **Note:** this is a schema in the [postgres sense of the word](http://www.postgresql.org/docs/9.1/static/ddl-schemas.html),
   * not a database table. In mysql and mariadb, this will show all databases.
   *
   * @param options
   *
   * @returns list of schemas
   */
  async showAllSchemas(options) {
    const showSchemasSql = this.queryGenerator.listSchemasQuery(options);
    const queryRawOptions = {
      ...options,
      raw: true,
      type: import_query_types.QueryTypes.SELECT
    };
    const schemaNames = await this.sequelize.queryRaw(showSchemasSql, queryRawOptions);
    return schemaNames.flatMap((value) => value.schema_name ? value.schema_name : value);
  }
}
//# sourceMappingURL=query-interface-typescript.js.map
