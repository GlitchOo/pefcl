import type { DatabaseErrorParent } from '../database-error';
import { DatabaseError } from '../database-error';
/**
 * Thrown when a database query times out because of a deadlock
 */
export declare class TimeoutError extends DatabaseError {
    constructor(parent: DatabaseErrorParent);
}
