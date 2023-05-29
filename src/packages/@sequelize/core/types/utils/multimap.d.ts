export declare class Multimap<K, V> {
    #private;
    clear(): void;
    append(key: K, value: V): this;
    delete(key: K, value: V): boolean;
    keys(): IterableIterator<K>;
    getAll(key: K): V[];
    count(key: K): number;
}
