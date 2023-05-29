import type { MariaDbDialect } from '../mariadb/index.js';
import type { MysqlDialect } from './index.js';
/**
 * First pass of DB value parsing: Parses based on the MySQL Type ID.
 * If a Sequelize DataType is specified, the value is then passed to {@link AbstractDataType#parseDatabaseValue}.
 *
 * @param dialect
 */
export declare function registerMySqlDbDataTypeParsers(dialect: MysqlDialect | MariaDbDialect): void;
