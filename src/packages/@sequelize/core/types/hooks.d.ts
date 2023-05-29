import type { AllowArray } from './utils/types.js';
export type AsyncHookReturn = Promise<void> | void;
type HookParameters<Hook> = Hook extends (...args2: any) => any ? Parameters<Hook> : never;
type OnRunHook<HookConfig extends {}> = <HookName extends keyof HookConfig>(eventTarget: object, isAsync: boolean, hookName: HookName, args: HookParameters<HookConfig[HookName]>) => AsyncHookReturn;
/**
 * @private
 */
export declare class HookHandler<HookConfig extends {}> {
    #private;
    constructor(eventTarget: object, validHookNames: Array<keyof HookConfig>, onRunHook?: OnRunHook<HookConfig>);
    removeListener<HookName extends keyof HookConfig>(hookName: HookName, listenerOrListenerName: string | HookConfig[HookName]): void;
    removeAllListeners(): void;
    hasListeners(hookName: keyof HookConfig): boolean;
    getListenerCount(hookName: keyof HookConfig): number;
    runSync<HookName extends keyof HookConfig>(hookName: HookName, ...args: HookConfig[HookName] extends (...args2: any) => any ? Parameters<HookConfig[HookName]> : never): void;
    runAsync<HookName extends keyof HookConfig>(hookName: HookName, ...args: HookConfig[HookName] extends (...args2: any) => any ? Parameters<HookConfig[HookName]> : never): Promise<void>;
    addListener<HookName extends keyof HookConfig>(hookName: HookName, listener: HookConfig[HookName], listenerName?: string): void;
    addListeners(listeners: {
        [Key in keyof HookConfig]?: AllowArray<HookConfig[Key] | {
            name: string | symbol;
            callback: HookConfig[Key];
        }>;
    }): void;
}
export declare class HookHandlerBuilder<HookConfig extends {}> {
    #private;
    constructor(validHookNames: Array<keyof HookConfig>, onRunHook?: OnRunHook<HookConfig>);
    getFor(target: object): HookHandler<HookConfig>;
}
export {};
