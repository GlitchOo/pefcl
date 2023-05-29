import type { Options } from '../sequelize';
/**
 * Parses a connection string into an Options object with connection properties
 *
 * @param connectionString string value in format schema://username:password@host:port/database
 */
export declare function parseConnectionString(connectionString: string): Options;
