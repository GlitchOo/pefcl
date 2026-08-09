import { accountsAtom, rawAccountAtom } from '@data/accounts';
import { invoicesAtom } from '@data/invoices';
import { transactionBaseAtom } from '@data/transactions';
import { Account } from '@typings/Account';
import { Broadcasts } from '@typings/Events';
import { updateAccount } from '@utils/account';
import { useAtom, useSetAtom } from 'jotai';
import { useNuiEvent } from '@hooks/useNuiEvent';
import { useRef } from 'react';

export const useBroadcasts = () => {
  const updateInvoices = useSetAtom(invoicesAtom);
  const updateTransactions = useSetAtom(transactionBaseAtom);
  const setRawAccounts = useSetAtom(rawAccountAtom);
  const refetchAccounts = useSetAtom(accountsAtom);
  const [rawAccounts] = useAtom(rawAccountAtom);

  // Use ref to avoid stale closure when broadcast fires - ensures we always have latest accounts
  const rawAccountsRef = useRef(rawAccounts);
  rawAccountsRef.current = rawAccounts;

  useNuiEvent('pefcl', Broadcasts.NewTransaction, () => {
    updateTransactions();
  });

  useNuiEvent('pefcl', Broadcasts.NewAccount, (account: Account) => {
    const accounts = Array.isArray(rawAccountsRef.current) ? rawAccountsRef.current : [];
    setRawAccounts([...accounts, account]);
  });

  useNuiEvent('pefcl', Broadcasts.UpdatedAccount, () => {
    refetchAccounts(undefined);
  });

  useNuiEvent('pefcl', Broadcasts.NewAccountBalance, (account: Account) => {
    const accounts = Array.isArray(rawAccountsRef.current) ? rawAccountsRef.current : [];
    const updated = updateAccount(accounts, account);
    // Refetch when we can't merge (empty list or account not found) to ensure UI stays in sync
    if (updated === accounts) {
      refetchAccounts(undefined);
    } else {
      setRawAccounts(updated);
    }
  });

  useNuiEvent('pefcl', Broadcasts.NewInvoice, () => {
    updateInvoices();
  });

  useNuiEvent('pefcl', Broadcasts.NewSharedUser, () => {
    refetchAccounts(undefined);
  });

  useNuiEvent('pefcl', Broadcasts.RemovedSharedUser, () => {
    refetchAccounts(undefined);
  });
};

export const BroadcastsWrapper = () => {
  useBroadcasts();
  return null;
};
