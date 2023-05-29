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
var belongs_to_exports = {};
__export(belongs_to_exports, {
  BelongsTo: () => BelongsTo
});
module.exports = __toCommonJS(belongs_to_exports);
var import_node_assert = __toESM(require("node:assert"));
var import_isEqual = __toESM(require("lodash/isEqual"));
var import_isObject = __toESM(require("lodash/isObject.js"));
var import_upperFirst = __toESM(require("lodash/upperFirst"));
var import_data_types_utils = require("../dialects/abstract/data-types-utils.js");
var import_errors = require("../errors/index.js");
var import_model_definition = require("../model-definition.js");
var import_operators = require("../operators");
var import_format = require("../utils/format.js");
var import_model_utils = require("../utils/model-utils.js");
var import_object = require("../utils/object.js");
var import_string = require("../utils/string.js");
var import_base = require("./base");
var import_has_many = require("./has-many.js");
var import_has_one = require("./has-one.js");
var import_helpers = require("./helpers");
class BelongsTo extends import_base.Association {
  accessors;
  /**
   * The attribute name of the identifier
   *
   * @deprecated use {@link foreignKey} instead
   */
  get identifier() {
    return this.foreignKey;
  }
  foreignKey;
  /**
   * The column name of the foreign key
   */
  // TODO: rename to foreignKeyColumnName
  identifierField;
  /**
   * The name of the attribute the foreign key points to.
   * In belongsTo, this key is on the Target Model, instead of the Source Model  (unlike {@link HasOne.sourceKey}).
   * The {@link Association.foreignKey} is on the Source Model.
   */
  targetKey;
  /**
   * The column name of the target key
   */
  // TODO: rename to targetKeyColumnName
  targetKeyField;
  targetKeyIsPrimary;
  /**
   * @deprecated use {@link BelongsTo.targetKey}
   */
  get targetIdentifier() {
    return this.targetKey;
  }
  inverse;
  constructor(secret, source, target, options, parent) {
    var _a, _b, _c, _d;
    const targetKey = (options == null ? void 0 : options.targetKey) || target.primaryKeyAttribute;
    const targetAttributes = target.modelDefinition.attributes;
    if (!targetAttributes.has(targetKey)) {
      throw new Error(`Unknown attribute "${options.targetKey}" passed as targetKey, define this attribute on model "${target.name}" first`);
    }
    if ("keyType" in options) {
      throw new TypeError(`Option "keyType" has been removed from the BelongsTo's options. Set "foreignKey.type" instead.`);
    }
    super(secret, source, target, options, parent);
    this.targetKey = targetKey;
    if (target.sequelize.options.dialect === "db2" && targetAttributes.get(this.targetKey).primaryKey !== true) {
      this.target.modelDefinition.rawAttributes[this.targetKey].unique = true;
    }
    let foreignKey;
    let foreignKeyAttributeOptions;
    if ((0, import_isObject.default)((_a = this.options) == null ? void 0 : _a.foreignKey)) {
      (0, import_node_assert.default)(typeof ((_b = this.options) == null ? void 0 : _b.foreignKey) === "object");
      foreignKeyAttributeOptions = this.options.foreignKey;
      foreignKey = this.options.foreignKey.name || this.options.foreignKey.fieldName;
    } else if ((_c = this.options) == null ? void 0 : _c.foreignKey) {
      foreignKey = this.options.foreignKey;
    }
    if (!foreignKey) {
      foreignKey = this.inferForeignKey();
    }
    this.foreignKey = foreignKey;
    this.targetKeyField = (0, import_format.getColumnName)(targetAttributes.get(this.targetKey));
    this.targetKeyIsPrimary = this.targetKey === this.target.primaryKeyAttribute;
    const targetAttribute = targetAttributes.get(this.targetKey);
    const existingForeignKey = source.modelDefinition.rawAttributes[this.foreignKey];
    const newForeignKeyAttribute = (0, import_object.removeUndefined)({
      type: (0, import_data_types_utils.cloneDataType)(targetAttribute.type),
      ...foreignKeyAttributeOptions,
      allowNull: (existingForeignKey == null ? void 0 : existingForeignKey.allowNull) ?? (foreignKeyAttributeOptions == null ? void 0 : foreignKeyAttributeOptions.allowNull)
    });
    if (options.foreignKeyConstraints !== false) {
      const existingReference = (existingForeignKey == null ? void 0 : existingForeignKey.references) ? (0, import_model_definition.normalizeReference)(existingForeignKey.references) ?? existingForeignKey.references : void 0;
      const queryGenerator = this.source.sequelize.getQueryInterface().queryGenerator;
      const existingReferencedTable = (existingReference == null ? void 0 : existingReference.table) ? queryGenerator.extractTableDetails(existingReference.table) : void 0;
      const newReferencedTable = queryGenerator.extractTableDetails(this.target);
      const newReference = {};
      if (existingReferencedTable) {
        if (!(0, import_isEqual.default)(existingReferencedTable, newReferencedTable)) {
          throw new Error(`Foreign key ${this.foreignKey} on ${this.source.name} already references ${queryGenerator.quoteTable(existingReferencedTable)}, but this association needs to make it reference ${queryGenerator.quoteTable(newReferencedTable)} instead.`);
        }
      } else {
        newReference.table = newReferencedTable;
      }
      if ((existingReference == null ? void 0 : existingReference.key) && existingReference.key !== this.targetKeyField) {
        throw new Error(`Foreign key ${this.foreignKey} on ${this.source.name} already references column ${existingReference.key}, but this association needs to make it reference ${this.targetKeyField} instead.`);
      }
      newReference.key = this.targetKeyField;
      newForeignKeyAttribute.references = newReference;
      newForeignKeyAttribute.onDelete ?? (newForeignKeyAttribute.onDelete = newForeignKeyAttribute.allowNull !== false ? "SET NULL" : "CASCADE");
      newForeignKeyAttribute.onUpdate ?? (newForeignKeyAttribute.onUpdate = newForeignKeyAttribute.onUpdate ?? "CASCADE");
    }
    this.source.mergeAttributesDefault({
      [this.foreignKey]: newForeignKeyAttribute
    });
    this.identifierField = (0, import_format.getColumnName)(this.source.getAttributes()[this.foreignKey]);
    const singular = (0, import_upperFirst.default)(this.options.name.singular);
    this.accessors = {
      get: `get${singular}`,
      set: `set${singular}`,
      create: `create${singular}`
    };
    this.#mixin(source.prototype);
    if (options.inverse) {
      const passDown = (0, import_object.removeUndefined)({
        ...options,
        as: options.inverse.as,
        scope: (_d = options.inverse) == null ? void 0 : _d.scope,
        sourceKey: options.targetKey,
        inverse: void 0
      });
      delete passDown.targetKey;
      switch (options.inverse.type) {
        case "hasMany":
          import_has_many.HasMany.associate(secret, target, source, passDown, this);
          break;
        case "hasOne":
          import_has_one.HasOne.associate(secret, target, source, passDown, this);
          break;
        default:
          throw new Error(`Invalid option received for "inverse.type": ${options.inverse.type} is not recognised. Expected "hasMany" or "hasOne"`);
      }
    }
  }
  static associate(secret, source, target, options = {}, parent) {
    return (0, import_helpers.defineAssociation)(BelongsTo, source, target, options, parent, import_helpers.normalizeBaseAssociationOptions, (normalizedOptions) => {
      if ((0, import_model_utils.isSameInitialModel)(source, target) && options.inverse && (!options.as || !options.inverse.as || options.as === options.inverse.as)) {
        throw new import_errors.AssociationError(`Both options "as" and "inverse.as" must be defined for belongsTo self-associations, and their value must be different, if you specify the 'inverse' option.`);
      }
      return new BelongsTo(secret, source, target, normalizedOptions, parent);
    });
  }
  #mixin(modelPrototype) {
    (0, import_helpers.mixinMethods)(this, modelPrototype, ["get", "set", "create"]);
  }
  inferForeignKey() {
    const associationName = (0, import_string.singularize)(this.options.as);
    if (!associationName) {
      throw new Error("Sanity check: Could not guess the name of the association");
    }
    return (0, import_string.camelize)(`${associationName}_${this.targetKey}`);
  }
  async get(instances, options) {
    options = (0, import_object.cloneDeep)(options);
    let Target = this.target;
    if (options.scope != null) {
      if (!options.scope) {
        Target = Target.unscoped();
      } else if (options.scope !== true) {
        Target = Target.scope(options.scope);
      }
    }
    if (options.schema != null) {
      Target = Target.schema(options.schema, options.schemaDelimiter);
    }
    let isManyMode = true;
    if (!Array.isArray(instances)) {
      isManyMode = false;
      instances = [instances];
    }
    const where = /* @__PURE__ */ Object.create(null);
    if (instances.length > 1) {
      where[this.targetKey] = {
        [import_operators.Op.in]: instances.map((_instance) => _instance.get(this.foreignKey))
      };
    } else {
      const foreignKeyValue = instances[0].get(this.foreignKey);
      if (this.targetKeyIsPrimary && !options.where) {
        return Target.findByPk(
          foreignKeyValue,
          options
        );
      }
      where[this.targetKey] = foreignKeyValue;
      options.limit = null;
    }
    options.where = options.where ? { [import_operators.Op.and]: [where, options.where] } : where;
    if (isManyMode) {
      const results = await Target.findAll(options);
      const result = /* @__PURE__ */ new Map();
      for (const instance of results) {
        result.set(instance.get(this.targetKey, { raw: true }), instance);
      }
      return result;
    }
    return Target.findOne(options);
  }
  /**
   * Set the associated model.
   *
   * @param sourceInstance the source instance
   * @param associatedInstance An persisted instance or the primary key of an instance to associate with this. Pass `null` to remove the association.
   * @param options options passed to `this.save`
   */
  async set(sourceInstance, associatedInstance, options = {}) {
    let value = associatedInstance;
    if (associatedInstance != null && associatedInstance instanceof this.target) {
      value = associatedInstance[this.targetKey];
    }
    sourceInstance.set(this.foreignKey, value);
    if (options.save === false) {
      return;
    }
    await sourceInstance.save({
      fields: [this.foreignKey],
      association: true,
      ...options
    });
  }
  /**
   * Create a new instance of the associated model and associate it with this.
   *
   * @param sourceInstance the source instance
   * @param values values to create associated model instance with
   * @param options Options passed to `target.create` and setAssociation.
   *
   * @returns The created target model
   */
  async create(sourceInstance, values = {}, options = {}) {
    values = values || {};
    options = options || {};
    const newAssociatedObject = await this.target.create(values, options);
    await this.set(sourceInstance, newAssociatedObject, options);
    return newAssociatedObject;
  }
}
Object.defineProperty(BelongsTo, "name", {
  value: "BelongsTo"
});
//# sourceMappingURL=belongs-to.js.map
