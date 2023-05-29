import { ConnectionError } from '../connection-error';
/**
 * Thrown when connection is not acquired due to timeout
 */
export declare class ConnectionAcquireTimeoutError extends ConnectionError {
    constructor(cause: Error);
}
