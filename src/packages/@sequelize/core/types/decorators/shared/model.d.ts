import type { AttributeOptions, ModelOptions, ModelStatic } from '../../model.js';
import type { Sequelize } from '../../sequelize.js';
/**
 * Registers model options for future registering of the Model using Model.init
 * Subsequent calls for the same model & attributeName will be merged, with the newer call taking precedence.
 * 'sequelize' option is not accepted here. Pass it through `Model.init` when registering the model.
 *
 * @param model
 * @param options
 */
export declare function registerModelOptions(model: ModelStatic, options: ModelOptions): void;
/**
 * Registers attribute options for future registering of the Model using Model.init
 * Subsequent calls for the same model & attributeName will be merged, with the newer call taking precedence.
 *
 * @param model
 * @param attributeName
 * @param options
 */
export declare function registerModelAttributeOptions(model: ModelStatic, attributeName: string, options: Partial<AttributeOptions>): void;
export declare function initDecoratedModel(model: ModelStatic, sequelize: Sequelize): void;
export declare function isDecoratedModel(model: ModelStatic): boolean;
