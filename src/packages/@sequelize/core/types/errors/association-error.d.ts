import type { ErrorOptions } from './base-error';
import { BaseError } from './base-error';
/**
 * Thrown when an association is improperly constructed (see message for details)
 */
export declare class AssociationError extends BaseError {
    constructor(message: string, options?: ErrorOptions);
}
