import type { ColumnValidateOptions } from '../../model.js';
/**
 * Used to register a function that will be called when an attribute is being validated.
 *
 * @example
 * ```ts
 * class User extends Model {
 *   @Attribute(DataTypes.STRING)
 *   @ValidateAttribute({
 *     myCustomValidator: () => {
 *       // this function will run when this attribute is validated.
 *     },
 *   })
 *   declare name: string;
 * }
 * ```
 *
 * See also {@link ModelValidator}.
 */
export declare const ValidateAttribute: import("./decorator-utils.js").RequiredParameterizedPropertyDecorator<ColumnValidateOptions>;
/**
 * Used to register a model method that will be called when an instance is being validated.
 * Available as both an instance and static method (static method receives the model as a parameter).
 *
 * @example
 * ```ts
 * class User extends Model {
 *   @ValidateModel
 *   onValidate() {
 *     if (this.name !== VALID_NAME) {
 *       throw new Error(ERROR_MESSAGE);
 *     }
 *   }
 *
 *   @ValidateModel
 *   static onValidate(instance) {
 *     if (instance.name !== VALID_NAME) {
 *       throw new Error(ERROR_MESSAGE);
 *     }
 *   }
 * }
 * ```
 *
 * See also {@link ValidateAttribute}.
 */
export declare const ModelValidator: import("./decorator-utils.js").OptionalParameterizedPropertyDecorator<undefined>;
