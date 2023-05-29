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
var belongs_to_many_exports = {};
__export(belongs_to_many_exports, {
  BelongsToMany: () => BelongsToMany
});
module.exports = __toCommonJS(belongs_to_many_exports);
var import_each = __toESM(require("lodash/each"));
var import_isEqual = __toESM(require("lodash/isEqual"));
var import_omit = __toESM(require("lodash/omit"));
var import_upperFirst = __toESM(require("lodash/upperFirst"));
var import_errors = require("../errors");
var import_operators = require("../operators");
var import_sequelize = require("../sequelize");
var import_model_utils = require("../utils/model-utils.js");
var import_object = require("../utils/object.js");
var import_string = require("../utils/string.js");
var import_base = require("./base");
var import_has_many = require("./has-many");
var import_has_one = require("./has-one");
var import_helpers = require("./helpers");
function addInclude(findOptions, include) {
  if (Array.isArray(findOptions.include)) {
    findOptions.include.push(include);
  } else if (!findOptions.include) {
    findOptions.include = [include];
  } else {
    findOptions.include = [findOptions.include, include];
  }
}
class BelongsToMany extends import_base.MultiAssociation {
  accessors;
  get foreignKey() {
    return this.fromSourceToThrough.foreignKey;
  }
  /**
   * The name of the Foreign Key attribute, located on the through table, that points to the Target model.
   *
   * Not to be confused with @link {BelongsToMany.foreignKey}, which points to the Source model instead.
   */
  get otherKey() {
    return this.pairedWith.foreignKey;
  }
  /**
   * @deprecated use {@link BelongsToMany#foreignKey}
   */
  get identifier() {
    return this.foreignKey;
  }
  /**
   * The corresponding column name of {@link BelongsToMany#foreignKey}
   */
  get identifierField() {
    return this.fromThroughToSource.identifierField;
  }
  /**
   * The corresponding column name of {@link BelongsToMany#otherKey}
   */
  get foreignIdentifierField() {
    return this.pairedWith.identifierField;
  }
  /**
   * The name of the Attribute that the {@link foreignKey} fk (located on the Through Model) will reference on the Source model.
   */
  get sourceKey() {
    return this.fromThroughToSource.targetKey;
  }
  /**
   * The name of the Column that the {@link foreignKey} fk (located on the Through Table) will reference on the Source model.
   */
  get sourceKeyField() {
    return this.fromThroughToSource.targetKeyField;
  }
  /**
   * The name of the Attribute that the {@link otherKey} fk (located on the Through Model) will reference on the Target model.
   */
  get targetKey() {
    return this.pairedWith.sourceKey;
  }
  /**
   * The name of the Column that the {@link otherKey} fk (located on the Through Table) will reference on the Target model.
   */
  get targetKeyField() {
    return this.pairedWith.sourceKeyField;
  }
  /**
   * The corresponding association this entity is paired with.
   */
  pairedWith;
  // intermediary associations
  // these create the actual associations on the model. Remove them would be a breaking change.
  fromSourceToThrough;
  fromSourceToThroughOne;
  get fromThroughToSource() {
    return this.fromSourceToThrough.inverse;
  }
  get fromTargetToThrough() {
    return this.pairedWith.fromSourceToThrough;
  }
  get fromTargetToThroughOne() {
    return this.pairedWith.fromSourceToThroughOne;
  }
  get fromThroughToTarget() {
    return this.pairedWith.fromThroughToSource;
  }
  get through() {
    return this.options.through;
  }
  get throughModel() {
    return this.through.model;
  }
  constructor(secret, source, target, options, pair, parent) {
    var _a, _b, _c;
    super(secret, source, target, options, parent);
    try {
      this.pairedWith = pair ?? BelongsToMany.associate(
        secret,
        target,
        source,
        (0, import_object.removeUndefined)({
          ...options,
          // note: we can't just use '...options.inverse' because we need to set to underfined if the option wasn't set
          as: (_a = options.inverse) == null ? void 0 : _a.as,
          scope: (_b = options.inverse) == null ? void 0 : _b.scope,
          foreignKeyConstraints: (_c = options.inverse) == null ? void 0 : _c.foreignKeyConstraints,
          inverse: (0, import_object.removeUndefined)({
            as: options.as,
            scope: options.scope,
            foreignKeyConstraints: options.foreignKeyConstraints
          }),
          sourceKey: options.targetKey,
          targetKey: options.sourceKey,
          foreignKey: options.otherKey,
          otherKey: options.foreignKey,
          through: (0, import_object.removeUndefined)({
            ...options.through,
            scope: void 0
          })
        }),
        this,
        this
      );
    } catch (error) {
      throw new import_errors.AssociationError(`BelongsToMany associations automatically create the corresponding association on the target model,
    but this association failed to create its paired association (BelongsToMany from ${target.name} to ${source.name}).

    This may happen if you try to define the same BelongsToMany association on both sides of the association.
    If that is the case, instead of doing this:
    A.belongsToMany(B, { as: 'b', through: 'AB' });
    B.belongsToMany(A, { as: 'a', through: 'AB' });

    Do this:
    A.belongsToMany(B, { as: 'b', through: 'AB', inverse: { as: 'a' } });
          `, { cause: error });
    }
    this.pairedWith.pairedWith = this;
    const sourceKey = (options == null ? void 0 : options.sourceKey) || source.primaryKeyAttribute;
    this.fromSourceToThrough = import_has_many.HasMany.associate(import_helpers.AssociationSecret, this.source, this.throughModel, (0, import_object.removeUndefined)({
      as: `${this.name.plural}${(0, import_upperFirst.default)(this.pairedWith.name.plural)}`,
      scope: this.through.scope,
      foreignKey: {
        ...this.options.foreignKey,
        allowNull: this.options.foreignKey.allowNull ?? false,
        name: this.options.foreignKey.name || (this.isSelfAssociation ? (0, import_string.camelize)(`${this.pairedWith.name.singular}_${sourceKey}`) : (0, import_string.camelize)(`${this.source.options.name.singular}_${sourceKey}`))
      },
      sourceKey: this.options.sourceKey,
      foreignKeyConstraints: this.options.foreignKeyConstraints,
      hooks: this.options.hooks,
      inverse: {
        as: this.pairedWith.name.singular
      }
    }), this);
    this.fromSourceToThroughOne = import_has_one.HasOne.associate(import_helpers.AssociationSecret, this.source, this.throughModel, (0, import_object.removeUndefined)({
      as: `${this.name.singular}${(0, import_upperFirst.default)(this.pairedWith.name.singular)}`,
      scope: this.through.scope,
      // foreignKey: this.options.foreignKey,
      foreignKey: {
        ...this.options.foreignKey,
        allowNull: this.options.foreignKey.allowNull ?? false,
        name: this.options.foreignKey.name || (this.isSelfAssociation ? (0, import_string.camelize)(`${this.pairedWith.name.singular}_${sourceKey}`) : (0, import_string.camelize)(`${this.source.options.name.singular}_${sourceKey}`))
      },
      sourceKey: this.options.sourceKey,
      foreignKeyConstraints: this.options.foreignKeyConstraints,
      hooks: this.options.hooks,
      inverse: {
        as: this.pairedWith.name.singular
      }
    }), this);
    const plural = (0, import_upperFirst.default)(this.options.name.plural);
    const singular = (0, import_upperFirst.default)(this.options.name.singular);
    this.accessors = {
      get: `get${plural}`,
      set: `set${plural}`,
      addMultiple: `add${plural}`,
      add: `add${singular}`,
      create: `create${singular}`,
      remove: `remove${singular}`,
      removeMultiple: `remove${plural}`,
      hasSingle: `has${singular}`,
      hasAll: `has${plural}`,
      count: `count${plural}`
    };
    this.#mixin(source.prototype);
    if (pair == null) {
      this.#makeFkPairUnique();
    }
  }
  #makeFkPairUnique() {
    let hasPrimaryKey = false;
    const throughModelDefinition = this.throughModel.modelDefinition;
    const { rawAttributes: throughRawAttributes } = throughModelDefinition;
    (0, import_each.default)(throughRawAttributes, (attribute, attributeName) => {
      if (!attribute.primaryKey) {
        return;
      }
      if ([this.foreignKey, this.otherKey].includes(attributeName)) {
        return;
      }
      if (attribute._autoGenerated) {
        delete throughRawAttributes[attributeName];
        return;
      }
      hasPrimaryKey = true;
    });
    if (!hasPrimaryKey) {
      if (typeof this.through.unique === "string") {
        throw new TypeError(`BelongsToMany: Option "through.unique" can only be used if the through model's foreign keys are not also the primary keys.
Add your own primary key to the through model, on different attributes than the foreign keys, to be able to use this option.`);
      }
      throughRawAttributes[this.foreignKey].primaryKey = true;
      throughRawAttributes[this.otherKey].primaryKey = true;
    } else if (this.through.unique !== false) {
      let uniqueKey;
      if (typeof this.through.unique === "string" && this.through.unique !== "") {
        uniqueKey = this.through.unique;
      } else {
        const keys = [this.foreignKey, this.otherKey].sort();
        uniqueKey = [this.through.model.table.tableName, ...keys, "unique"].join("_");
      }
      throughRawAttributes[this.foreignKey].unique = [{ name: uniqueKey }];
      throughRawAttributes[this.otherKey].unique = [{ name: uniqueKey }];
    }
    throughModelDefinition.refreshAttributes();
  }
  static associate(secret, source, target, options, pair, parent) {
    return (0, import_helpers.defineAssociation)(BelongsToMany, source, target, options, parent, normalizeOptions, (newOptions) => {
      var _a;
      if ((0, import_model_utils.isSameInitialModel)(source, target) && (!options.as || !((_a = options.inverse) == null ? void 0 : _a.as) || options.as === options.inverse.as)) {
        throw new import_errors.AssociationError('Both options "as" and "inverse.as" must be defined for belongsToMany self-associations, and their value must be different.');
      }
      return new BelongsToMany(secret, source, target, newOptions, pair, parent);
    });
  }
  #mixin(modelPrototype) {
    (0, import_helpers.mixinMethods)(
      this,
      modelPrototype,
      ["get", "count", "hasSingle", "hasAll", "set", "add", "addMultiple", "remove", "removeMultiple", "create"],
      {
        hasSingle: "has",
        hasAll: "has",
        addMultiple: "add",
        removeMultiple: "remove"
      }
    );
  }
  /**
   * Get everything currently associated with this, using an optional where clause.
   *
   * See {@link Model} for a full explanation of options
   *
   * @param instance instance
   * @param options find options
   */
  async get(instance, options) {
    var _a, _b;
    const through = this.through;
    const findOptions = {
      ...options,
      // @ts-expect-error -- TODO: current WhereOptions typings do not allow having 'WhereOptions' inside another 'WhereOptions'
      where: {
        [import_operators.Op.and]: [
          options == null ? void 0 : options.where,
          this.scope
        ]
      }
    };
    let throughWhere = {
      [this.foreignKey]: instance.get(this.sourceKey)
    };
    if (through.scope) {
      Object.assign(throughWhere, through.scope);
    }
    if ((_a = options == null ? void 0 : options.through) == null ? void 0 : _a.where) {
      throughWhere = {
        [import_operators.Op.and]: [throughWhere, options.through.where]
      };
    }
    addInclude(findOptions, (0, import_object.removeUndefined)({
      association: this.fromTargetToThroughOne,
      attributes: options == null ? void 0 : options.joinTableAttributes,
      required: true,
      paranoid: ((_b = options == null ? void 0 : options.through) == null ? void 0 : _b.paranoid) ?? true,
      where: throughWhere
    }));
    let model = this.target;
    if ((options == null ? void 0 : options.scope) != null) {
      if (!options.scope) {
        model = model.unscoped();
      } else if (options.scope !== true) {
        model = model.scope(options.scope);
      }
    }
    if (options == null ? void 0 : options.schema) {
      model = model.schema(options.schema, options.schemaDelimiter);
    }
    return model.findAll(findOptions);
  }
  /**
   * Count everything currently associated with this, using an optional where clause.
   *
   * @param instance instance
   * @param options find options
   */
  async count(instance, options) {
    const getOptions = {
      ...options,
      attributes: [
        [(0, import_sequelize.fn)("COUNT", (0, import_sequelize.col)([this.target.name, this.targetKeyField].join("."))), "count"]
      ],
      joinTableAttributes: [],
      raw: true,
      plain: true
    };
    const result = await this.get(instance, getOptions);
    return Number.parseInt(result.count, 10);
  }
  /**
   * Check if one or more instance(s) are associated with this. If a list of instances is passed, the function returns true if _all_ instances are associated
   *
   * @param sourceInstance source instance to check for an association with
   * @param targetInstancesOrPks Can be an array of instances or their primary keys
   * @param options Options passed to getAssociations
   */
  async has(sourceInstance, targetInstancesOrPks, options) {
    if (!Array.isArray(targetInstancesOrPks)) {
      targetInstancesOrPks = [targetInstancesOrPks];
    }
    const targetPrimaryKeys = targetInstancesOrPks.map((instance) => {
      if (instance instanceof this.target) {
        return instance.get(this.targetKey);
      }
      return instance;
    });
    const associatedObjects = await this.get(sourceInstance, {
      ...options,
      raw: true,
      scope: false,
      attributes: [this.targetKey],
      joinTableAttributes: [],
      // @ts-expect-error -- TODO: current WhereOptions typings do not allow having 'WhereOptions' inside another 'WhereOptions'
      where: {
        [import_operators.Op.and]: [
          { [this.targetKey]: { [import_operators.Op.in]: targetPrimaryKeys } },
          options == null ? void 0 : options.where
        ]
      }
    });
    return targetPrimaryKeys.every((pk) => {
      return associatedObjects.some((instance) => {
        return (0, import_isEqual.default)(instance[this.targetKey], pk);
      });
    });
  }
  /**
   * Set the associated models by passing an array of instances or their primary keys.
   * Everything that it not in the passed array will be un-associated.
   *
   * @param sourceInstance source instance to associate new instances with
   * @param newInstancesOrPrimaryKeys A single instance or primary key, or a mixed array of persisted instances or primary keys
   * @param options Options passed to `through.findAll`, `bulkCreate`, `update` and `destroy`
   */
  async set(sourceInstance, newInstancesOrPrimaryKeys, options = {}) {
    const sourceKey = this.sourceKey;
    const targetKey = this.targetKey;
    const foreignKey = this.foreignKey;
    const otherKey = this.otherKey;
    const newInstances = newInstancesOrPrimaryKeys === null ? [] : this.toInstanceArray(newInstancesOrPrimaryKeys);
    const where = {
      [foreignKey]: sourceInstance.get(sourceKey),
      ...this.through.scope
    };
    const currentThroughRows = await this.through.model.findAll({
      ...options,
      where,
      raw: true,
      // force this option to be false, in case the user enabled
      rejectOnEmpty: false,
      include: this.scope ? [{
        association: this.fromThroughToTarget,
        where: this.scope,
        required: true
      }] : []
    });
    const obsoleteTargets = [];
    for (const currentRow of currentThroughRows) {
      const newTarget = newInstances.find((obj) => {
        return currentRow[otherKey] === obj.get(targetKey);
      });
      if (!newTarget) {
        obsoleteTargets.push(currentRow[this.otherKey]);
      }
    }
    const promises = [];
    if (obsoleteTargets.length > 0) {
      promises.push(this.remove(sourceInstance, obsoleteTargets, options));
    }
    if (newInstances.length > 0) {
      promises.push(this.#updateAssociations(sourceInstance, currentThroughRows, newInstances, options));
    }
    await Promise.all(promises);
  }
  /**
   * Associate one or several rows with source instance. It will not un-associate any already associated instance
   * that may be missing from `newInstances`.
   *
   * @param sourceInstance source instance to associate new instances with
   * @param newInstancesOrPrimaryKeys A single instance or primary key, or a mixed array of persisted instances or primary keys
   * @param options Options passed to `through.findAll`, `bulkCreate` and `update`
   */
  async add(sourceInstance, newInstancesOrPrimaryKeys, options) {
    var _a;
    if (!newInstancesOrPrimaryKeys) {
      return;
    }
    const newInstances = this.toInstanceArray(newInstancesOrPrimaryKeys);
    let currentRows = [];
    if (((_a = this.through) == null ? void 0 : _a.unique) ?? true) {
      currentRows = await this.through.model.findAll({
        ...options,
        raw: true,
        where: {
          [this.foreignKey]: sourceInstance.get(this.sourceKey),
          [this.otherKey]: newInstances.map((newInstance) => newInstance.get(this.targetKey)),
          ...this.through.scope
        },
        // force this option to be false, in case the user enabled
        rejectOnEmpty: false
      });
    }
    await this.#updateAssociations(sourceInstance, currentRows, newInstances, options);
  }
  /**
   * Adds new target instances that were not already present in the through table.
   * Updates the through table row of the instances that already were present.
   *
   * @param sourceInstance
   * @param currentThroughRows
   * @param newTargets
   * @param options
   * @private
   */
  async #updateAssociations(sourceInstance, currentThroughRows, newTargets, options) {
    const sourceKey = this.sourceKey;
    const targetKey = this.targetKey;
    const foreignKey = this.foreignKey;
    const otherKey = this.otherKey;
    const defaultAttributes = (options == null ? void 0 : options.through) || {};
    const promises = [];
    const unassociatedTargets = [];
    const changedTargets = [];
    for (const newInstance of newTargets) {
      const existingThroughRow = currentThroughRows.find((throughRow) => {
        return throughRow[otherKey] === newInstance.get(targetKey);
      });
      if (!existingThroughRow) {
        unassociatedTargets.push(newInstance);
        continue;
      }
      const throughAttributes = newInstance[this.through.model.name];
      const attributes = { ...defaultAttributes, ...throughAttributes };
      if (Object.keys(attributes).some((attribute) => {
        return attributes[attribute] !== existingThroughRow[attribute];
      })) {
        changedTargets.push(newInstance);
      }
    }
    if (unassociatedTargets.length > 0) {
      const bulk = unassociatedTargets.map((unassociatedTarget) => {
        const throughAttributes = unassociatedTarget[this.through.model.name];
        const attributes = { ...defaultAttributes, ...throughAttributes };
        attributes[foreignKey] = sourceInstance.get(sourceKey);
        attributes[otherKey] = unassociatedTarget.get(targetKey);
        Object.assign(attributes, this.through.scope);
        return attributes;
      });
      promises.push(this.through.model.bulkCreate(bulk, { validate: true, ...options }));
    }
    for (const changedTarget of changedTargets) {
      let throughAttributes = changedTarget[this.through.model.name];
      const attributes = { ...defaultAttributes, ...throughAttributes };
      if (throughAttributes instanceof this.through.model) {
        throughAttributes = {};
      }
      promises.push(this.through.model.update(attributes, {
        ...options,
        where: {
          [foreignKey]: sourceInstance.get(sourceKey),
          [otherKey]: changedTarget.get(targetKey)
        }
      }));
    }
    await Promise.all(promises);
  }
  /**
   * Un-associate one or more instance(s).
   *
   * @param sourceInstance instance to un associate instances with
   * @param targetInstanceOrPks Can be an Instance or its primary key, or a mixed array of instances and primary keys
   * @param options Options passed to `through.destroy`
   */
  async remove(sourceInstance, targetInstanceOrPks, options) {
    const targetInstance = this.toInstanceArray(targetInstanceOrPks);
    const where = {
      [this.foreignKey]: sourceInstance.get(this.sourceKey),
      [this.otherKey]: targetInstance.map((newInstance) => newInstance.get(this.targetKey)),
      ...this.through.scope
    };
    await this.through.model.destroy({ ...options, where });
  }
  /**
   * Create a new instance of the associated model and associate it with this.
   *
   * @param sourceInstance source instance
   * @param values values for target model
   * @param options Options passed to create and add
   */
  async create(sourceInstance, values = {}, options = {}) {
    if (Array.isArray(options)) {
      options = {
        fields: options
      };
    }
    if (this.scope) {
      Object.assign(values, this.scope);
      if (options.fields) {
        options.fields = [...options.fields, ...Object.keys(this.scope)];
      }
    }
    const newAssociatedObject = await this.target.create(values, options);
    await this.add(sourceInstance, newAssociatedObject, (0, import_omit.default)(options, ["fields"]));
    return newAssociatedObject;
  }
}
Object.defineProperty(BelongsToMany, "name", {
  value: "BelongsToMany"
});
function normalizeThroughOptions(source, target, through, sequelize) {
  var _a;
  const timestamps = through.timestamps ?? ((_a = sequelize.options.define) == null ? void 0 : _a.timestamps);
  let model;
  if (!through || typeof through.model !== "string" && typeof through.model !== "function") {
    throw new import_errors.AssociationError(`${source.name}.belongsToMany(${target.name}) requires a through model, set the "through", or "through.model" options to either a string or a model`);
  }
  if ((0, import_model_utils.isModelStatic)(through.model)) {
    model = through.model;
  } else if (typeof through.model === "function") {
    model = through.model(sequelize);
  } else if (sequelize.isDefined(through.model)) {
    model = sequelize.model(through.model);
  } else {
    const sourceTable = source.table;
    model = sequelize.define(through.model, {}, (0, import_object.removeUndefined)({
      tableName: through.model,
      indexes: [],
      // we don't want indexes here (as referenced in #2416)
      paranoid: through.paranoid || false,
      // Default to non-paranoid join (referenced in #11991)
      validate: {},
      // Don't propagate model-level validations
      timestamps: through.timestamps,
      schema: sourceTable.schema,
      schemaDelimiter: sourceTable.delimiter
    }));
  }
  return (0, import_object.removeUndefined)({
    ...through,
    timestamps,
    model
  });
}
function normalizeOptions(type, options, source, target) {
  if ("timestamps" in options) {
    throw new TypeError('The "timestamps" option in belongsToMany has been renamed to through.timestamps');
  }
  if ("uniqueKey" in options) {
    throw new TypeError('The "uniqueKey" option in belongsToMany has been renamed to through.unique');
  }
  const sequelize = target.sequelize;
  return (0, import_helpers.normalizeBaseAssociationOptions)(type, {
    ...options,
    otherKey: (0, import_helpers.normalizeForeignKeyOptions)(options.otherKey),
    through: (0, import_object.removeUndefined)((0, import_helpers.isThroughOptions)(options.through) ? normalizeThroughOptions(source, target, options.through, sequelize) : normalizeThroughOptions(source, target, { model: options.through }, sequelize))
  }, source, target);
}
//# sourceMappingURL=belongs-to-many.js.map
