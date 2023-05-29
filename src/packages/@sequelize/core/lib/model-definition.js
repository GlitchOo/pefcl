"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var model_definition_exports = {};
__export(model_definition_exports, {
  ModelDefinition: () => ModelDefinition,
  getModelDefinition: () => getModelDefinition,
  hasModelDefinition: () => hasModelDefinition,
  mergeModelOptions: () => mergeModelOptions,
  normalizeReference: () => normalizeReference,
  registerModelDefinition: () => registerModelDefinition
});
module.exports = __toCommonJS(model_definition_exports);
var import_node_util = __toESM(require("node:util"));
var import_isPlainObject = __toESM(require("lodash/isPlainObject"));
var import_omit = __toESM(require("lodash/omit"));
var DataTypes = __toESM(require("./data-types.js"));
var import_data_types_utils = require("./dialects/abstract/data-types-utils.js");
var import_data_types = require("./dialects/abstract/data-types.js");
var import_errors = require("./errors/index.js");
var import_model_hooks = require("./model-hooks.js");
var import_model_internals = require("./model-internals.js");
var import_deprecations = require("./utils/deprecations.js");
var import_dialect = require("./utils/dialect.js");
var import_immutability = require("./utils/immutability.js");
var import_iterators = require("./utils/iterators.js");
var import_model_utils = require("./utils/model-utils.js");
var import_object = require("./utils/object.js");
var import_string = require("./utils/string.js");
class ModelDefinition {
  #sequelize;
  options;
  #table;
  get table() {
    return this.#table;
  }
  associations = /* @__PURE__ */ Object.create(null);
  /**
   * The list of attributes that have *not* been normalized.
   * This list can be mutated. Call {@link refreshAttributes} to update the normalized attributes ({@link attributes)}.
   */
  rawAttributes;
  #attributes = /* @__PURE__ */ new Map();
  /**
   * The list of attributes that have been normalized.
   *
   * This map is fully frozen and cannot be modified directly.
   * Modify {@link rawAttributes} then call {@link refreshAttributes} instead.
   */
  attributes = new import_immutability.MapView(this.#attributes);
  #physicalAttributes = /* @__PURE__ */ new Map();
  /**
   * The list of attributes that actually exist in the database, as opposed to {@link virtualAttributeNames}.
   */
  physicalAttributes = new import_immutability.MapView(this.#physicalAttributes);
  #columns = /* @__PURE__ */ new Map();
  columns = new import_immutability.MapView(this.#columns);
  #primaryKeyAttributeNames = /* @__PURE__ */ new Set();
  primaryKeysAttributeNames = new import_immutability.SetView(this.#primaryKeyAttributeNames);
  /**
   * List of attributes that cannot be modified by the user
   */
  #readOnlyAttributeNames = /* @__PURE__ */ new Set();
  /**
   * List of attributes that cannot be modified by the user (read-only)
   */
  readOnlyAttributeNames = new import_immutability.SetView(this.#readOnlyAttributeNames);
  /**
   * Records which attributes are the different built-in timestamp attributes
   */
  timestampAttributeNames = /* @__PURE__ */ Object.create(null);
  /**
   * The name of the attribute that records the version of the model instance.
   */
  #versionAttributeName;
  get versionAttributeName() {
    return this.#versionAttributeName;
  }
  #jsonAttributeNames = /* @__PURE__ */ new Set();
  jsonAttributeNames = new import_immutability.SetView(this.#jsonAttributeNames);
  #virtualAttributeNames = /* @__PURE__ */ new Set();
  /**
   * The list of attributes that do not really exist in the database.
   */
  virtualAttributeNames = new import_immutability.SetView(this.#virtualAttributeNames);
  #attributesWithGetters = /* @__PURE__ */ new Set();
  attributesWithGetters = new import_immutability.SetView(this.#attributesWithGetters);
  #attributesWithSetters = /* @__PURE__ */ new Set();
  attributesWithSetters = new import_immutability.SetView(this.#attributesWithSetters);
  /**
   * @deprecated Code should not rely on this as users can create custom attributes.
   */
  #booleanAttributeNames = /* @__PURE__ */ new Set();
  /**
   * @deprecated Code should not rely on this as users can create custom attributes.
   */
  booleanAttributeNames = new import_immutability.SetView(this.#booleanAttributeNames);
  /**
   * @deprecated Code should not rely on this as users can create custom attributes.
   */
  #dateAttributeNames = /* @__PURE__ */ new Set();
  /**
   * @deprecated Code should not rely on this as users can create custom attributes.
   */
  dateAttributeNames = new import_immutability.SetView(this.#dateAttributeNames);
  #autoIncrementAttributeName = null;
  get autoIncrementAttributeName() {
    return this.#autoIncrementAttributeName;
  }
  #defaultValues = /* @__PURE__ */ new Map();
  defaultValues = new import_immutability.MapView(this.#defaultValues);
  /**
   * Final list of indexes, built by refreshIndexes
   */
  #indexes = [];
  /**
   * @deprecated Temporary property to be able to use elements that have not migrated to ModelDefinition yet.
   */
  #model;
  get modelName() {
    return this.options.modelName;
  }
  get underscored() {
    return this.options.underscored;
  }
  get sequelize() {
    return this.#sequelize;
  }
  get hooks() {
    return import_model_hooks.staticModelHooks.getFor(this);
  }
  constructor(attributesOptions, modelOptions, model) {
    var _a, _b, _c;
    if (!modelOptions.sequelize) {
      throw new Error("new ModelDefinition() expects a Sequelize instance to be passed through the option bag, which is the second parameter.");
    }
    if (!modelOptions.modelName) {
      throw new Error("new ModelDefinition() expects a modelName to be passed through the option bag, which is the second parameter.");
    }
    this.#sequelize = modelOptions.sequelize;
    this.#model = model;
    const globalOptions = this.#sequelize.options;
    this.options = mergeModelOptions(
      Object.assign(
        // default options
        {
          noPrimaryKey: false,
          timestamps: true,
          validate: {},
          freezeTableName: false,
          underscored: false,
          paranoid: false,
          rejectOnEmpty: false,
          schema: "",
          schemaDelimiter: "",
          defaultScope: {},
          scopes: {},
          name: {},
          indexes: []
        },
        globalOptions.define
      ),
      modelOptions,
      true
    );
    if (this.options.getterMethods || this.options.setterMethods) {
      throw new Error(`Error in the definition of Model ${this.modelName}: The "getterMethods" and "setterMethods" options have been removed.

If you need to use getters & setters that behave like attributes, use VIRTUAL attributes.
If you need regular getters & setters, define your model as a class and add getter & setters.
See https://sequelize.org/docs/v6/core-concepts/getters-setters-virtuals/#deprecated-in-sequelize-v7-gettermethods-and-settermethods for more information.`);
    }
    (_a = this.options.name).plural ?? (_a.plural = (0, import_string.pluralize)(modelOptions.modelName));
    (_b = this.options.name).singular ?? (_b.singular = modelOptions.modelName);
    this.#sequelize.hooks.runSync("beforeDefine", attributesOptions, this.options);
    delete modelOptions.modelName;
    if (this.sequelize.isDefined(this.modelName)) {
      this.sequelize.modelManager.removeModel(this.sequelize.modelManager.getModel(this.modelName));
    }
    if (this.options.hooks) {
      this.hooks.addListeners(this.options.hooks);
    }
    if (!this.options.tableName) {
      this.options.tableName = this.options.freezeTableName ? this.modelName : (0, import_string.underscoredIf)((0, import_string.pluralize)(this.modelName), this.underscored);
    }
    this.#table = Object.freeze(this.sequelize.queryInterface.queryGenerator.extractTableDetails((0, import_object.removeUndefined)({
      tableName: this.options.tableName,
      schema: this.options.schema,
      delimiter: this.options.schemaDelimiter
    })));
    for (const [validatorName, validator] of (0, import_object.getAllOwnEntries)(this.options.validate)) {
      if (typeof validator !== "function") {
        throw new TypeError(`Members of the validate option must be functions. Model: ${this.modelName}, error with validate member ${String(validatorName)}`);
      }
    }
    const rawAttributes = /* @__PURE__ */ Object.create(null);
    for (const [attributeName, rawAttributeOrDataType] of (0, import_object.getAllOwnEntries)(attributesOptions)) {
      if (typeof attributeName === "symbol") {
        throw new TypeError("Symbol attributes are not supported");
      }
      let rawAttribute;
      try {
        rawAttribute = this.sequelize.normalizeAttribute(rawAttributeOrDataType);
      } catch (error) {
        throw new import_errors.BaseError(`An error occurred for attribute ${attributeName} on model ${this.modelName}.`, { cause: error });
      }
      rawAttributes[attributeName] = rawAttribute;
      if (rawAttribute.field) {
        (0, import_deprecations.fieldToColumn)();
      }
    }
    if (this.options.timestamps) {
      for (const key of ["createdAt", "updatedAt", "deletedAt"]) {
        if (!["undefined", "string", "boolean"].includes(typeof this.options[key])) {
          throw new Error(`Value for "${key}" option must be a string or a boolean, got ${typeof this.options[key]}`);
        }
        if (this.options[key] === "") {
          throw new Error(`Value for "${key}" option cannot be an empty string`);
        }
      }
      if (this.options.createdAt !== false) {
        this.timestampAttributeNames.createdAt = typeof this.options.createdAt === "string" ? this.options.createdAt : "createdAt";
        this.#readOnlyAttributeNames.add(this.timestampAttributeNames.createdAt);
      }
      if (this.options.updatedAt !== false) {
        this.timestampAttributeNames.updatedAt = typeof this.options.updatedAt === "string" ? this.options.updatedAt : "updatedAt";
        this.#readOnlyAttributeNames.add(this.timestampAttributeNames.updatedAt);
      }
      if (this.options.paranoid && this.options.deletedAt !== false) {
        this.timestampAttributeNames.deletedAt = typeof this.options.deletedAt === "string" ? this.options.deletedAt : "deletedAt";
        this.#readOnlyAttributeNames.add(this.timestampAttributeNames.deletedAt);
      }
    }
    if (this.options.version) {
      this.#versionAttributeName = typeof this.options.version === "string" ? this.options.version : "version";
      this.#readOnlyAttributeNames.add(this.#versionAttributeName);
    }
    this.rawAttributes = /* @__PURE__ */ Object.create(null);
    if (!this.options.noPrimaryKey && !(0, import_iterators.some)(Object.values(rawAttributes), (attr) => Boolean(attr.primaryKey))) {
      if ("id" in rawAttributes && ((_c = rawAttributes.id) == null ? void 0 : _c.primaryKey) === void 0) {
        throw new Error(`An attribute called 'id' was defined in model '${this.options.tableName}' but primaryKey is not set. This is likely to be an error, which can be fixed by setting its 'primaryKey' option to true. If this is intended, explicitly set its 'primaryKey' option to false`);
      }
      this.rawAttributes.id = {
        type: DataTypes.INTEGER(),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        _autoGenerated: true
      };
    }
    for (const [attributeName, rawAttribute] of Object.entries(rawAttributes)) {
      this.rawAttributes[attributeName] = rawAttribute;
    }
    if (this.timestampAttributeNames.createdAt) {
      this.#addTimestampAttribute(this.timestampAttributeNames.createdAt, false);
    }
    if (this.timestampAttributeNames.updatedAt) {
      this.#addTimestampAttribute(this.timestampAttributeNames.updatedAt, false);
    }
    if (this.timestampAttributeNames.deletedAt) {
      this.#addTimestampAttribute(this.timestampAttributeNames.deletedAt, true);
    }
    if (this.#versionAttributeName) {
      const existingAttribute = this.rawAttributes[this.#versionAttributeName];
      if ((existingAttribute == null ? void 0 : existingAttribute.type) && !(existingAttribute.type instanceof DataTypes.INTEGER)) {
        throw new Error(`Sequelize is trying to add the version attribute ${import_node_util.default.inspect(this.#versionAttributeName)} to Model ${import_node_util.default.inspect(this.modelName)},
but an attribute with the same name already exists and declares a data type.
The "version" attribute is managed automatically by Sequelize, and its type must be DataTypes.INTEGER. Please either:
- remove the "type" property from your attribute definition,
- rename either your attribute or the version attribute,
- or disable the automatic timestamp attributes.`);
      }
      if ((existingAttribute == null ? void 0 : existingAttribute.allowNull) === true) {
        throw new Error(`Sequelize is trying to add the timestamp attribute ${import_node_util.default.inspect(this.#versionAttributeName)} to Model ${import_node_util.default.inspect(this.modelName)},
but an attribute with the same name already exists and its allowNull option (${existingAttribute.allowNull}) conflicts with the one Sequelize is trying to set (false).
The "version" attribute is managed automatically by Sequelize, and its nullability is not configurable. Please either:
- remove the "allowNull" property from your attribute definition,
- rename either your attribute or the version attribute,
- or disable the automatic version attribute.`);
      }
      this.rawAttributes[this.#versionAttributeName] = {
        ...existingAttribute,
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        _autoGenerated: true
      };
    }
    this.refreshAttributes();
  }
  #addTimestampAttribute(attributeName, allowNull) {
    const existingAttribute = this.rawAttributes[attributeName];
    if ((existingAttribute == null ? void 0 : existingAttribute.type) && !(existingAttribute.type instanceof DataTypes.DATE)) {
      throw new Error(`Sequelize is trying to add the timestamp attribute ${import_node_util.default.inspect(attributeName)} to Model ${import_node_util.default.inspect(this.modelName)},
but an attribute with the same name already exists and declares a data type.
Timestamp attributes are managed automatically by Sequelize, and their data type must be DataTypes.DATE (https://github.com/sequelize/sequelize/issues/2572). Please either:
- remove the "type" property from your attribute definition,
- rename either your attribute or the timestamp attribute,
- or disable the automatic timestamp attributes.`);
    }
    if ((existingAttribute == null ? void 0 : existingAttribute.allowNull) != null && (existingAttribute == null ? void 0 : existingAttribute.allowNull) !== allowNull) {
      throw new Error(`Sequelize is trying to add the timestamp attribute ${import_node_util.default.inspect(attributeName)} to Model ${import_node_util.default.inspect(this.modelName)},
but an attribute with the same name already exists and its allowNull option (${existingAttribute.allowNull}) conflicts with the one Sequelize is trying to set (${allowNull}).
Timestamp attributes are managed automatically by Sequelize, and their nullability is not configurable. Please either:
- remove the "allowNull" property from your attribute definition,
- rename either your attribute or the timestamp attribute,
- or disable the automatic timestamp attributes.`);
    }
    this.rawAttributes[attributeName] = {
      // @ts-expect-error -- this property is not mandatory in timestamp attributes
      type: DataTypes.DATE(6),
      ...this.rawAttributes[attributeName],
      allowNull,
      _autoGenerated: true
    };
  }
  /**
   * Normalizes all attribute definitions, using {@link rawAttributes} as the source.
   */
  refreshAttributes() {
    var _a;
    this.hooks.runSync("beforeDefinitionRefresh");
    this.#attributes.clear();
    this.#booleanAttributeNames.clear();
    this.#dateAttributeNames.clear();
    this.#jsonAttributeNames.clear();
    this.#virtualAttributeNames.clear();
    this.#physicalAttributes.clear();
    this.#defaultValues.clear();
    this.#columns.clear();
    this.#primaryKeyAttributeNames.clear();
    this.#autoIncrementAttributeName = null;
    this.#attributesWithGetters.clear();
    this.#attributesWithSetters.clear();
    const attributeIndexes = [];
    for (const [attributeName, rawAttribute] of Object.entries(this.rawAttributes)) {
      if (typeof attributeName !== "string") {
        throw new TypeError(`Attribute names must be strings, but "${this.modelName}" declared a non-string attribute: ${import_node_util.default.inspect(attributeName)}`);
      }
      if (attributeName.startsWith("$") || attributeName.endsWith("$")) {
        throw new Error(`Name of attribute "${attributeName}" in model "${this.modelName}" cannot start or end with "$" as "$attribute$" is reserved syntax used to reference nested columns in queries.`);
      }
      if (attributeName.includes(".")) {
        throw new Error(`Name of attribute "${attributeName}" in model "${this.modelName}" cannot include the character "." as it would be ambiguous with the syntax used to reference nested columns, and nested json keys, in queries.`);
      }
      if (attributeName.includes("::")) {
        throw new Error(`Name of attribute "${attributeName}" in model "${this.modelName}" cannot include the character sequence "::" as it is reserved syntax used to cast attributes in queries.`);
      }
      if (attributeName.includes("->")) {
        throw new Error(`Name of attribute "${attributeName}" in model "${this.modelName}" cannot include the character sequence "->" as it is reserved syntax used in SQL generated by Sequelize to target nested associations.`);
      }
      if (!(0, import_isPlainObject.default)(rawAttribute)) {
        throw new Error(`Attribute "${this.modelName}.${attributeName}" must be specified as a plain object.`);
      }
      if (!rawAttribute.type) {
        throw new Error(`Attribute "${this.modelName}.${attributeName}" does not specify its DataType.`);
      }
      try {
        const columnName = rawAttribute.columnName ?? rawAttribute.field ?? (0, import_string.underscoredIf)(attributeName, this.underscored);
        const builtAttribute = (0, import_object.noPrototype)({
          ...(0, import_omit.default)(rawAttribute, ["unique", "index"]),
          type: this.#sequelize.normalizeDataType(rawAttribute.type),
          references: normalizeReference(rawAttribute.references),
          // fieldName is a legacy name, renamed to attributeName.
          fieldName: attributeName,
          attributeName,
          // field is a legacy name, renamed to columnName.
          field: columnName,
          columnName,
          // @ts-expect-error -- undocumented legacy property, to be removed.
          Model: this.#model,
          // undocumented legacy property, to be removed.
          _modelAttribute: true
        });
        if (builtAttribute.type instanceof import_data_types.AbstractDataType) {
          builtAttribute.type = builtAttribute.type.clone().attachUsageContext({
            // TODO: Repository Pattern - replace with ModelDefinition
            model: this.#model,
            attributeName,
            sequelize: this.sequelize
          });
        }
        if (Object.prototype.hasOwnProperty.call(builtAttribute, "defaultValue")) {
          if ((0, import_data_types_utils.isDataTypeClass)(builtAttribute.defaultValue)) {
            builtAttribute.defaultValue = new builtAttribute.defaultValue();
          }
          this.#defaultValues.set(attributeName, () => (0, import_dialect.toDefaultValue)(builtAttribute.defaultValue, this.sequelize.dialect));
        }
        if (rawAttribute.allowNull !== false && ((_a = rawAttribute.validate) == null ? void 0 : _a.notNull)) {
          throw new Error(`"notNull" validator is only allowed with "allowNull:false"`);
        }
        if (builtAttribute.primaryKey === true) {
          this.#primaryKeyAttributeNames.add(attributeName);
        }
        if (builtAttribute.type instanceof DataTypes.BOOLEAN) {
          this.#booleanAttributeNames.add(attributeName);
        } else if (builtAttribute.type instanceof DataTypes.DATE || rawAttribute.type instanceof DataTypes.DATEONLY) {
          this.#dateAttributeNames.add(attributeName);
        } else if (builtAttribute.type instanceof DataTypes.JSON) {
          this.#jsonAttributeNames.add(attributeName);
        }
        if (Object.prototype.hasOwnProperty.call(rawAttribute, "unique") && rawAttribute.unique) {
          const uniqueIndexes = Array.isArray(rawAttribute.unique) ? rawAttribute.unique : [rawAttribute.unique];
          for (const uniqueIndex of uniqueIndexes) {
            if (uniqueIndex === true || typeof uniqueIndex === "string") {
              attributeIndexes.push({
                unique: true,
                fields: [builtAttribute.columnName],
                ...typeof uniqueIndex === "string" ? { name: uniqueIndex } : void 0
              });
            } else {
              attributeIndexes.push({
                ...uniqueIndex,
                unique: true,
                fields: [builtAttribute.columnName]
              });
            }
          }
        }
        if (Object.prototype.hasOwnProperty.call(rawAttribute, "index") && rawAttribute.index) {
          const indexes = Array.isArray(rawAttribute.index) ? rawAttribute.index : [rawAttribute.index];
          for (const index of indexes) {
            const jsonbIndexDefaults = rawAttribute.type instanceof DataTypes.JSONB ? { using: "gin" } : void 0;
            if (!index) {
              continue;
            }
            if (index === true || typeof index === "string") {
              attributeIndexes.push({
                fields: [builtAttribute.columnName],
                ...typeof index === "string" ? { name: index } : void 0,
                ...jsonbIndexDefaults
              });
            } else {
              if (index.fields) {
                throw new Error('"fields" cannot be specified for indexes defined on attributes. Use the "indexes" option on the table definition instead. You can also customize how this attribute is part of the index by specifying the "attribute" option on the index.');
              }
              const { attribute: indexAttributeOptions, ...indexOptions } = index;
              attributeIndexes.push({
                ...jsonbIndexDefaults,
                ...indexOptions,
                fields: [
                  indexAttributeOptions ? {
                    ...indexAttributeOptions,
                    name: builtAttribute.columnName
                  } : builtAttribute.columnName
                ]
              });
            }
          }
        }
        if (builtAttribute.autoIncrement) {
          if (this.#autoIncrementAttributeName) {
            throw new Error(`Only one autoIncrement attribute is allowed per model, but both ${import_node_util.default.inspect(attributeName)} and ${import_node_util.default.inspect(this.#autoIncrementAttributeName)} are marked as autoIncrement.`);
          }
          this.#autoIncrementAttributeName = attributeName;
        }
        Object.freeze(builtAttribute);
        this.#attributes.set(attributeName, builtAttribute);
        this.#columns.set(builtAttribute.columnName, builtAttribute);
        if (builtAttribute.type instanceof DataTypes.VIRTUAL) {
          this.#virtualAttributeNames.add(attributeName);
        } else {
          this.#physicalAttributes.set(attributeName, builtAttribute);
        }
        if (builtAttribute.get) {
          this.#attributesWithGetters.add(attributeName);
        }
        if (builtAttribute.set) {
          this.#attributesWithSetters.add(attributeName);
        }
      } catch (error) {
        throw new import_errors.BaseError(`An error occurred while normalizing attribute ${JSON.stringify(attributeName)} in model ${JSON.stringify(this.modelName)}.`, { cause: error });
      }
    }
    this.#refreshIndexes(attributeIndexes);
    this.hooks.runSync("afterDefinitionRefresh");
  }
  #refreshIndexes(attributeIndexes) {
    this.#indexes = [];
    for (const index of this.options.indexes) {
      this.#addIndex(index);
    }
    for (const index of attributeIndexes) {
      this.#addIndex(index);
    }
  }
  #addIndex(index) {
    var _a, _b;
    index = this.#nameIndex((0, import_model_internals.conformIndex)(index));
    if (typeof ((_a = index.fields) == null ? void 0 : _a[0]) === "string") {
      const column = (_b = this.columns.get(index.fields[0])) == null ? void 0 : _b.attributeName;
      if (column) {
        index.column = column;
      }
    }
    const existingIndex = this.#indexes.find((i) => i.name === index.name);
    if (existingIndex == null) {
      this.#indexes.push(index);
      return;
    }
    for (const key of Object.keys(index)) {
      if (index[key] === void 0) {
        continue;
      }
      if (key === "column") {
        continue;
      }
      if (key === "fields") {
        if (existingIndex.fields == null) {
          existingIndex.fields = index.fields;
        } else {
          existingIndex.fields = [...existingIndex.fields, ...index.fields];
        }
        continue;
      }
      if (existingIndex[key] === void 0) {
        existingIndex[key] = index[key];
      }
      if (existingIndex[key] !== index[key]) {
        throw new Error(`Index "${index.name}" has conflicting options: "${key}" was defined with different values ${import_node_util.default.inspect(existingIndex[key])} and ${import_node_util.default.inspect(index[key])}.`);
      }
    }
  }
  #nameIndex(newIndex) {
    if (Object.prototype.hasOwnProperty.call(newIndex, "name")) {
      return newIndex;
    }
    const newName = (0, import_string.generateIndexName)(this.table, newIndex);
    for (const index of this.getIndexes()) {
      if (index.name === newName) {
        throw new Error(`Sequelize tried to give the name "${newName}" to index:
${import_node_util.default.inspect(newIndex)}
on model "${this.#model.name}", but that name is already taken by index:
${import_node_util.default.inspect(index)}

Specify a different name for either index to resolve this issue.`);
      }
    }
    newIndex.name = newName;
    return newIndex;
  }
  getIndexes() {
    return this.#indexes;
  }
  /**
   * Returns the column name corresponding to the given attribute name.
   *
   * @param attributeName
   */
  getColumnName(attributeName) {
    const attribute = this.#attributes.get(attributeName);
    if (attribute == null) {
      throw new Error(`Attribute "${attributeName}" does not exist on model "${this.modelName}".`);
    }
    return attribute.columnName;
  }
  /**
   * Returns the column name corresponding to the given attribute name if it exists, otherwise returns the attribute name.
   *
   * ⚠️ Using this method is highly discouraged. Users should specify column names & attribute names separately, to prevent any ambiguity.
   *
   * @param attributeName
   */
  getColumnNameLoose(attributeName) {
    const attribute = this.#attributes.get(attributeName);
    return (attribute == null ? void 0 : attribute.columnName) ?? attributeName;
  }
}
const modelDefinitions = /* @__PURE__ */ new WeakMap();
function registerModelDefinition(model, modelDefinition) {
  if (modelDefinitions.has(model)) {
    throw new Error(`Model ${model.name} has already been initialized. Models can only belong to one Sequelize instance. Registering the same model with multiple Sequelize instances is not yet supported. Please see https://github.com/sequelize/sequelize/issues/15389`);
  }
  modelDefinitions.set(model, modelDefinition);
}
function hasModelDefinition(model) {
  return modelDefinitions.has(model);
}
function getModelDefinition(model) {
  const definition = modelDefinitions.get(model);
  if (!definition) {
    throw new Error(`Model ${model.name} has not been initialized yet.`);
  }
  return definition;
}
function normalizeReference(references) {
  if (!references) {
    return void 0;
  }
  if (typeof references === "string") {
    return Object.freeze({
      table: references,
      get model() {
        throw new Error("references.model has been renamed to references.tableName in normalized references options.");
      }
    });
  }
  if ((0, import_model_utils.isModelStatic)(references)) {
    return Object.freeze({
      table: references.table,
      get model() {
        throw new Error("references.model has been renamed to references.tableName in normalized references options.");
      }
    });
  }
  const { model, table, ...referencePassDown } = references;
  if (model && table) {
    throw new Error('"references" cannot contain both "model" and "tableName"');
  }
  if (!model && !table) {
    return void 0;
  }
  if (model || table) {
    return Object.freeze({
      table: model ? model.table : table,
      ...referencePassDown,
      get model() {
        throw new Error("references.model has been renamed to references.tableName in normalized references options.");
      }
    });
  }
}
function mergeModelOptions(existingModelOptions, options, overrideOnConflict) {
  for (const [optionName, optionValue] of Object.entries(options)) {
    if (!(optionName in existingModelOptions)) {
      existingModelOptions[optionName] = optionValue;
      continue;
    }
    if (optionName === "scopes" || optionName === "validate") {
      for (const [subOptionName, subOptionValue] of (0, import_object.getAllOwnEntries)(optionValue)) {
        if (existingModelOptions[optionName][subOptionName] === subOptionValue) {
          continue;
        }
        if (!overrideOnConflict && subOptionName in existingModelOptions[optionName]) {
          throw new Error(`Trying to set the option ${optionName}[${JSON.stringify(subOptionName)}], but a value already exists.`);
        }
        existingModelOptions[optionName][subOptionName] = subOptionValue;
      }
      continue;
    }
    if (optionName === "hooks") {
      const existingHooks = existingModelOptions.hooks;
      for (const hookType of Object.keys(optionValue)) {
        if (!existingHooks[hookType]) {
          existingHooks[hookType] = optionValue[hookType];
          continue;
        }
        const existingHooksOfType = Array.isArray(existingHooks[hookType]) ? existingHooks[hookType] : [existingHooks[hookType]];
        if (!Array.isArray(optionValue[hookType])) {
          existingHooks[hookType] = [...existingHooksOfType, optionValue[hookType]];
        } else {
          existingHooks[hookType] = [...existingHooksOfType, ...optionValue[hookType]];
        }
      }
      continue;
    }
    if (optionName === "indexes") {
      existingModelOptions.indexes = [...existingModelOptions.indexes, ...optionValue];
      continue;
    }
    if (!overrideOnConflict && optionValue !== existingModelOptions[optionName]) {
      throw new Error(`Trying to set the option ${optionName}, but a value already exists.`);
    }
    existingModelOptions[optionName] = optionValue;
  }
  return existingModelOptions;
}
//# sourceMappingURL=model-definition.js.map
