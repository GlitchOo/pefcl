import type { Connection } from './dialects/abstract/connection-manager.js';
import type { AbstractQuery } from './dialects/abstract/query.js';
import type { AsyncHookReturn, HookHandler } from './hooks.js';
import type { ModelHooks } from './model-hooks.js';
import type { ConnectionOptions, Options, Sequelize } from './sequelize.js';
import type { TransactionOptions } from './transaction.js';
import { Transaction } from './transaction.js';
import type { ModelAttributes, ModelOptions, ModelStatic, QueryOptions, SyncOptions } from '.';
export interface SequelizeHooks extends ModelHooks {
    /**
     * A hook that is run at the start of {@link Sequelize#define} and {@link Model.init}
     */
    beforeDefine(attributes: ModelAttributes, options: ModelOptions): void;
    /**
     * A hook that is run at the end of {@link Sequelize#define} and {@link Model.init}
     */
    afterDefine(model: ModelStatic): void;
    /**
     * A hook that is run before a connection is created
     */
    beforeConnect(config: ConnectionOptions): AsyncHookReturn;
    /**
     * A hook that is run after a connection is created
     */
    afterConnect(connection: Connection, config: ConnectionOptions): AsyncHookReturn;
    /**
     * A hook that is run before a connection is disconnected
     */
    beforeDisconnect(connection: Connection): AsyncHookReturn;
    /**
     * A hook that is run after a connection is disconnected
     */
    afterDisconnect(connection: unknown): AsyncHookReturn;
    beforeQuery(options: QueryOptions, query: AbstractQuery): AsyncHookReturn;
    afterQuery(options: QueryOptions, query: AbstractQuery): AsyncHookReturn;
    /**
     * A hook that is run at the start of {@link Sequelize#sync}
     */
    beforeBulkSync(options: SyncOptions): AsyncHookReturn;
    /**
     * A hook that is run at the end of {@link Sequelize#sync}
     */
    afterBulkSync(options: SyncOptions): AsyncHookReturn;
}
export interface StaticSequelizeHooks {
    /**
     * A hook that is run at the beginning of the creation of a Sequelize instance.
     */
    beforeInit(options: Options): void;
    /**
     * A hook that is run at the end of the creation of a Sequelize instance.
     */
    afterInit(sequelize: Sequelize): void;
}
type TransactionCallback<T> = (t: Transaction) => PromiseLike<T> | T;
/**
 * This is a temporary class used to progressively migrate the Sequelize class to TypeScript by slowly moving its functions here.
 * Always use {@link Sequelize} instead.
 */
