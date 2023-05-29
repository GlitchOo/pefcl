export type PropertyOrGetterDescriptor = (target: Object, propertyName: string | symbol, propertyDescriptor?: PropertyDescriptor) => void;
export interface OptionalParameterizedPropertyDecorator<T> {
    (): PropertyOrGetterDescriptor;
    (options: T): PropertyOrGetterDescriptor;
    (target: Object, propertyName: string | symbol, propertyDescriptor?: PropertyDescriptor): void;
}
export interface RequiredParameterizedPropertyDecorator<T> {
    (options: T): PropertyOrGetterDescriptor;
}
export declare const DECORATOR_NO_DEFAULT: unique symbol;
/**
 * Creates a decorator that MUST receive a parameter
 *
 * @param name
 * @param callback The callback that will be executed once the decorator is applied.
 */
export declare function createParameterizedPropertyDecorator<T>(name: string, callback: (option: T, target: Object, propertyName: string | symbol, propertyDescriptor: PropertyDescriptor | undefined) => void): RequiredParameterizedPropertyDecorator<T>;
/**
 * Creates a decorator that can optionally receive a parameter
 *
 * @param name
 * @param defaultValue The value to use if no parameter is provided.
 * @param callback The callback that will be executed once the decorator is applied.
 */
export declare function createOptionallyParameterizedPropertyDecorator<T>(name: string, defaultValue: T | typeof DECORATOR_NO_DEFAULT, callback: (option: T, target: Object, propertyName: string | symbol, propertyDescriptor: PropertyDescriptor | undefined) => void): OptionalParameterizedPropertyDecorator<T>;
export declare function throwMustBeStaticProperty(decoratorName: string, target: Object, propertyName: string | symbol): never;
export declare function throwMustBeModel(decoratorName: string, target: Object, propertyName: string | symbol): never;
export declare function throwMustBeInstanceProperty(decoratorName: string, target: Object, propertyName: string | symbol): never;
export declare function throwMustBeMethod(decoratorName: string, target: Object, propertyName: string | symbol): never;
export declare function getPropertyName(obj: object, property: string | symbol): string;
export declare function getClassName(obj: object): string;
