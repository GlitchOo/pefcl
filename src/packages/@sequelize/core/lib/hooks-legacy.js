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
var hooks_legacy_exports = {};
__export(hooks_legacy_exports, {
  legacyBuildAddAnyHook: () => legacyBuildAddAnyHook,
  legacyBuildAddHook: () => legacyBuildAddHook,
  legacyBuildHasHook: () => legacyBuildHasHook,
  legacyBuildRemoveHook: () => legacyBuildRemoveHook,
  legacyBuildRunHook: () => legacyBuildRunHook
});
module.exports = __toCommonJS(hooks_legacy_exports);
var import_deprecations = require("./utils/deprecations.js");
function legacyBuildRunHook(_hookHandlerBuilder) {
  return async function runHooks(hookName, ...args) {
    (0, import_deprecations.hooksReworked)();
    return this.hooks.runAsync(hookName, ...args);
  };
}
function legacyBuildAddAnyHook(_hookHandlerBuilder) {
  return function addHook(hookName, listenerNameOrHook, hook) {
    (0, import_deprecations.hooksReworked)();
    if (hook) {
      this.hooks.addListener(hookName, hook, listenerNameOrHook);
    } else {
      this.hooks.addListener(hookName, listenerNameOrHook);
    }
    return this;
  };
}
function legacyBuildAddHook(hookHandlerBuilder, hookName) {
  return function addHook(listenerNameOrHook, hook) {
    (0, import_deprecations.hooksReworked)();
    if (hook) {
      this.hooks.addListener(hookName, hook, listenerNameOrHook);
    } else {
      this.hooks.addListener(hookName, listenerNameOrHook);
    }
    return this;
  };
}
function legacyBuildHasHook(_hookHandlerBuilder) {
  return function hasHook(hookName) {
    (0, import_deprecations.hooksReworked)();
    return this.hooks.hasListeners(hookName);
  };
}
function legacyBuildRemoveHook(_hookHandlerBuilder) {
  return function removeHook(hookName, listenerNameOrListener) {
    (0, import_deprecations.hooksReworked)();
    return this.hooks.removeListener(hookName, listenerNameOrListener);
  };
}
//# sourceMappingURL=hooks-legacy.js.map