export declare abstract class SequelizeTypeScript {
    #private;
    static get hooks(): HookHandler<StaticSequelizeHooks>;
    static addHook: import("./hooks-legacy.js").LegacyAddAnyHookFunction<StaticSequelizeHooks>;
    static removeHook: <HookName extends keyof StaticSequelizeHooks>(this: {
        hooks: HookHandler<StaticSequelizeHooks>;
    }, hookName: HookName, listenerNameOrListener: string | StaticSequelizeHooks[HookName]) => void;
    static hasHook: <HookName extends keyof StaticSequelizeHooks>(this: {
        hooks: HookHandler<StaticSequelizeHooks>;
    }, hookName: HookName) => boolean;
    static hasHooks: <HookName extends keyof StaticSequelizeHooks>(this: {
        hooks: HookHandler<StaticSequelizeHooks>;
    }, hookName: HookName) => boolean;
    static runHooks: import("./hooks-legacy.js").LegacyRunHookFunction<StaticSequelizeHooks, void>;
    static beforeInit: import("./hooks-legacy.js").LegacyAddHookFunction<(options: Options) => void>;
    static afterInit: import("./hooks-legacy.js").LegacyAddHookFunction<(sequelize: Sequelize) => void>;
    get hooks(): HookHandler<SequelizeHooks>;
    addHook: import("./hooks-legacy.js").LegacyAddAnyHookFunction<SequelizeHooks>;
    removeHook: <HookName extends keyof SequelizeHooks>(this: {
        hooks: HookHandler<SequelizeHooks>;
    }, hookName: HookName, listenerNameOrListener: string | SequelizeHooks[HookName]) => void;
    hasHook: <HookName extends keyof SequelizeHooks>(this: {
        hooks: HookHandler<SequelizeHooks>;
    }, hookName: HookName) => boolean;
    hasHooks: <HookName extends keyof SequelizeHooks>(this: {
        hooks: HookHandler<SequelizeHooks>;
    }, hookName: HookName) => boolean;
    runHooks: import("./hooks-legacy.js").LegacyRunHookFunction<SequelizeHooks, void>;
    beforeQuery: import("./hooks-legacy.js").LegacyAddHookFunction<(options: QueryOptions, query: AbstractQuery) => AsyncHookReturn>;
    afterQuery: import("./hooks-legacy.js").LegacyAddHookFunction<(options: QueryOptions, query: AbstractQuery) => AsyncHookReturn>;
    beforeBulkSync: import("./hooks-legacy.js").LegacyAddHookFunction<(options: SyncOptions) => AsyncHookReturn>;
    afterBulkSync: import("./hooks-legacy.js").LegacyAddHookFunction<(options: SyncOptions) => AsyncHookReturn>;
    beforeConnect: import("./hooks-legacy.js").LegacyAddHookFunction<(config: ConnectionOptions) => AsyncHookReturn>;
    afterConnect: import("./hooks-legacy.js").LegacyAddHookFunction<(connection: Connection, config: ConnectionOptions) => AsyncHookReturn>;
    beforeDisconnect: import("./hooks-legacy.js").LegacyAddHookFunction<(connection: Connection) => AsyncHookReturn>;
    afterDisconnect: import("./hooks-legacy.js").LegacyAddHookFunction<(connection: unknown) => AsyncHookReturn>;
    beforeDefine: import("./hooks-legacy.js").LegacyAddHookFunction<(attributes: ModelAttributes<import("./model.js").Model<any, any>, any>, options: ModelOptions<import("./model.js").Model<any, any>>) => void>;
    afterDefine: import("./hooks-legacy.js").LegacyAddHookFunction<(model: ModelStatic<import("./model.js").Model<any, any>>) => void>;
    beforeValidate: import("./hooks-legacy.js").LegacyAddHookFunction<(instance: import("./model.js").Model<any, any>, options: import("./instance-validator.js").ValidationOptions) => AsyncHookReturn>;
    afterValidate: import("./hooks-legacy.js").LegacyAddHookFunction<(instance: import("./model.js").Model<any, any>, options: import("./instance-validator.js").ValidationOptions) => AsyncHookReturn>;
    validationFailed: import("./hooks-legacy.js").LegacyAddHookFunction<(instance: import("./model.js").Model<any, any>, options: import("./instance-validator.js").ValidationOptions, error: unknown) => AsyncHookReturn>;
    beforeCreate: import("./hooks-legacy.js").LegacyAddHookFunction<(attributes: import("./model.js").Model<any, any>, options: import("./model.js").CreateOptions<any>) => AsyncHookReturn>;
    afterCreate: import("./hooks-legacy.js").LegacyAddHookFunction<(attributes: import("./model.js").Model<any, any>, options: import("./model.js").CreateOptions<any>) => AsyncHookReturn>;
    beforeDestroy: import("./hooks-legacy.js").LegacyAddHookFunction<(instance: import("./model.js").Model<any, any>, options: import("./model.js").InstanceDestroyOptions) => AsyncHookReturn>;
    afterDestroy: import("./hooks-legacy.js").LegacyAddHookFunction<(instance: import("./model.js").Model<any, any>, options: import("./model.js").InstanceDestroyOptions) => AsyncHookReturn>;
    beforeRestore: import("./hooks-legacy.js").LegacyAddHookFunction<(instance: import("./model.js").Model<any, any>, options: import("./model.js").InstanceRestoreOptions) => AsyncHookReturn>;
    afterRestore: import("./hooks-legacy.js").LegacyAddHookFunction<(instance: import("./model.js").Model<any, any>, options: import("./model.js").InstanceRestoreOptions) => AsyncHookReturn>;
    beforeUpdate: import("./hooks-legacy.js").LegacyAddHookFunction<(instance: import("./model.js").Model<any, any>, options: import("./model.js").InstanceUpdateOptions<any>) => AsyncHookReturn>;
    afterUpdate: import("./hooks-legacy.js").LegacyAddHookFunction<(instance: import("./model.js").Model<any, any>, options: import("./model.js").InstanceUpdateOptions<any>) => AsyncHookReturn>;
    beforeUpsert: import("./hooks-legacy.js").LegacyAddHookFunction<(attributes: import("./model.js").Model<any, any>, options: import("./model.js").UpsertOptions<any>) => AsyncHookReturn>;
    afterUpsert: import("./hooks-legacy.js").LegacyAddHookFunction<(attributes: [import("./model.js").Model<any, any>, boolean | null], options: import("./model.js").UpsertOptions<any>) => AsyncHookReturn>;
    beforeSave: import("./hooks-legacy.js").LegacyAddHookFunction<(instance: import("./model.js").Model<any, any>, options: import("./model.js").CreateOptions<any> | import("./model.js").InstanceUpdateOptions<any>) => AsyncHookReturn>;
    afterSave: import("./hooks-legacy.js").LegacyAddHookFunction<(instance: import("./model.js").Model<any, any>, options: import("./model.js").CreateOptions<any> | import("./model.js").InstanceUpdateOptions<any>) => AsyncHookReturn>;
    beforeBulkCreate: import("./hooks-legacy.js").LegacyAddHookFunction<(instances: import("./model.js").Model<any, any>[], options: import("./model.js").BulkCreateOptions<any>) => AsyncHookReturn>;
    afterBulkCreate: import("./hooks-legacy.js").LegacyAddHookFunction<(instances: readonly import("./model.js").Model<any, any>[], options: import("./model.js").BulkCreateOptions<any>) => AsyncHookReturn>;
    beforeBulkDestroy: import("./hooks-legacy.js").LegacyAddHookFunction<(options: import("./model.js").DestroyOptions<any>) => AsyncHookReturn>;
    afterBulkDestroy: import("./hooks-legacy.js").LegacyAddHookFunction<(options: import("./model.js").DestroyOptions<any>) => AsyncHookReturn>;
    beforeBulkRestore: import("./hooks-legacy.js").LegacyAddHookFunction<(options: import("./model.js").RestoreOptions<any>) => AsyncHookReturn>;
    afterBulkRestore: import("./hooks-legacy.js").LegacyAddHookFunction<(options: import("./model.js").RestoreOptions<any>) => AsyncHookReturn>;
    beforeBulkUpdate: import("./hooks-legacy.js").LegacyAddHookFunction<(options: import("./model.js").UpdateOptions<any>) => AsyncHookReturn>;
    afterBulkUpdate: import("./hooks-legacy.js").LegacyAddHookFunction<(options: import("./model.js").UpdateOptions<any>) => AsyncHookReturn>;
    beforeCount: import("./hooks-legacy.js").LegacyAddHookFunction<(options: import("./model.js").CountOptions<any>) => AsyncHookReturn>;
    beforeFind: import("./hooks-legacy.js").LegacyAddHookFunction<(options: import("./model.js").FindOptions<any>) => AsyncHookReturn>;
    beforeFindAfterExpandIncludeAll: import("./hooks-legacy.js").LegacyAddHookFunction<(options: import("./model.js").FindOptions<any>) => AsyncHookReturn>;
    beforeFindAfterOptions: import("./hooks-legacy.js").LegacyAddHookFunction<(options: import("./model.js").FindOptions<any>) => AsyncHookReturn>;
    afterFind: import("./hooks-legacy.js").LegacyAddHookFunction<(instancesOrInstance: import("./model.js").Model<any, any> | readonly import("./model.js").Model<any, any>[] | null, options: import("./model.js").FindOptions<any>) => AsyncHookReturn>;
    beforeSync: import("./hooks-legacy.js").LegacyAddHookFunction<(options: SyncOptions) => AsyncHookReturn>;
    afterSync: import("./hooks-legacy.js").LegacyAddHookFunction<(options: SyncOptions) => AsyncHookReturn>;
    beforeAssociate: import("./hooks-legacy.js").LegacyAddHookFunction<(data: import(".").BeforeAssociateEventData, options: import(".").AssociationOptions<any>) => AsyncHookReturn>;
    afterAssociate: import("./hooks-legacy.js").LegacyAddHookFunction<(data: import(".").AfterAssociateEventData, options: import(".").AssociationOptions<any>) => AsyncHookReturn>;
    private _setupTransactionCls;
    addModels(models: ModelStatic[]): void;
    /**
     * Returns the transaction that is associated to the current asynchronous operation.
     * This method returns undefined if no transaction is active in the current asynchronous operation,
     * or if {@link Options.disableClsTransactions} is true.
     */
    getCurrentClsTransaction(): Transaction | undefined;
    /**
     * Start a managed transaction: Sequelize will create a transaction, pass it to your callback, and commit
     * it once the promise returned by your callback resolved, or execute a rollback if the promise rejects.
     *
     * ```ts
     * try {
     *   await sequelize.transaction(() => {
     *     const user = await User.findOne(...);
     *     await user.update(...);
     *   });
     *
     *   // By now, the transaction has been committed
     * } catch {
     *   // If the transaction callback threw an error, the transaction has been rolled back
     * }
     * ```
     *
     * By default, Sequelize uses AsyncLocalStorage to automatically pass the transaction to all queries executed inside the callback (unless you already pass one or set the `transaction` option to null).
     * This can be disabled by setting {@link Options.disableClsTransactions} to true. You will then need to pass transactions to your queries manually.
     *
     * ```ts
     * const sequelize = new Sequelize({
     *   // ...
     *   disableClsTransactions: true,
     * })
     *
     * await sequelize.transaction(transaction => {
     *   // transactions are not automatically passed around anymore, you need to do it yourself:
     *   const user = await User.findOne(..., { transaction });
     *   await user.update(..., { transaction });
     * });
     * ```
     *
     * If you want to manage your transaction yourself, use {@link startUnmanagedTransaction}.
     *
     * @param callback Async callback during which the transaction will be active
     */
    transaction<T>(callback: TransactionCallback<T>): Promise<T>;
    /**
     * @param options Transaction Options
     * @param callback Async callback during which the transaction will be active
     */
    transaction<T>(options: TransactionOptions, callback: TransactionCallback<T>): Promise<T>;
    /**
     * We highly recommend using {@link Sequelize#transaction} instead.
     * If you really want to use the manual solution, don't forget to commit or rollback your transaction once you are done with it.
     *
     * Transactions started by this method are not automatically passed to queries. You must pass the transaction object manually,
     * even if {@link Options.disableClsTransactions} is false.
     *
     * @example
     * ```ts
     * try {
     *   const transaction = await sequelize.startUnmanagedTransaction();
     *   const user = await User.findOne(..., { transaction });
     *   await user.update(..., { transaction });
     *   await transaction.commit();
     * } catch(err) {
     *   await transaction.rollback();
     * }
     * ```
     *
     * @param options
     */
    startUnmanagedTransaction(options?: TransactionOptions): Promise<Transaction>;
}
export {};
