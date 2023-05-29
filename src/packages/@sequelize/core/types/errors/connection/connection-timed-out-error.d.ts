import { ConnectionError } from '../connection-error';
/**
 * Thrown when a connection to a database times out
 */
export declare class ConnectionTimedOutError extends ConnectionError {
    constructor(cause: Error);
}
