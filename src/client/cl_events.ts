import { RegisterNuiCB } from '@project-error/pe-utils';
import { Account, AccountType } from '@typings/Account';
import {
  AccountEvents,
  ExternalAccountEvents,
  InvoiceEvents,
  SharedAccountEvents,
  TransactionEvents,
  UserEvents,
  BalanceEvents,
  Broadcasts,
  NUIEvents,
  CashEvents,
  CardEvents,
} from '@typings/Events';
import { Invoice } from '@typings/Invoice';
import { Transaction, TransactionType } from '@typings/Transaction';
import { RegisterNuiProxy } from 'cl_utils';
import { translations } from 'i18n';
import API from './cl_api';
import config from './cl_config';

const lbPhoneExports = global.exports['lb-phone'];
const lbTabletExports = global.exports['lb-tablet'];

const isFrameworkIntegrationActive = (): boolean => {
  const fi = config.frameworkIntegration;
  if (!fi?.enabled) return false;
  if (fi.enabled === 'auto' || fi.resource === 'auto' || fi.resource === 'builtin') {
    return (GlobalState as Record<string, unknown>)['pefcl:frameworkActive'] === true;
  }
  return true;
};

const useFrameworkIntegration = isFrameworkIntegrationActive();
let hasNUILoaded = false;

emitNet(UserEvents.LoadClient);

RegisterNuiCB(NUIEvents.Loaded, () => {
  console.debug('NUI has loaded.');
  hasNUILoaded = true;
});

RegisterNuiCB(NUIEvents.Unloaded, () => {
  console.debug('NUI has unloaded.');
  hasNUILoaded = false;
});

const waitForNUILoaded = (checkInterval = 250): Promise<void> => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (hasNUILoaded) {
        resolve();
        clearInterval(interval);
      }
    }, checkInterval);
  });
};

const SendBankUIMessage = (app: string, method: string, data: unknown) => {
  const payload = {
    app,
    method,
    data,
  };

  SendNUIMessage(payload);

  // LB Phone/Tablet: SendCustomAppMessage(identifier, data) — not (app, method, data)
  if (GetResourceState('lb-phone') === 'started') {
    lbPhoneExports.SendCustomAppMessage(app, payload);
  }

  if (GetResourceState('lb-tablet') === 'started') {
    lbTabletExports.SendCustomAppMessage(app, payload);
  }
};

onNet(Broadcasts.NewAccount, (payload: Account) => {
  SendBankUIMessage('pefcl', Broadcasts.NewAccount, payload);
});

onNet(Broadcasts.NewAccountBalance, (account: Account) => {
  SendBankUIMessage('pefcl', Broadcasts.NewAccountBalance, account);
});

onNet(Broadcasts.NewTransaction, (payload: Transaction) => {
  SendBankUIMessage('pefcl', Broadcasts.NewTransaction, payload);
  if (GetResourceState('lb-phone') === 'started') {
    if (
      (payload?.type == TransactionType.Incoming &&
        payload?.toAccount?.type === AccountType.Personal) ||
      (payload?.type == TransactionType.Outgoing &&
        payload?.fromAccount?.type === AccountType.Personal)
    ) {
      lbPhoneExports.SendNotification({
        app: 'pefcl',
        title: translations.t('New Transaction'),
        content:
          (payload.type === TransactionType.Outgoing
            ? translations.t('Removed')
            : translations.t('Received')) + `: ${translations.t('$')}${payload.amount}`,
      });
    }
  }
});

onNet(Broadcasts.UpdatedAccount, (payload: Account) => {
  SendBankUIMessage('pefcl', Broadcasts.UpdatedAccount, payload);
});

onNet(Broadcasts.NewInvoice, (payload: Invoice, isReceiver: boolean) => {
  SendBankUIMessage('pefcl', Broadcasts.NewInvoice, payload);
  if (GetResourceState('lb-phone') === 'started') {
    if (isReceiver) {
      lbPhoneExports.SendNotification({
        app: 'pefcl',
        title: translations.t('New Invoice'),
        content: payload.message,
      });
    }
  }
});

onNet(Broadcasts.NewSharedUser, () => {
  SendBankUIMessage('pefcl', Broadcasts.NewSharedUser, {});
});

onNet(Broadcasts.RemovedSharedUser, () => {
  SendBankUIMessage('pefcl', Broadcasts.RemovedSharedUser, {});
});

onNet(UserEvents.Loaded, async () => {
  console.debug('Waiting for NUI to load ..');
  await waitForNUILoaded();
  console.debug('Loaded. Emitting data to NUI.');
  SendBankUIMessage('pefcl', UserEvents.Loaded, true);

  if (!useFrameworkIntegration) {
    StatSetInt(CASH_BAL_STAT, (await API.getMyCash()) ?? 0, true);
  }
});

onNet(UserEvents.Unloaded, () => {
  SendBankUIMessage('pefcl', UserEvents.Unloaded, {});
});

const CASH_BAL_STAT = GetHashKey('MP0_WALLET_BALANCE');
onNet(BalanceEvents.UpdateCashBalance, (newBalance: number) => {
  StatSetInt(CASH_BAL_STAT, newBalance, true);
});

RegisterNuiProxy(AccountEvents.GetAccounts);
RegisterNuiProxy(AccountEvents.CreateAccount);
RegisterNuiProxy(AccountEvents.DeleteAccount);
RegisterNuiProxy(AccountEvents.SetDefaultAccount);
RegisterNuiProxy(AccountEvents.RenameAccount);
RegisterNuiProxy(InvoiceEvents.Get);
RegisterNuiProxy(InvoiceEvents.CountUnpaid);
RegisterNuiProxy(InvoiceEvents.CreateInvoice);
RegisterNuiProxy(InvoiceEvents.PayInvoice);
RegisterNuiProxy(TransactionEvents.Get);
RegisterNuiProxy(TransactionEvents.GetHistory);
RegisterNuiProxy(TransactionEvents.CreateTransfer);

RegisterNuiProxy(UserEvents.GetUsers);
RegisterNuiProxy(SharedAccountEvents.AddUser);
RegisterNuiProxy(SharedAccountEvents.RemoveUser);
RegisterNuiProxy(SharedAccountEvents.GetUsers);
RegisterNuiProxy(ExternalAccountEvents.Add);
RegisterNuiProxy(ExternalAccountEvents.Get);

RegisterNuiProxy(AccountEvents.GetAtmAccount);
RegisterNuiProxy(AccountEvents.WithdrawMoney);
RegisterNuiProxy(AccountEvents.DepositMoney);
RegisterNuiProxy(CashEvents.GetMyCash);

// Cards
RegisterNuiProxy(CardEvents.Get);
RegisterNuiProxy(CardEvents.Block);
RegisterNuiProxy(CardEvents.Delete);
RegisterNuiProxy(CardEvents.OrderPersonal);
RegisterNuiProxy(CardEvents.OrderShared);
RegisterNuiProxy(CardEvents.UpdatePin);
RegisterNuiProxy(CardEvents.GetInventoryCards);

RegisterCommand(
  'bank-force-load',
  async () => {
    console.debug('Waiting for NUI to load ..');
    await waitForNUILoaded();
    console.debug('Loaded. Emitting data to NUI.');
    SendBankUIMessage('pefcl', UserEvents.Loaded, true);
  },
  false,
);
