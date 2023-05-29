import type { ModelStatic } from './model.js';
type ModelMatch = (path: string, exportName: string, exportValue: ModelStatic) => boolean;
/**
 * Imports all model classes exported in the file matching the specified globs.
 * Useful when setting the {@link Options.models} option in the Sequelize constructor.
 *
 * @param globPaths
 * @param modelMatch
 */
export declare function importModels(globPaths: string | string[], modelMatch?: ModelMatch): Promise<ModelStatic[]>;
export {};
