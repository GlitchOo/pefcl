import type { MssqlDialect } from './index.js';
/**
 * First pass of DB value parsing: Parses based on the MSSQL Type ID.
 * If a Sequelize DataType is specified, the value is then passed to {@link AbstractDataType#parseDatabaseValue}.
 *
 * @param dialect
 */
export declare function registerMsSqlDbDataTypeParsers(dialect: MssqlDialect): void;
