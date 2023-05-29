import type { AttributeOptions } from '../../model.js';
import type { OptionalParameterizedPropertyDecorator, RequiredParameterizedPropertyDecorator } from './decorator-utils.js';
import { DECORATOR_NO_DEFAULT } from './decorator-utils.js';
/**
 * Creates a decorator that registers Attribute Options. Parameters are mandatory.
 *
 * @param decoratorName The name of the decorator (must be equal to its export key)
 * @param callback The callback that will return the Attribute Options.
 */
export declare function createRequiredAttributeOptionsDecorator<T>(decoratorName: string, callback: (option: T, target: Object, propertyName: string | symbol, propertyDescriptor: PropertyDescriptor | undefined) => Partial<AttributeOptions>): RequiredParameterizedPropertyDecorator<T>;
/**
 * Creates a decorator that registers Attribute Options. Parameters are optional.
 *
 * @param decoratorName The name of the decorator (must be equal to its export key)
 * @param defaultValue The default value, if no parameter was provided.
 * @param callback The callback that will return the Attribute Options.
 */
export declare function createOptionalAttributeOptionsDecorator<T>(decoratorName: string, defaultValue: T | typeof DECORATOR_NO_DEFAULT, callback: (option: T, target: Object, propertyName: string, propertyDescriptor: PropertyDescriptor | undefined) => Partial<AttributeOptions>): OptionalParameterizedPropertyDecorator<T>;
