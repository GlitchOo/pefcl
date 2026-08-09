/** Shared LB phone / tablet bezel insets for the mobile app shell + fullscreen modals */

export const PHONE_SAFE = {
  top: 'max(3.25rem, calc(env(safe-area-inset-top, 0px) + 2.75rem))',
  side: 'max(1.1rem, calc(env(safe-area-inset-left, 0px) + 0.85rem))',
  sideRight: 'max(1.1rem, calc(env(safe-area-inset-right, 0px) + 0.85rem))',
  bottom: 'max(0.75rem, calc(env(safe-area-inset-bottom, 0px) + 0.5rem))',
} as const;

export const TABLET_SAFE = {
  top: 'max(3rem, calc(env(safe-area-inset-top, 0px) + 2.5rem))',
  side: 'max(1.25rem, calc(env(safe-area-inset-left, 0px) + 1rem))',
  sideRight: 'max(1.25rem, calc(env(safe-area-inset-right, 0px) + 1rem))',
  bottom: 'max(1rem, calc(env(safe-area-inset-bottom, 0px) + 0.75rem))',
} as const;

export const getMobileSafe = (isTablet: boolean) => (isTablet ? TABLET_SAFE : PHONE_SAFE);
