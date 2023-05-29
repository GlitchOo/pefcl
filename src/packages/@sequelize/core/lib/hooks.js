"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var hooks_exports = {};
__export(hooks_exports, {
  HookHandler: () => HookHandler,
  HookHandlerBuilder: () => HookHandlerBuilder
});
module.exports = __toCommonJS(hooks_exports);
var import_multimap = require("./utils/multimap.js");
class HookHandler {
  #validHookNames;
  #eventTarget;
  #listeners = new import_multimap.Multimap();
  #onRunHook;
  constructor(eventTarget, validHookNames, onRunHook) {
    this.#eventTarget = eventTarget;
    this.#validHookNames = validHookNames;
    this.#onRunHook = onRunHook;
  }
  removeListener(hookName, listenerOrListenerName) {
    this.#assertValidHookName(hookName);
    if (typeof listenerOrListenerName === "string") {
      const listener = this.#getNamedListener(hookName, listenerOrListenerName);
      if (listener) {
        this.#listeners.delete(hookName, listener);
      }
    } else {
      const listeners = this.#listeners.getAll(hookName);
      for (const listener of listeners) {
        if (listener.callback === listenerOrListenerName) {
          this.#listeners.delete(hookName, listener);
        }
      }
    }
  }
  removeAllListeners() {
    this.#listeners.clear();
  }
  #getNamedListener(hookName, listenerName) {
    const listeners = this.#listeners.getAll(hookName);
    for (const listener of listeners) {
      if (listener.listenerName === listenerName) {
        return listener;
      }
    }
    return null;
  }
  hasListeners(hookName) {
    this.#assertValidHookName(hookName);
    return this.#listeners.count(hookName) > 0;
  }
  getListenerCount(hookName) {
    this.#assertValidHookName(hookName);
    return this.#listeners.count(hookName);
  }
  runSync(hookName, ...args) {
    this.#assertValidHookName(hookName);
    const listeners = this.#listeners.getAll(hookName);
    for (const listener of listeners) {
      const out = listener.callback(...args);
      if (out && "then" in out) {
        throw new Error(`${listener.listenerName ? `Listener ${listener.listenerName}` : `An unnamed listener`} of hook ${String(hookName)} on ${getName(this.#eventTarget)} returned a Promise, but the hook is synchronous.`);
      }
    }
    if (this.#onRunHook) {
      void this.#onRunHook(this.#eventTarget, false, hookName, args);
    }
  }
  async runAsync(hookName, ...args) {
    this.#assertValidHookName(hookName);
    const listeners = this.#listeners.getAll(hookName);
    for (const listener of listeners) {
      await listener.callback(...args);
    }
    if (this.#onRunHook) {
      await this.#onRunHook(this.#eventTarget, true, hookName, args);
    }
  }
  addListener(hookName, listener, listenerName) {
    this.#assertValidHookName(hookName);
    if (listenerName) {
      const existingListener = this.#getNamedListener(hookName, listenerName);
      if (existingListener) {
        throw new Error(`Named listener ${listenerName} already exists for hook ${String(hookName)} on ${getName(this.#eventTarget)}.`);
      }
    }
    this.#listeners.append(hookName, { callback: listener, listenerName });
  }
  addListeners(listeners) {
    for (const hookName of this.#validHookNames) {
      const hookListeners = listeners[hookName];
      if (!hookListeners) {
        continue;
      }
      const hookListenersArray = Array.isArray(hookListeners) ? hookListeners : [hookListeners];
      for (const listener of hookListenersArray) {
        if (typeof listener === "function") {
          this.addListener(hookName, listener);
        } else {
          this.addListener(hookName, listener.callback, listener.name);
        }
      }
    }
  }
  #assertValidHookName(hookName) {
    if (!this.#validHookNames.includes(hookName)) {
      throw new Error(`Target ${getName(this.#eventTarget)} does not support a hook named "${String(hookName)}".`);
    }
  }
}
class HookHandlerBuilder {
  #validHookNames;
  #hookHandlers = /* @__PURE__ */ new WeakMap();
  #onRunHook;
  constructor(validHookNames, onRunHook) {
    this.#validHookNames = validHookNames;
    this.#onRunHook = onRunHook;
  }
  getFor(target) {
    let hookHandler = this.#hookHandlers.get(target);
    if (!hookHandler) {
      hookHandler = new HookHandler(target, this.#validHookNames, this.#onRunHook);
      this.#hookHandlers.set(target, hookHandler);
    }
    return hookHandler;
  }
}
function getName(obj) {
  if (typeof obj === "function") {
    return `[class ${obj.name}]`;
  }
  return `[instance ${obj.constructor.name}]`;
}
//# sourceMappingURL=hooks.js.map
