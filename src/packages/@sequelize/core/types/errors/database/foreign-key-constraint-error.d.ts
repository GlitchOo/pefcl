import type { DatabaseErrorSubclassOptions } from '../database-error';
import { DatabaseError } from '../database-error';
export declare enum RelationshipType {
    parent = "parent",
    child = "child"
}
interface ForeignKeyConstraintErrorOptions {
    table?: string;
    fields?: {
        [field: string]: string;
    };
    value?: unknown;
    index?: string;
    reltype?: RelationshipType;
}
/**
 * Thrown when a foreign key constraint is violated in the database
 */
export declare class ForeignKeyConstraintError extends DatabaseError {
    table: string | undefined;
    fields: {
        [field: string]: string;
    } | undefined;
    value: unknown;
    index: string | undefined;
    reltype: RelationshipType | undefined;
    constructor(options?: ForeignKeyConstraintErrorOptions & DatabaseErrorSubclassOptions);
}
export {};
