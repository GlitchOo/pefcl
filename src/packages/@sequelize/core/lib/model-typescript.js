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
var model_typescript_exports = {};
__export(model_typescript_exports, {
  ModelTypeScript: () => ModelTypeScript,
  initModel: () => initModel
});
module.exports = __toCommonJS(model_typescript_exports);
var import_model = require("./decorators/shared/model.js");
var import_hooks_legacy = require("./hooks-legacy.js");
var import_model_definition = require("./model-definition.js");
var import_model_hooks = require("./model-hooks.js");
var import_deprecations = require("./utils/deprecations.js");
var import_object = require("./utils/object.js");
class ModelTypeScript {
  static get queryInterface() {
    return this.sequelize.queryInterface;
  }
  static get queryGenerator() {
    return this.queryInterface.queryGenerator;
  }
  /**
   * A reference to the sequelize instance.
   */
  get sequelize() {
    return this.constructor.sequelize;
  }
  /**
   * A reference to the sequelize instance.
   *
   * Accessing this property throws if the model has not been registered with a Sequelize instance yet.
   */
  static get sequelize() {
    return this.modelDefinition.sequelize;
  }
  /**
   * Returns the model definition of this model.
   * The model definition contains all metadata about this model.
   */
  static get modelDefinition() {
    return (0, import_model_definition.getModelDefinition)(this);
  }
  /**
   * An object hash from alias to association object
   */
  static get associations() {
    return this.modelDefinition.associations;
  }
  /**
   * The name of the primary key attribute (on the JS side).
   *
   * @deprecated This property doesn't work for composed primary keys. Use {@link primaryKeyAttributes} instead.
   */
  static get primaryKeyAttribute() {
    return this.primaryKeyAttributes[0] ?? null;
  }
  /**
   * The name of the primary key attributes (on the JS side).
   *
   * @deprecated use {@link modelDefinition}.
   */
  static get primaryKeyAttributes() {
    return [...this.modelDefinition.primaryKeysAttributeNames];
  }
  /**
   * The column name of the primary key.
   *
   * @deprecated don't use this. It doesn't work with composite PKs. It may be removed in the future to reduce duplication.
   *  Use the. Use {@link Model.primaryKeys} instead.
   */
  static get primaryKeyField() {
    const primaryKeyAttribute = this.primaryKeyAttribute;
    if (!primaryKeyAttribute) {
      return null;
    }
    return this.modelDefinition.getColumnName(primaryKeyAttribute);
  }
  /**
   * Like {@link Model.rawAttributes}, but only includes attributes that are part of the Primary Key.
   */
  static get primaryKeys() {
    const out = /* @__PURE__ */ Object.create(null);
    const definition = this.modelDefinition;
    for (const primaryKey of definition.primaryKeysAttributeNames) {
      out[primaryKey] = definition.attributes.get(primaryKey);
    }
    return out;
  }
  /**
   * The options that the model was initialized with
   */
  static get options() {
    return this.modelDefinition.options;
  }
  /**
   * The name of the database table
   *
   * @deprecated use {@link modelDefinition} or {@link table}.
   */
  static get tableName() {
    (0, import_deprecations.noModelTableName)();
    return this.modelDefinition.table.tableName;
  }
  static get table() {
    return this.modelDefinition.table;
  }
  /**
   * @deprecated use {@link modelDefinition}'s {@link ModelDefinition#rawAttributes} or {@link ModelDefinition#attributes} instead.
   */
  static get rawAttributes() {
    throw new Error(`${this.name}.rawAttributes has been removed, as it has been split in two:
- If you only need to read the final attributes, use ${this.name}.modelDefinition.attributes
- If you need to modify the attributes, mutate ${this.name}.modelDefinition.rawAttributes, then call ${this.name}.modelDefinition.refreshAttributes()`);
  }
  /**
   * @deprecated use {@link modelDefinition}'s {@link ModelDefinition#rawAttributes} or {@link ModelDefinition#attributes} instead.
   */
  get rawAttributes() {
    return this.constructor.rawAttributes;
  }
  /**
   * @deprecated use {@link modelDefinition}'s {@link ModelDefinition#columns}.
   */
  static get fieldRawAttributesMap() {
    return (0, import_object.getObjectFromMap)(this.modelDefinition.columns);
  }
  /**
   * @deprecated use {@link modelDefinition}'s {@link ModelDefinition#physicalAttributes}.
   */
  static get tableAttributes() {
    return (0, import_object.getObjectFromMap)(this.modelDefinition.physicalAttributes);
  }
  /**
   * A mapping of column name to attribute name
   *
   * @private
   */
  static get fieldAttributeMap() {
    const out = /* @__PURE__ */ Object.create(null);
    const attributes = this.modelDefinition.attributes;
    for (const attribute of attributes.values()) {
      out[attribute.columnName] = attribute.attributeName;
    }
    return out;
  }
  static get hooks() {
    return this.modelDefinition.hooks;
  }
  static addHook = (0, import_hooks_legacy.legacyBuildAddAnyHook)(import_model_hooks.staticModelHooks);
  static hasHook = (0, import_hooks_legacy.legacyBuildHasHook)(import_model_hooks.staticModelHooks);
  static hasHooks = (0, import_hooks_legacy.legacyBuildHasHook)(import_model_hooks.staticModelHooks);
  static removeHook = (0, import_hooks_legacy.legacyBuildRemoveHook)(import_model_hooks.staticModelHooks);
  static runHooks = (0, import_hooks_legacy.legacyBuildRunHook)(import_model_hooks.staticModelHooks);
  static beforeValidate = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "beforeValidate");
  static afterValidate = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "afterValidate");
  static validationFailed = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "validationFailed");
  static beforeCreate = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "beforeCreate");
  static afterCreate = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "afterCreate");
  static beforeDestroy = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "beforeDestroy");
  static afterDestroy = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "afterDestroy");
  static beforeRestore = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "beforeRestore");
  static afterRestore = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "afterRestore");
  static beforeUpdate = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "beforeUpdate");
  static afterUpdate = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "afterUpdate");
  static beforeUpsert = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "beforeUpsert");
  static afterUpsert = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "afterUpsert");
  static beforeSave = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "beforeSave");
  static afterSave = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "afterSave");
  static beforeBulkCreate = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "beforeBulkCreate");
  static afterBulkCreate = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "afterBulkCreate");
  static beforeBulkDestroy = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "beforeBulkDestroy");
  static afterBulkDestroy = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "afterBulkDestroy");
  static beforeBulkRestore = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "beforeBulkRestore");
  static afterBulkRestore = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "afterBulkRestore");
  static beforeBulkUpdate = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "beforeBulkUpdate");
  static afterBulkUpdate = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "afterBulkUpdate");
  static beforeCount = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "beforeCount");
  static beforeFind = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "beforeFind");
  static beforeFindAfterExpandIncludeAll = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "beforeFindAfterExpandIncludeAll");
  static beforeFindAfterOptions = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "beforeFindAfterOptions");
  static afterFind = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "afterFind");
  static beforeSync = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "beforeSync");
  static afterSync = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "afterSync");
  static beforeAssociate = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "beforeAssociate");
  static afterAssociate = (0, import_hooks_legacy.legacyBuildAddHook)(import_model_hooks.staticModelHooks, "afterAssociate");
  /**
   * Initialize a model, representing a table in the DB, with attributes and options.
   *
   * The table columns are defined by the hash that is given as the first argument.
   * Each attribute of the hash represents a column.
   *
   * @example
   * ```javascript
   * Project.init({
   *   columnA: {
   *     type: Sequelize.BOOLEAN,
   *     validate: {
   *       is: ['[a-z]','i'],        // will only allow letters
   *       max: 23,                  // only allow values <= 23
   *       isIn: {
   *         args: [['en', 'zh']],
   *         msg: "Must be English or Chinese"
   *       }
   *     },
   *     field: 'column_a'
   *     // Other attributes here
   *   },
   *   columnB: Sequelize.STRING,
   *   columnC: 'MY VERY OWN COLUMN TYPE'
   * }, {sequelize})
   * ```
   *
   * sequelize.models.modelName // The model will now be available in models under the class name
   *
   * @see https://sequelize.org/docs/v7/core-concepts/model-basics/
   * @see https://sequelize.org/docs/v7/core-concepts/validations-and-constraints/
   *
   * @param attributes An object, where each attribute is a column of the table. Each column can be either a
   *   DataType, a string or a type-description object.
   * @param options These options are merged with the default define options provided to the Sequelize constructor
   */
  static init(attributes, options) {
    if ((0, import_model.isDecoratedModel)(this)) {
      throw new Error(`Model.init cannot be used if the model uses one of Sequelize's decorators. You must pass your model to the Sequelize constructor using the "models" option instead.`);
    }
    if (!options.sequelize) {
      throw new Error("Model.init expects a Sequelize instance to be passed through the option bag, which is the second parameter.");
    }
    initModel(this, attributes, options);
    return this;
  }
  static getIndexes() {
    return this.modelDefinition.getIndexes();
  }
  /**
   * Unique indexes that can be declared as part of a CREATE TABLE query.
   *
   * @deprecated prefer using {@link getIndexes}, this will eventually be removed.
   */
  static get uniqueKeys() {
    const indexes = this.getIndexes();
    const uniqueKeys = /* @__PURE__ */ Object.create(null);
    const supportedOptions = ["unique", "fields", "column", "name"];
    for (const index of indexes) {
      if (!index.unique) {
        continue;
      }
      if (!index.name) {
        continue;
      }
      if (!index.fields) {
        continue;
      }
      if (!index.fields.every((field) => typeof field === "string")) {
        continue;
      }
      if (!Object.keys(index).every((optionName) => supportedOptions.includes(optionName))) {
        continue;
      }
      uniqueKeys[index.name] = index;
    }
    return uniqueKeys;
  }
  // TODO [>7]: Remove this
  static get _indexes() {
    throw new Error("Model._indexes has been replaced with Model.getIndexes()");
  }
  /**
   * Refreshes the Model's attribute definition.
   *
   * @deprecated use {@link modelDefinition}.
   */
  static refreshAttributes() {
    this.modelDefinition.refreshAttributes();
  }
  static assertIsInitialized() {
    if (!this.isInitialized()) {
      throw new Error(`Model "${this.name}" has not been initialized yet. You can check whether a model has been initialized by calling its isInitialized method.`);
    }
  }
  static isInitialized() {
    return (0, import_model_definition.hasModelDefinition)(this);
  }
  /**
   * Get the table name of the model, taking schema into account. The method will an object with `tableName`, `schema` and `delimiter` properties.
   *
   * @deprecated use {@link modelDefinition} or {@link table}.
   */
  static getTableName() {
    const queryGenerator = this.sequelize.queryInterface.queryGenerator;
    return {
      ...this.table,
      /**
       * @deprecated This should not be relied upon!
       */
      // @ts-expect-error -- This toString is a hacky property that must be removed
      toString() {
        return queryGenerator.quoteTable(this);
      }
    };
  }
}
function initModel(model, attributes, options) {
  options.modelName || (options.modelName = model.name);
  const modelDefinition = new import_model_definition.ModelDefinition(
    attributes,
    options,
    model
  );
  (0, import_model_definition.registerModelDefinition)(model, modelDefinition);
  Object.defineProperty(model, "name", { value: modelDefinition.modelName });
  model._scope = model.options.defaultScope;
  model._scopeNames = ["defaultScope"];
  model.sequelize.modelManager.addModel(model);
  model.sequelize.hooks.runSync("afterDefine", model);
  addAttributeGetterAndSetters(model);
  model.hooks.addListener("afterDefinitionRefresh", () => {
    addAttributeGetterAndSetters(model);
  });
}
function addAttributeGetterAndSetters(model) {
  const modelDefinition = model.modelDefinition;
  const { Model: TmpModel } = require("./model.js");
  for (const attribute of modelDefinition.attributes.values()) {
    const attributeName = attribute.attributeName;
    if (attributeName in TmpModel.prototype) {
      model.sequelize.log(`Attribute ${attributeName} in model ${model.name} is shadowing a built-in property of the Model prototype. This is not recommended. Consider renaming your attribute.`);
      continue;
    }
    const attributeProperty = {
      configurable: true,
      get() {
        return this.get(attributeName);
      },
      set(value) {
        return this.set(attributeName, value);
      }
    };
    Object.defineProperty(model.prototype, attributeName, attributeProperty);
  }
}
//# sourceMappingURL=model-typescript.js.map
