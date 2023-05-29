import type { QueryRawOptions, Sequelize } from '../../sequelize';
import type { AbstractQueryGenerator } from './query-generator';
import type { CreateSchemaOptions, QueryInterfaceOptions, ShowAllSchemasOptions } from './query-interface.types';
/**
 * This is a temporary class used to progressively migrate the AbstractQueryInterface class to TypeScript by slowly moving its functions here.
 * Always use {@link AbstractQueryInterface} instead.
 */
export declare class AbstractQueryInterfaceTypeScript {
    readonly sequelize: Sequelize;
    readonly queryGenerator: AbstractQueryGenerator;
    constructor(options: QueryInterfaceOptions);
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
    createSchema(schema: string, options?: CreateSchemaOptions): Promise<void>;
    /**
     * Drop a single schema
     *
     * **Note:** this is a schema in the [postgres sense of the word](http://www.postgresql.org/docs/9.1/static/ddl-schemas.html),
     * not a database table. In mysql and mariadb, this drop a table matching the schema name.
     *
     * @param schema Name of the schema
     * @param options
     */
    dropSchema(schema: string, options?: QueryRawOptions): Promise<void>;
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
    showAllSchemas(options?: ShowAllSchemasOptions): Promise<string[]>;
}
