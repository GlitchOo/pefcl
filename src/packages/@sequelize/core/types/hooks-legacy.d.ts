import type { HookHandlerBuilder, HookHandler } from './hooks.js';
export interface LegacyRunHookFunction<HookConfig extends {}, Return> {
    <HookName extends keyof HookConfig>(hookName: HookName, ...args: HookConfig[HookName] extends (...args2: any) => any ? Parameters<HookConfig[HookName]> : never): Return;
}
export declare function legacyBuildRunHook<HookConfig extends {}>(_hookHandlerBuilder: HookHandlerBuilder<HookConfig>): LegacyRunHookFunction<HookConfig, void>;
export interface LegacyAddAnyHookFunction<HookConfig extends {}> {
    /**
     * Adds a hook listener
     */
    <This, HookName extends keyof HookConfig>(this: This, hookName: HookName, hook: HookConfig[HookName]): This;
    /**
     * Adds a hook listener
     *
     * @param listenerName Provide a name for the hook function. It can be used to remove the hook later.
     */
    <This, HookName extends keyof HookConfig>(this: This, hookName: HookName, listenerName: string, hook: HookConfig[HookName]): This;
}
export declare function legacyBuildAddAnyHook<HookConfig extends {}>(_hookHandlerBuilder: HookHandlerBuilder<HookConfig>): LegacyAddAnyHookFunction<HookConfig>;
export interface LegacyAddHookFunction<Fn> {
    /**
     * Adds a hook listener
     */
    <This extends object>(this: This, hook: Fn): This;
    /**
     * Adds a hook listener
     *
     * @param listenerName Provide a name for the hook function. It can be used to remove the hook later.
     */
    <This extends object>(this: This, listenerName: string, hook: Fn): This;
}
export declare function legacyBuildAddHook<HookConfig extends {}, HookName extends keyof HookConfig>(hookHandlerBuilder: HookHandlerBuilder<HookConfig>, hookName: HookName): LegacyAddHookFunction<HookConfig[HookName]>;
export declare function legacyBuildHasHook<HookConfig extends {}>(_hookHandlerBuilder: HookHandlerBuilder<HookConfig>): <HookName extends keyof HookConfig>(this: {
    hooks: HookHandler<HookConfig>;
}, hookName: HookName) => boolean;
export declare function legacyBuildRemoveHook<HookConfig extends {}>(_hookHandlerBuilder: HookHandlerBuilder<HookConfig>): <HookName extends keyof HookConfig>(this: {
    hooks: HookHandler<HookConfig>;
}, hookName: HookName, listenerNameOrListener: string | HookConfig[HookName]) => void;
