import { atom } from 'jotai';
import dayjs from 'dayjs';
import { mockedInvoices } from '@utils/constants';
import { InvoiceEvents } from '@typings/Events';
import { GetInvoicesInput, GetInvoicesResponse, InvoiceStatus } from '../../../typings/Invoice';
import { fetchNui } from '../utils/fetchNui';
import { isEnvBrowser } from '../utils/misc';

const isInvoicePayable = (invoice: { status?: string; expiresAt?: string | number }) => {
  const isPaid =
    String(invoice.status ?? '')
      .trim()
      .toUpperCase() === InvoiceStatus.PAID;
  if (isPaid) return false;
  if (!invoice.expiresAt) return true;
  return !dayjs(invoice.expiresAt).isBefore(dayjs());
};

const initialState: GetInvoicesResponse = {
  total: 0,
  offset: 0,
  limit: 10,
  totalUnpaid: 0,
  invoices: [],
};

const getInvoices = async (input: GetInvoicesInput): Promise<GetInvoicesResponse> => {
  try {
    const res = await fetchNui<GetInvoicesResponse>(InvoiceEvents.Get, input);
    return res ?? initialState;
  } catch (e) {
    if (isEnvBrowser()) {
      return {
        ...initialState,
        invoices: mockedInvoices,
      };
    }
    console.error(e);
    return initialState;
  }
};

const invoicesAtomRaw = atom<GetInvoicesResponse>(initialState);
export const invoicesAtom = atom(
  async (get) => {
    const hasTransactions = get(invoicesAtomRaw).invoices.length > 0;
    return hasTransactions ? get(invoicesAtomRaw) : await getInvoices({ ...initialState });
  },
  async (get, set) => {
    const currentSettings = get(invoicesAtomRaw);
    return set(invoicesAtomRaw, await getInvoices(currentSettings));
  },
);

export const unpaidInvoicesAtom = atom(async (get) => {
  const invoices = await get(invoicesAtom);
  return invoices?.invoices?.filter(isInvoicePayable) ?? [];
});

export const totalInvoicesAtom = atom(async (get) => (await get(invoicesAtom))?.total ?? 0);
export const totalUnpaidInvoicesAtom = atom(async (get) => (await get(invoicesAtom))?.totalUnpaid ?? 0);
