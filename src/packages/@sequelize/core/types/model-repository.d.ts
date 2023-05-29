import type { ModelDefinition } from './model-definition.js';
import type { ModelTypeScript } from './model-typescript.js';
import type { Sequelize } from './sequelize.js';
/**
 * The goal of this class is to become the new home of all the static methods that are currently present on the Model class,
 * as a way to enable a true Repository Mode for Sequelize.
 *
 * Currently this class is not usable as a repository (due to having a dependency on ModelStatic), but as we migrate all of
 * Model to this class, we will be able to remove the dependency on ModelStatic, and make this class usable as a repository.
 *
 * See https://github.com/sequelize/sequelize/issues/15389 for more details.
 *
 * Unlike {@link ModelDefinition}, it's possible to have multiple different repositories for the same model (as users can provide their own implementation).
 */
declare class ModelRepository {
    #private;
    constructor(modelDefinition: ModelDefinition, sequelize: Sequelize);
}
export declare function getModelRepository(model: typeof ModelTypeScript): ModelRepository;
export {};
