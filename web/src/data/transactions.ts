import { atom } from 'jotai';
import { TransactionEvents } from '@typings/Events';
import { GetTransactionsInput, GetTransactionsResponse } from '@typings/Transaction';
import { mockedTransactions } from '../utils/constants';
import { fetchNui } from '../utils/fetchNui';
import { isEnvBrowser } from '../utils/misc';

export const transactionInitialState: GetTransactionsResponse = {
  total: 0,
  offset: 0,
  limit: 10,
  transactions: [],
};

const getTransactions = async (input: GetTransactionsInput): Promise<GetTransactionsResponse> => {
  try {
    const res = await fetchNui<GetTransactionsResponse>(TransactionEvents.Get, input);
    return res ?? transactionInitialState;
  } catch (e) {
    if (isEnvBrowser()) {
      return mockedTransactions;
    }
    console.error(e);
    return transactionInitialState;
  }
};

export const rawTransactionsAtom = atom<GetTransactionsResponse>(transactionInitialState);

export const transactionBaseAtom = atom(
  async (get) => {
    const hasTransactions = get(rawTransactionsAtom).transactions.length > 0;
    return hasTransactions
      ? get(rawTransactionsAtom)
      : await getTransactions({ ...transactionInitialState });
  },
  async (get, set, by?: GetTransactionsResponse) => {
    const currentSettings = get(rawTransactionsAtom);
    return set(rawTransactionsAtom, by ?? (await getTransactions({ ...currentSettings })));
  },
);

export const transactionsAtom = atom(async (get) => {
  const base = await get(transactionBaseAtom);
  return base?.transactions ?? [];
});

export const transactionsTotalAtom = atom(async (get) => (await get(transactionBaseAtom))?.total ?? 0);
export const transactionsLimitAtom = atom(async (get) => (await get(transactionBaseAtom))?.limit ?? 10);
export const transactionsOffsetAtom = atom(async (get) => (await get(transactionBaseAtom))?.offset ?? 0);
