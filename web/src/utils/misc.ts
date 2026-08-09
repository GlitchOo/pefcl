import { LBSettings } from '@typings/LBAddons';

declare global {
  interface Window {
    invokeNative(): void;
    GetParentResourceName?: () => string;
    /** Injected by LB Phone / LB Tablet for custom apps */
    resourceName?: string;
    GetSettings?: () => Promise<LBSettings>;
  }
}

const LB_HOST_RESOURCES = new Set(['lb-phone', 'lb-tablet']);

const resourceFromCfxHost = (): string | null => {
  const host = window.location?.hostname || '';
  if (host.startsWith('cfx-nui-')) {
    return host.slice('cfx-nui-'.length) || null;
  }
  return null;
};

// and not CEF
export const isEnvBrowser = (): boolean => !window.invokeNative;

/**
 * Resolve the PEFCL resource folder name for NUI callbacks / asset fetches.
 * Prefer LB-injected `resourceName` and `cfx-nui-*` host — GetParentResourceName()
 * often returns `lb-phone` / `lb-tablet` when this UI runs as a custom app iframe.
 */
export const getResourceName = (): string => {
  const lbResource = typeof window.resourceName === 'string' ? window.resourceName.trim() : '';
  if (lbResource && !LB_HOST_RESOURCES.has(lbResource)) {
    return lbResource;
  }

  const fromHost = resourceFromCfxHost();
  if (fromHost && !LB_HOST_RESOURCES.has(fromHost)) {
    return fromHost;
  }

  if (typeof window.GetParentResourceName === 'function') {
    try {
      const parent = window.GetParentResourceName();
      if (parent && !LB_HOST_RESOURCES.has(parent)) {
        return parent;
      }
    } catch {
      /* fall through */
    }
  }

  return fromHost || lbResource || 'pefcl';
};

// Basic no operation function
export const noop = () => {};
