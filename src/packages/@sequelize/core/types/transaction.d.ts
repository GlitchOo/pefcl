import type { Class } from 'type-fest';
import type { Logging, Deferrable, Sequelize } from './index.js';
type AfterTransactionCommitCallback = (transaction: Transaction) => void | Promise<void>;
/**
 * The transaction object is used to identify a running transaction.
 * It is created by calling `Sequelize.transaction()`.
 * To run a query under a transaction, you should pass the transaction in the options object.
 *
 * @class Transaction
 * @see {Sequelize.transaction}
 */
export declare class Transaction {
    sequelize: Sequelize;
    private readonly _afterCommitHooks;
    private readonly savepoints;
    private readonly options;
    private readonly parent;
    readonly id: string;
    private readonly name;
    private finished;
    private connection;
    /**
     * Creates a new transaction instance
     *
     * @param sequelize A configured sequelize Instance
     * @param options An object with options
     * @param [options.type] Sets the type of the transaction. Sqlite only
     * @param [options.isolationLevel] Sets the isolation level of the transaction.
     * @param [options.deferrable] Sets the constraints to be deferred or immediately checked. PostgreSQL only
     */
    constructor(sequelize: Sequelize, options: TransactionOptions);
    /**
     * Commit the transaction.
     */
    commit(): Promise<void>;
    /**
     * Rollback (abort) the transaction
     */
    rollback(): Promise<void>;
    /**
     * Called to acquire a connection to use and set the correct options on the connection.
     * We should ensure all the environment that's set up is cleaned up in `cleanup()` below.
     */
    prepareEnvironment(): Promise<void>;
    setDeferrable(): Promise<void>;
    begin(): Promise<void>;
    cleanup(): void;
    /**
     * Kills the connection this transaction uses.
     * Used as a last resort, for instance because COMMIT or ROLLBACK resulted in an error
     * and the transaction is left in a broken state,
     * and releasing the connection to the pool would be dangerous.
     */
    forceCleanup(): Promise<void>;
    /**
     * Adds a hook that is run after a transaction is committed.
     *
     * @param fn   A callback function that is called with the committed transaction
     * @name afterCommit
     * @memberof Sequelize.Transaction
     */
    afterCommit(fn: AfterTransactionCommitCallback): this;
    /**
     * Types can be set per-transaction by passing `options.type` to `sequelize.transaction`.
     * Default to `DEFERRED` but you can override the default type by passing `options.transactionType` in `new Sequelize`.
     * Sqlite only.
     *
     * Pass in the desired level as the first argument:
     *
     * @example
     * try {
     *   await sequelize.transaction({ type: Sequelize.Transaction.TYPES.EXCLUSIVE }, transaction => {
     *      // your transactions
     *   });
     *   // transaction has been committed. Do something after the commit if required.
     * } catch(err) {
     *   // do something with the err.
     * }
     *
     * @property DEFERRED
     * @property IMMEDIATE
     * @property EXCLUSIVE
     */
    static get TYPES(): typeof TRANSACTION_TYPES;
    /**
     * Isolation levels can be set per-transaction by passing `options.isolationLevel` to `sequelize.transaction`.
     * Sequelize uses the default isolation level of the database, you can override this by passing `options.isolationLevel` in Sequelize constructor options.
     *
     * Pass in the desired level as the first argument:
     *
     * @example
     * try {
     *   const result = await sequelize.transaction({isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, transaction => {
     *     // your transactions
     *   });
     *   // transaction has been committed. Do something after the commit if required.
     * } catch(err) {
     *   // do something with the err.
     * }
     *
     * @property READ_UNCOMMITTED
     * @property READ_COMMITTED
     * @property REPEATABLE_READ
     * @property SERIALIZABLE
     */
    static get ISOLATION_LEVELS(): typeof ISOLATION_LEVELS;
    /**
     * Possible options for row locking. Used in conjunction with `find` calls:
     *
     * @example
     * // t1 is a transaction
     * Model.findAll({
     *   where: ...,
     *   transaction: t1,
     *   lock: t1.LOCK...
     * });
     *
     * @example Postgres also supports specific locks while eager loading by using OF:
     * ```ts
     * UserModel.findAll({
     *   where: ...,
     *   include: [TaskModel, ...],
     *   transaction: t1,
     *   lock: {
     *     level: t1.LOCK...,
     *     of: UserModel
     *   }
     * });
     * ```
     *
     * UserModel will be locked but TaskModel won't!
     *
     * @example You can also skip locked rows:
     * ```ts
     * // t1 is a transaction
     * Model.findAll({
     *   where: ...,
     *   transaction: t1,
     *   lock: true,
     *   skipLocked: true
     * });
     * ```
     *
     * The query will now return any rows that aren't locked by another transaction
     *
     * @returns possible options for row locking
     * @property UPDATE
     * @property SHARE
     * @property KEY_SHARE Postgres 9.3+ only
     * @property NO_KEY_UPDATE Postgres 9.3+ only
     */
    static get LOCK(): typeof LOCK;
    /**
     * Same as {@link Transaction.LOCK}, but can also be called on instances of
     * transactions to get possible options for row locking directly from the
     * instance.
     */
    get LOCK(): typeof LOCK;
}
/**
 * Isolations levels can be set per-transaction by passing `options.isolationLevel` to `sequelize.transaction`.
 * Default to `REPEATABLE_READ` but you can override the default isolation level by passing `options.isolationLevel` in `new Sequelize`.
 *
 * The possible isolations levels to use when starting a transaction:
 *
 * ```js
 * {
 *   READ_UNCOMMITTED: "READ UNCOMMITTED",
 *   READ_COMMITTED: "READ COMMITTED",
 *   REPEATABLE_READ: "REPEATABLE READ",
 *   SERIALIZABLE: "SERIALIZABLE"
 * }
 * ```
 *
 * Pass in the desired level as the first argument:
 *
 * ```js
 * try {
 *   await sequelize.transaction({isolationLevel: Sequelize.Transaction.SERIALIZABLE}, transaction => {
 *      // your transactions
 *   });
 *   // transaction has been committed. Do something after the commit if required.
 * } catch(err) {
 *   // do something with the err.
 * }
 * ```
 */
