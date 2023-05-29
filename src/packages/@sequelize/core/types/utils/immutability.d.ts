/// <reference types="node" />
import NodeUtil from 'node:util';
import type { InspectOptions } from 'node:util';
export declare class SetView<V> {
    #private;
    constructor(target: Set<V>);
    /**
     * @param value
     * @returns a boolean indicating whether an element with the specified value exists in the Set or not.
     */
    has(value: V): boolean;
    /**
     * @returns the number of (unique) elements in Set.
     */
    get size(): number;
    [Symbol.iterator](): IterableIterator<V>;
    values(): IterableIterator<V>;
    toJSON(): V[];
    [NodeUtil.inspect.custom](depth: number, options: InspectOptions): string;
}
export declare class MapView<K, V> {
    #private;
    constructor(target: Map<K, V>);
    /**
     * Returns a specified element from the Map object. If the value that is associated to the provided key is an object, then you will get a reference to that object and any change made to that object will effectively modify it inside the Map.
     *
     * @param key
     * @returns Returns the element associated with the specified key. If no element is associated with the specified key, undefined is returned.
     */
    get(key: K): V | undefined;
    /**
     * @param key
     * @returns boolean indicating whether an element with the specified key exists or not.
     */
    has(key: K): boolean;
    /**
     * @returns the number of elements in the Map.
     */
    get size(): number;
    [Symbol.iterator](): IterableIterator<[K, V]>;
    entries(): IterableIterator<[K, V]>;
    keys(): IterableIterator<K>;
    values(): IterableIterator<V>;
    toJSON(): [K, V][];
    [NodeUtil.inspect.custom](depth: number, options: InspectOptions): string;
}
