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
var attribute_exports = {};
__export(attribute_exports, {
  AllowNull: () => AllowNull,
  Attribute: () => Attribute,
  AutoIncrement: () => AutoIncrement,
  Column: () => Column,
  ColumnName: () => ColumnName,
  Comment: () => Comment,
  Default: () => Default,
  Index: () => Index,
  NotNull: () => NotNull,
  PrimaryKey: () => PrimaryKey,
  Unique: () => Unique,
  createIndexDecorator: () => createIndexDecorator
});
module.exports = __toCommonJS(attribute_exports);
var import_data_types_utils = require("../../dialects/abstract/data-types-utils.js");
var import_deprecations = require("../../utils/deprecations.js");
var import_string = require("../../utils/string.js");
var import_attribute_utils = require("./attribute-utils.js");
const Attribute = (0, import_attribute_utils.createRequiredAttributeOptionsDecorator)("Attribute", (attrOptionOrDataType) => {
  if ((0, import_data_types_utils.isDataType)(attrOptionOrDataType)) {
    return {
      type: attrOptionOrDataType
    };
  }
  return attrOptionOrDataType;
});
function Column(optionsOrDataType) {
  (0, import_deprecations.columnToAttribute)();
  return Attribute(optionsOrDataType);
}
const Unique = (0, import_attribute_utils.createOptionalAttributeOptionsDecorator)("Unique", true, (unique) => ({ unique }));
const AllowNull = (0, import_attribute_utils.createOptionalAttributeOptionsDecorator)("AllowNull", true, (allowNull) => ({ allowNull }));
const NotNull = (0, import_attribute_utils.createOptionalAttributeOptionsDecorator)("NotNull", true, (notNull) => ({ allowNull: !notNull }));
const PrimaryKey = (0, import_attribute_utils.createOptionalAttributeOptionsDecorator)("PrimaryKey", true, (primaryKey) => ({ primaryKey }));
const AutoIncrement = (0, import_attribute_utils.createOptionalAttributeOptionsDecorator)("AutoIncrement", true, (autoIncrement) => ({ autoIncrement }));
const Comment = (0, import_attribute_utils.createRequiredAttributeOptionsDecorator)("Comment", (comment) => ({ comment }));
const Default = (0, import_attribute_utils.createRequiredAttributeOptionsDecorator)("Default", (defaultValue) => ({ defaultValue }));
const ColumnName = (0, import_attribute_utils.createRequiredAttributeOptionsDecorator)("ColumnName", (columnName) => ({ columnName }));
function createIndexDecorator(decoratorName, options = {}) {
  return (0, import_attribute_utils.createOptionalAttributeOptionsDecorator)(
    decoratorName,
    {},
    (indexField) => {
      const index = {
        ...options,
        // TODO: default index name should be generated using https://github.com/sequelize/sequelize/issues/15312
        name: options.name || (0, import_string.underscore)(decoratorName),
        attribute: indexField
      };
      return { index };
    }
  );
}
const Index = (0, import_attribute_utils.createOptionalAttributeOptionsDecorator)(
  "Index",
  {},
  (indexField) => {
    return {
      index: indexField
    };
  }
);
//# sourceMappingURL=attribute.js.map
