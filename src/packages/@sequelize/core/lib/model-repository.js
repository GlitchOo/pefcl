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
var model_repository_exports = {};
__export(model_repository_exports, {
  getModelRepository: () => getModelRepository
});
module.exports = __toCommonJS(model_repository_exports);
class ModelRepository {
  #modelDefinition;
  #sequelize;
  constructor(modelDefinition, sequelize) {
    this.#modelDefinition = modelDefinition;
    this.#sequelize = sequelize;
  }
}
const modelRepositories = /* @__PURE__ */ new WeakMap();
function getModelRepository(model) {
  let internals = modelRepositories.get(model);
  if (internals) {
    return internals;
  }
  internals = new ModelRepository(model);
  return internals;
}
//# sourceMappingURL=model-repository.js.map
