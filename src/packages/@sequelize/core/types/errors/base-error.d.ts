export interface CommonErrorProperties {
    /** The SQL that triggered the error */
    readonly sql: string;
}
export interface ErrorOptions {
    cause?: unknown;
}
/**
 * The Base Error all Sequelize Errors inherit from.
 *
 * Sequelize provides a host of custom error classes, to allow you to do easier debugging.
 * All of these errors are exported by the `@sequelize/core` package.
 * All sequelize errors inherit from the base JS error object.
 */
export declare class BaseError extends Error {
    cause?: any;
    /**
     * @deprecated use {@link cause}.
     */
    get parent(): this['cause'];
    /**
     * @deprecated use {@link cause}.
     */
    get original(): this['cause'];
    constructor(message?: string, options?: ErrorOptions);
}
