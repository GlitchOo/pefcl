import { AccountCard } from '@components/Card';
import InvoiceItem from '@components/InvoiceItem';
import TotalBalance from '@components/TotalBalance';
import TransactionItem from '@components/TransactionItem';
import { Heading4 } from '@components/ui/Typography/Headings';
import { useFetchNui } from '@hooks/useFetchNui';
import { Stack } from '@mui/material';
import { Box } from '@mui/system';
import { Account } from '@typings/Account';
import { AccountEvents, InvoiceEvents, TransactionEvents } from '@typings/Events';
import { GetInvoicesResponse, Invoice } from '@typings/Invoice';
import { Transaction } from '@typings/Transaction';
import { fetchNui } from '@utils/fetchNui';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const MobileDashboardView = () => {
  const { t } = useTranslation();
  const [defaultAccount, setDefaultAccount] = React.useState<Account>();
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    fetchNui<GetInvoicesResponse>(InvoiceEvents.Get, {
      limit: 2,
      offset: 0,
    }).then((res) => {
      setInvoices(res?.invoices ?? []);
    });
  }, []);

  useEffect(() => {
    fetchNui<Account[]>(AccountEvents.GetAccounts).then((accounts) => {
      const defaultAccount = accounts?.find((account) => account.isDefault);
      setDefaultAccount(defaultAccount);
    });
  }, []);

  const { data } = useFetchNui<{ total: number; transactions: Transaction[] }>(
    TransactionEvents.Get,
  );

  return (
    <Box p={4}>
      <Stack spacing={3}>
        <TotalBalance />

        <Stack spacing={1}>
          <Heading4>{t('Default account')}</Heading4>
          {defaultAccount && <AccountCard account={defaultAccount} />}
        </Stack>

        <Heading4>{t('Latest transactions')}</Heading4>
        <Stack spacing={2.5} overflow="hidden">
          {data?.transactions?.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} isLimitedSpace />
          ))}
        </Stack>

        <Heading4>{t('Unpaid invoices')}</Heading4>
        <Stack spacing={2.5} overflow="hidden">
          {invoices.map((invoice) => (
            <InvoiceItem key={invoice.id} invoice={invoice} />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export default MobileDashboardView;
