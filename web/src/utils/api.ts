import { ResourceConfig } from '../../../typings/config';
import { getResourceName, isEnvBrowser } from './misc';
import defaultConfig from '../../../config.json';

export const getConfig = async (): Promise<ResourceConfig> => {
  if (isEnvBrowser()) {
    return defaultConfig;
  }

  try {
    const resourceName = getResourceName();
    const res = await fetch(`https://cfx-nui-${resourceName}/config.json`);
    if (!res.ok) {
      return defaultConfig;
    }

    return (await res.json()) as ResourceConfig;
  } catch {
    return defaultConfig;
  }
};
