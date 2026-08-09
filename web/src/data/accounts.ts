import { Account } from '@typings/Account';
import { AccountEvents } from '@typings/Events';
import { atom } from 'jotai';
import { mockedAccounts } from '../utils/constants';
import { fetchNui } from '../utils/fetchNui';
import { isEnvBrowser } from '../utils/misc';

const getAccounts = async (): Promise<Account[]> => {
  try {
    const res = await fetchNui<Account[]>(AccountEvents.GetAccounts);
    return res ?? [];
  } catch (e) {
    if (isEnvBrowser()) {
      return mockedAccounts;
    }
    console.error(e);
    return [];
  }
};

export const rawAccountAtom = atom<Account[]>([]);
export const accountsAtom = atom<Promise<Account[]>, Account[] | undefined, Promise<void>>(
  async (get) => {
    const accounts = get(rawAccountAtom).length === 0 ? await getAccounts() : get(rawAccountAtom);
    return accounts;
  },
  async (_get, set, by) => {
    return set(rawAccountAtom, by ?? (await getAccounts()));
  },
);

export const totalBalanceAtom = atom(async (get) => {
  const accounts = await get(accountsAtom);
  return Array.isArray(accounts) ? accounts.reduce((prev, curr) => prev + curr.balance, 0) : 0;
});

export const activeAccountAtomId = atom<number>(0);
export const activeAccountAtom = atom(
  async (get) => {
    const accounts = await get(accountsAtom);
    return Array.isArray(accounts)
      ? accounts.find((account) => account.id === get(activeAccountAtomId))
      : undefined;
  },
  (_get, set, str: number) => set(activeAccountAtomId, str),
);

export const defaultAccountAtom = atom(async (get) => {
  const accounts = await get(accountsAtom);
  return Array.isArray(accounts) ? accounts.find((account) => account.isDefault) : undefined;
});

export const defaultAccountBalance = atom(async (get) => {
  const defaultAccount = await get(defaultAccountAtom);
  return defaultAccount?.balance;
});

/* Saved order for cards */
type OrderedAccounts = Record<number, number>;
const accountOrderAtom = atom<string>(localStorage.getItem('order') ?? '');

export const orderedAccountsAtom = atom<Promise<Account[]>, OrderedAccounts, Promise<void>>(
  async (get) => {
    const accounts = await get(accountsAtom);
    if (!Array.isArray(accounts)) return [];
    const storageOrder = get(accountOrderAtom);

    try {
      JSON.parse(storageOrder);
    } catch {
      return accounts;
    }

    const order = JSON.parse(storageOrder);
    const sorted = [...accounts].sort((a, b) => {
      const aIndex = order?.[a.id] ?? 0;
      const bIndex = order?.[b.id] ?? 0;

      return aIndex > bIndex ? 1 : -1;
    });

    return sorted;
  },
  (_get, set, by: OrderedAccounts) => {
    set(accountOrderAtom, JSON.stringify(by));
    localStorage.setItem('order', JSON.stringify(by));
  },
);
