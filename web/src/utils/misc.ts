import { LBSettings } from '@typings/LBAddons';

declare global {
  interface Window {
    invokeNative(): void;
    GetParentResourceName?: () => string;
    GetSettings?: () => Promise<LBSettings>;
  }
}

// and not CEF
export const isEnvBrowser = (): boolean => !window.invokeNative;
export const getResourceName = () => 'pefcl';

// Basic no operation function
export const noop = () => {};
