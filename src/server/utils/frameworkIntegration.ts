/**
 * Framework bridge resolution (built-in qb/qbx/esx or configured external resource).
 * Lua side: src/server/lua/framework/ — docs: docs/framework-integration.md
 */
import {
  FrameworkIntegrationExports,
  FrameworkIntegrationFunction,
} from '@server/../../typings/exports';
import { mainLogger } from '@server/sv_logger';
import { getExports } from './misc';
import { config } from './server-config';
import { resourceName } from './constants';

const logger = mainLogger.child({ module: 'frameworkIntegration' });

export type FrameworkBridgeInfo = {
  active: boolean;
  kind?: 'external' | 'builtin' | 'none';
  framework?: 'qb' | 'qbx' | 'esx' | string | null;
  resource?: string | null;
  cardItem?: string;
};

const frameworkIntegrationKeys: FrameworkIntegrationFunction[] = [
  'addCash',
  'removeCash',
  'getCash',
  'getBank',
];

if (config?.frameworkIntegration?.isCardsEnabled) {
  frameworkIntegrationKeys.push('giveCard');
  frameworkIntegrationKeys.push('getCards');
}

const isAutoResource = (resource?: string) =>
  !resource || resource === 'auto' || resource === 'builtin' || resource === 'your-resource';

export const getFrameworkBridgeInfo = (): FrameworkBridgeInfo => {
  const fi = config?.frameworkIntegration;
  if (!fi?.enabled) {
    return { active: false, kind: 'none' };
  }

  try {
    const exps = getExports();
    const selfExports = exps[resourceName];
    if (selfExports?.getFrameworkBridge) {
      const info = selfExports.getFrameworkBridge() as FrameworkBridgeInfo;
      if (info) {
        return info;
      }
    }
  } catch (err) {
    logger.debug('getFrameworkBridge export unavailable');
    logger.debug(err);
  }

  // Explicit resource without Lua auto info
  if (!isAutoResource(fi.resource)) {
    return {
      active: true,
      kind: 'external',
      resource: fi.resource,
    };
  }

  return { active: false, kind: 'none' };
};

export const isFrameworkIntegrationActive = (): boolean => {
  const fi = config?.frameworkIntegration;
  if (!fi?.enabled) {
    return false;
  }

  if (fi.enabled === 'auto' || isAutoResource(fi.resource)) {
    return getFrameworkBridgeInfo().active === true;
  }

  return true;
};

export const validateResourceExports = (resourceExports: FrameworkIntegrationExports): boolean => {
  let isValid = true;
  frameworkIntegrationKeys.forEach((key: FrameworkIntegrationFunction) => {
    logger.silly(`Verifying export: ${key}`);
    if (typeof resourceExports[key] === 'undefined') {
      logger.error(`Framework integration export ${key} is missing.`);
      isValid = false;
      return;
    }

    if (typeof resourceExports[key] !== 'function') {
      logger.error(`Framework integration export ${key} is not a function.`);
      isValid = false;
    }
  });

  return isValid;
};

export const getFrameworkExports = (): FrameworkIntegrationExports => {
  const exps = getExports();
  const bridge = getFrameworkBridgeInfo();
  const configured = config?.frameworkIntegration?.resource;
  const resource =
    bridge.resource ||
    (!isAutoResource(configured) ? configured : undefined) ||
    resourceName;

  logger.debug(`Checking exports from resource: ${resource} (kind=${bridge.kind ?? 'unknown'})`);

  if (!resource) {
    logger.error(`Missing resourceName in the config for framework integration`);
    throw new Error('Framework integration failed');
  }

  const resourceExports = exps[resource];

  if (!resourceExports) {
    logger.error(
      `No resource found with name: ${resource}. Make sure you have the correct resource name in the config.`,
    );
    throw new Error('Framework integration failed');
  }

  // Built-in bridges use prefixed exports to avoid clashing with PEFCL's own public API.
  if (bridge.kind === 'builtin') {
    const wrap = (name: FrameworkIntegrationFunction) => {
      const exportName = `pefclBridge_${name}`;
      const fn = resourceExports[exportName];
      if (typeof fn !== 'function') {
        throw new Error(`No such export ${exportName} in resource ${resource}`);
      }
      return (...args: unknown[]) => fn(...args);
    };

    return {
      addCash: wrap('addCash') as FrameworkIntegrationExports['addCash'],
      removeCash: wrap('removeCash') as FrameworkIntegrationExports['removeCash'],
      getCash: wrap('getCash') as FrameworkIntegrationExports['getCash'],
      getBank: wrap('getBank') as FrameworkIntegrationExports['getBank'],
      giveCard: wrap('giveCard') as FrameworkIntegrationExports['giveCard'],
      getCards: wrap('getCards') as FrameworkIntegrationExports['getCards'],
    };
  }

  return resourceExports as unknown as FrameworkIntegrationExports;
};
