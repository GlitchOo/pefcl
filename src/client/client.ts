import './i18n';
import './cl_events';
import './cl_exports';
import './cl_integrations';
import './cl_blips';
import { GeneralEvents, SessionEvents } from '@typings/Events';
import { RegisterNuiCB } from '@project-error/pe-utils';
import { createInvoice, giveCash } from './functions';
import config from './cl_config';

let isAtmOpen = false;
let isBankOpen = false;

const isFrameworkIntegrationActive = (): boolean => {
  const fi = config.frameworkIntegration;
  if (!fi?.enabled) return false;
  if (fi.enabled === 'auto' || fi.resource === 'auto' || fi.resource === 'builtin') {
    return (GlobalState as Record<string, unknown>)['pefcl:frameworkActive'] === true;
  }
  return true;
};

const useFrameworkIntegration = isFrameworkIntegrationActive();
const resourceName = GetCurrentResourceName();

const openSession = (type: 'bank' | 'atm') => {
  emitNet(SessionEvents.Open, type);
};

const closeSession = () => {
  emitNet(SessionEvents.Close);
};

export const setBankIsOpen = (bool: boolean) => {
  if (isBankOpen === bool) {
    return;
  }

  isBankOpen = bool;
  SendNUIMessage({ app: 'pefcl', method: 'setVisible', data: bool });

  SetNuiFocus(bool, bool);

  if (bool) {
    openSession('bank');
  } else {
    closeSession();
  }
};

export const setAtmIsOpen = (bool: boolean) => {
  if (isAtmOpen === bool) {
    return;
  }

  isAtmOpen = bool;
  SendNUIMessage({ app: 'pefcl', method: 'setVisibleATM', data: bool });
  SetNuiFocus(bool, bool);

  if (bool) {
    openSession('atm');
  } else {
    closeSession();
  }
};

if (!useFrameworkIntegration) {
  RegisterCommand(
    'bank',
    () => {
      setBankIsOpen(!isBankOpen);
    },
    false,
  );

  RegisterCommand(
    'atm',
    () => {
      // Get position x amount units forward of the player or default to 5.0
      const plyPed = PlayerPedId();
      const [xp, yp, zp] = GetEntityCoords(plyPed, false);
      const [xf, yf, zf] = GetOffsetFromEntityInWorldCoords(
        plyPed,
        0.0,
        config.atms?.distance ?? 5.0,
        0.0,
      );

      // Create a test capsule and get raycast result
      const tc = StartShapeTestCapsule(xp, yp, zp, xf, yf, zf, 0.5, 16, 0, 4);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [retval, hit, endCoords, surfaceNormal, entityHit] = GetRaycastResult(tc);
      if (!hit) return;
      const model = GetEntityModel(entityHit);
      if (!config.atms?.props?.includes(model)) return;

      isAtmOpen = !isAtmOpen;
      SendNUIMessage({ app: 'pefcl', method: 'setVisibleATM', data: isAtmOpen });

      if (isAtmOpen) {
        SetNuiFocus(true, true);
        openSession('atm');
      } else {
        SetNuiFocus(false, false);
        closeSession();
      }
    },
    false,
  );
}

RegisterNuiCB<void>(GeneralEvents.CloseUI, async () => {
  setBankIsOpen(false);
  setAtmIsOpen(false);
  closeSession();

  emit('pefcl:closedUI');
});

if (!useFrameworkIntegration) {
  RegisterCommand(
    'cash',
    async () => {
      SetMultiplayerWalletCash();
      setTimeout(RemoveMultiplayerWalletCash, 5000);
    },
    false,
  );
}

if (!useFrameworkIntegration) {
  RegisterCommand('giveCash', giveCash, false);
  RegisterCommand('createInvoice', createInvoice, false);
}

const APP_IDENTIFIER = 'pefcl';

const addMobileApp = async (lbProduct: 'lb-phone' | 'lb-tablet') => {
  if (GetResourceState(lbProduct) !== 'started') return;

  // LB docs: wait briefly after start so AddCustomApp export exists
  await new Promise((resolve) => setTimeout(resolve, 750));

  if (lbProduct === 'lb-tablet') {
    const lbTabletExports = global.exports['lb-tablet'];
    try {
      lbTabletExports.RemoveCustomApp(APP_IDENTIFIER);
    } catch {
      /* app may not exist yet */
    }

    await lbTabletExports.AddCustomApp({
      identifier: APP_IDENTIFIER,
      name: 'Banking',
      description: 'Manage your financials with Fleeca Banking',
      developer: 'Fleeca',
      defaultApp: false,
      size: 59812,
      images: [
        `https://cfx-nui-${resourceName}/web/media/appstore/tablet_1.png`,
        `https://cfx-nui-${resourceName}/web/media/appstore/tablet_2.png`,
        `https://cfx-nui-${resourceName}/web/media/appstore/tablet_3.png`,
        `https://cfx-nui-${resourceName}/web/media/appstore/tablet_4.png`,
        `https://cfx-nui-${resourceName}/web/media/appstore/tablet_5.png`,
        `https://cfx-nui-${resourceName}/web/media/appstore/tablet_6.png`,
      ],
      ui: `https://cfx-nui-${resourceName}/web/dist/index.html#/mobile/dashboard?device=tablet`,
      icon: `https://cfx-nui-${resourceName}/web/media/app.png?v=fleeca5`,
    });
    return;
  }

  const lbPhoneExports = global.exports['lb-phone'];
  try {
    lbPhoneExports.RemoveCustomApp(APP_IDENTIFIER);
  } catch {
    /* app may not exist yet */
  }

  await lbPhoneExports.AddCustomApp({
    identifier: APP_IDENTIFIER,
    name: 'Banking',
    description: 'Manage your financials with Fleeca Banking',
    developer: 'Fleeca',
    defaultApp: false,
    size: 59812,
    images: [
      `https://cfx-nui-${resourceName}/web/media/appstore/phone_1.png`,
      `https://cfx-nui-${resourceName}/web/media/appstore/phone_2.png`,
      `https://cfx-nui-${resourceName}/web/media/appstore/phone_3.png`,
      `https://cfx-nui-${resourceName}/web/media/appstore/phone_4.png`,
      `https://cfx-nui-${resourceName}/web/media/appstore/phone_5.png`,
      `https://cfx-nui-${resourceName}/web/media/appstore/phone_6.png`,
      `https://cfx-nui-${resourceName}/web/media/appstore/phone_7.png`,
    ],
    ui: `https://cfx-nui-${resourceName}/web/dist/index.html#/mobile/dashboard`,
    icon: `https://cfx-nui-${resourceName}/web/media/app.png?v=fleeca5`,
  });
};

on(`onResourceStart`, (resName: string) => {
  if (resName === 'lb-phone' || resName === 'lb-tablet') {
    addMobileApp(resName);
  }
});

(async () => {
  if (GetResourceState('lb-phone') === 'started') {
    await addMobileApp('lb-phone');
  }
})();

(async () => {
  if (GetResourceState('lb-tablet') === 'started') {
    await addMobileApp('lb-tablet');
  }
})();
