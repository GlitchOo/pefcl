import type { Sequelize, QueryRawOptions } from '../../sequelize.js';
export declare function withSqliteForeignKeysOff<T>(sequelize: Sequelize, options: QueryRawOptions, cb: () => Promise<T>): Promise<T>;
