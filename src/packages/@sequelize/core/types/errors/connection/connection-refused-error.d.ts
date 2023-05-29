import { ConnectionError } from '../connection-error';
/**
 * Thrown when a connection to a database is refused
 */
export declare class ConnectionRefusedError extends ConnectionError {
    constructor(cause: Error);
}
