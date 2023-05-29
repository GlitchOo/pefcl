import { ConnectionError } from '../connection-error';
/**
 * Thrown when a connection to a database has invalid values for any of the connection parameters
 */
export declare class InvalidConnectionError extends ConnectionError {
    constructor(cause: Error);
}
