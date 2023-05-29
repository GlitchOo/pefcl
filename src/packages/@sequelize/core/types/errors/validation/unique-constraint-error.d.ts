import type { CommonErrorProperties } from '../base-error';
import type { ValidationErrorItem } from '../validation-error';
import { ValidationError } from '../validation-error';
interface UniqueConstraintErrorParent extends Error, Pick<CommonErrorProperties, 'sql'> {
}
export interface UniqueConstraintErrorOptions {
    cause?: UniqueConstraintErrorParent;
    /**
     * @deprecated use {@link UniqueConstraintErrorOptions.cause}
     */
    parent?: UniqueConstraintErrorParent;
    errors?: ValidationErrorItem[];
    fields?: Record<string, unknown>;
    message?: string;
}
/**
 * Thrown when a unique constraint is violated in the database
 */
export declare class UniqueConstraintError extends ValidationError {
    /** The database specific error which triggered this one */
    cause?: UniqueConstraintErrorParent;
    readonly fields: Record<string, unknown>;
    readonly sql: string;
    constructor(options?: UniqueConstraintErrorOptions);
}
export {};