export declare enum ISOLATION_LEVELS {
    READ_UNCOMMITTED = "READ UNCOMMITTED",
    READ_COMMITTED = "READ COMMITTED",
    REPEATABLE_READ = "REPEATABLE READ",
    SERIALIZABLE = "SERIALIZABLE"
}
export declare enum TRANSACTION_TYPES {
    DEFERRED = "DEFERRED",
    IMMEDIATE = "IMMEDIATE",
    EXCLUSIVE = "EXCLUSIVE"
}
/**
 * Possible options for row locking. Used in conjunction with `find` calls:
 *
 * Usage:
 * ```js
 * import { LOCK } from '@sequelize/core';
 *
 * Model.findAll({
 *   transaction,
 *   lock: LOCK.UPDATE,
 * });
 * ```
 *
 * Postgres also supports specific locks while eager loading by using OF:
 * ```js
 * import { LOCK } from '@sequelize/core';
 *
 * UserModel.findAll({
 *   transaction,
 *   lock: {
 *     level: LOCK.KEY_SHARE,
 *     of: UserModel,
 *   },
 * });
 * ```
 * UserModel will be locked but other models won't be!
 *
 * [Read more on transaction locks here](https://sequelize.org/docs/v7/other-topics/transactions/#locks)
 */
export declare enum LOCK {
    UPDATE = "UPDATE",
    SHARE = "SHARE",
    /**
     * Postgres 9.3+ only
     */
    KEY_SHARE = "KEY SHARE",
    /**
     * Postgres 9.3+ only
     */
    NO_KEY_UPDATE = "NO KEY UPDATE"
}
/**
 * Options provided when the transaction is created
 */
export interface TransactionOptions extends Logging {
    readOnly?: boolean;
    autocommit?: boolean;
    isolationLevel?: ISOLATION_LEVELS;
    type?: TRANSACTION_TYPES;
    deferrable?: string | Deferrable | Class<Deferrable>;
    /**
     * Parent transaction.
     */
    transaction?: Transaction | null;
}
export {};
