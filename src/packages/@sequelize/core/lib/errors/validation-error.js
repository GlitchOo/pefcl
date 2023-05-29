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
var validation_error_exports = {};
__export(validation_error_exports, {
  ValidationError: () => ValidationError,
  ValidationErrorItem: () => ValidationErrorItem,
  ValidationErrorItemOrigin: () => ValidationErrorItemOrigin,
  ValidationErrorItemType: () => ValidationErrorItemType
});
module.exports = __toCommonJS(validation_error_exports);
var import_base_error = require("./base-error");
var ValidationErrorItemType = /* @__PURE__ */ ((ValidationErrorItemType2) => {
  ValidationErrorItemType2["notNull violation"] = "CORE";
  ValidationErrorItemType2["unique violation"] = "DB";
  ValidationErrorItemType2["Validation error"] = "FUNCTION";
  return ValidationErrorItemType2;
})(ValidationErrorItemType || {});
var ValidationErrorItemOrigin = /* @__PURE__ */ ((ValidationErrorItemOrigin2) => {
  ValidationErrorItemOrigin2["CORE"] = "CORE";
  ValidationErrorItemOrigin2["DB"] = "DB";
  ValidationErrorItemOrigin2["FUNCTION"] = "FUNCTION";
  ValidationErrorItemOrigin2["DATATYPE"] = "DATATYPE";
  return ValidationErrorItemOrigin2;
})(ValidationErrorItemOrigin || {});
class ValidationErrorItem extends Error {
  /**
   * @deprecated Will be removed in v7
   */
  static TypeStringMap = ValidationErrorItemType;
  /**
   * @deprecated Will be removed in v7
   */
  static Origins = ValidationErrorItemOrigin;
  /**
   * The type/origin of the validation error
   */
  type;
  /**
   * The field that triggered the validation error
   */
  path;
  /**
   * The value that generated the error
   */
  value;
  origin;
  /**
   * The DAO instance that caused the validation error
   */
  instance;
  /**
   * A validation "key", used for identification
   */
  validatorKey;
  /**
   * Property name of the BUILT-IN validator function that caused the validation error (e.g. "in" or "len"), if applicable
   */
  validatorName;
  /**
   * Parameters used with the BUILT-IN validator function, if applicable
   */
  validatorArgs;
  static throwDataTypeValidationError(message) {
    throw new ValidationErrorItem(message, "Validation error", "DATATYPE" /* DATATYPE */);
  }
  /**
   * Creates a new ValidationError item. Instances of this class are included in the `ValidationError.errors` property.
   *
   * @param message An error message
   * @param type The type/origin of the validation error
   * @param path The field that triggered the validation error
   * @param value The value that generated the error
   * @param instance the DAO instance that caused the validation error
   * @param validatorKey a validation "key", used for identification
   * @param fnName property name of the BUILT-IN validator function that caused the validation error (e.g. "in" or "len"), if applicable
   * @param fnArgs parameters used with the BUILT-IN validator function, if applicable
   */
  constructor(message, type, path, value, instance, validatorKey, fnName, fnArgs) {
    super(message);
    this.type = null;
    this.path = path || null;
    this.value = value ?? null;
    this.origin = null;
    this.instance = instance || null;
    this.validatorKey = validatorKey || null;
    this.validatorName = fnName || null;
    this.validatorArgs = fnArgs || [];
    if (type) {
      if (this.isValidationErrorItemOrigin(type)) {
        this.origin = type;
      } else {
        const realType = ValidationErrorItemType[type];
        if (realType && ValidationErrorItemOrigin[realType]) {
          this.origin = realType;
          this.type = type;
        }
      }
    }
  }
  isValidationErrorItemOrigin(origin) {
    return ValidationErrorItemOrigin[origin] !== void 0;
  }
  /**
   * return a lowercase, trimmed string "key" that identifies the validator.
   *
   * Note: the string will be empty if the instance has neither a valid `validatorKey` property nor a valid `validatorName` property
   *
   * @param useTypeAsNS controls whether the returned value is "namespace",
   *                    this parameter is ignored if the validator's `type` is not one of ValidationErrorItem.Origins
   * @param NSSeparator a separator string for concatenating the namespace, must be not be empty,
   *                    defaults to "." (fullstop). only used and validated if useTypeAsNS is TRUE.
   * @throws {Error}    thrown if NSSeparator is found to be invalid.
   */
  getValidatorKey(useTypeAsNS, NSSeparator) {
    const useTANS = useTypeAsNS === void 0 || Boolean(useTypeAsNS);
    const NSSep = NSSeparator === void 0 ? "." : NSSeparator;
    const type = this.origin;
    const key = this.validatorKey || this.validatorName;
    const useNS = useTANS && type && ValidationErrorItemOrigin[type];
    if (useNS && (typeof NSSep !== "string" || NSSep.length === 0)) {
      throw new Error("Invalid namespace separator given, must be a non-empty string");
    }
    if (!(typeof key === "string" && key.length > 0)) {
      return "";
    }
    return (useNS ? [this.origin, key].join(NSSep) : key).toLowerCase().trim();
  }
}
class ValidationError extends import_base_error.BaseError {
  /** Array of ValidationErrorItem objects describing the validation errors */
  errors;
  constructor(message, errors = [], options = {}) {
    super(message, options);
    this.name = "SequelizeValidationError";
    this.errors = errors;
    if (message) {
      this.message = message;
    } else if (this.errors.length > 0 && this.errors[0].message) {
      this.message = this.errors.map(
        (err) => `${err.type || err.origin}: ${err.message}`
      ).join(",\n");
    }
  }
  /**
   * Gets all validation error items for the path / field specified.
   *
   * @param path The path to be checked for error items
   *
   * @returns Validation error items for the specified path
   */
  get(path) {
    const out = [];
    for (const error of this.errors) {
      if (error.path === path) {
        out.push(error);
      }
    }
    return out;
  }
}
//# sourceMappingURL=validation-error.js.map
