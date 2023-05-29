import { ConnectionError } from '../connection-error';
/**
 * Thrown when a connection to a database has a hostname that was not found
 */
export declare class HostNotFoundError extends ConnectionError {
    constructor(cause: Error);
}
