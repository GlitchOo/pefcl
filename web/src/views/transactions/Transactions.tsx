import Layout from '@components/Layout';
import TransactionItem from '@components/TransactionItem';
import BankPanel from '@components/ui/BankPanel';
import Count from '@components/ui/Count';
import styled from '@emotion/styled';
import { FormControl, InputLabel, MenuItem, Pagination, Select, Stack, Typography } from '@mui/material';
import theme from '@utils/theme';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heading6 } from '../../components/ui/Typography/Headings';
import { fetchNui } from '@utils/fetchNui';
import { GetTransactionsResponse, Transaction } from '@typings/Transaction';
import { TransactionEvents } from '@typings/Events';
import { DESKTOP_TRANSACTIONS_PAGE_SIZE } from '@utils/constants';
import { orderedAccountsAtom } from '@data/accounts';
import { useAtom } from 'jotai';
import { AccountType } from '@typings/Account';

const Page = styled.div`
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

const Panel = styled(BankPanel)`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding-top: 1rem;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
`;

const List = styled.div`
  overflow: auto;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding-right: 0.35rem;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.75rem;
  padding-top: 1rem;
  margin-top: auto;
  border-top: 1px solid var(--border-color);
`;

const Empty = styled.div`
  flex: 1;
  display: grid;
  place-items: center;
  color: ${theme.palette.text.disabled};
  font-size: 0.9rem;
`;

const ALL_ACCOUNTS = 0;

const Transactions = () => {
  const { t } = useTranslation();
  const [orderedAccounts] = useAtom(orderedAccountsAtom);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(DESKTOP_TRANSACTIONS_PAGE_SIZE);
  const pages = Math.ceil(total / limit);
  const [page, setPage] = useState(1);
  const [selectedAccountId, setSelectedAccountId] = useState<number>(ALL_ACCOUNTS);

  const offset = limit * (page - 1);
  const to = offset + limit > total ? total : offset + limit;

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleAccountChange = (event: { target: { value: unknown } }) => {
    const value = Number(event.target.value);
    setSelectedAccountId(isNaN(value) ? ALL_ACCOUNTS : value);
    setPage(1);
  };

  useEffect(() => {
    const input: { limit: number; offset: number; accountId?: number } = {
      limit,
      offset,
    };
    if (selectedAccountId !== ALL_ACCOUNTS) {
      input.accountId = selectedAccountId;
    }

    fetchNui<GetTransactionsResponse>(TransactionEvents.Get, input).then((res) => {
      if (!res) {
        return;
      }

      setLimit(res.limit);
      setTotal(res.total);
      setTransactions(res.transactions);
    });
  }, [offset, limit, selectedAccountId]);

  return (
    <Layout
      title={t('Transactions')}
      subtitle={t('Review money in and out of your Fleeca accounts')}
    >
      <Page>
        <Panel>
          <Toolbar>
            <Stack direction="row" spacing={1} alignItems="center">
              <Heading6>{t('Total')}</Heading6>
              <Count amount={total} />
            </Stack>

            <FormControl
              size="small"
              sx={{
                minWidth: 220,
                '& .MuiOutlinedInput-root': {
                  color: theme.palette.text.primary,
                  borderRadius: '10px',
                  '& fieldset': { borderColor: 'var(--border-color)' },
                },
                '& .MuiInputLabel-root': { color: theme.palette.text.secondary },
              }}
            >
              <InputLabel id="transactions-account-filter">{t('Account')}</InputLabel>
              <Select
                labelId="transactions-account-filter"
                value={selectedAccountId}
                label={t('Account')}
                onChange={handleAccountChange}
              >
                <MenuItem value={ALL_ACCOUNTS}>{t('All accounts')}</MenuItem>
                {orderedAccounts.map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    {account.accountName} (
                    {account.type === AccountType.Shared ? t('Shared') : t('Personal')})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Toolbar>

          <List>
            {transactions.map((transaction) => (
              <TransactionItem transaction={transaction} key={transaction.id} />
            ))}
            {transactions.length === 0 && <Empty>{t('No transactions yet')}</Empty>}
          </List>

          <Footer>
            <Typography variant="caption" color="text.secondary">
              {t('{{from}}-{{to}} of {{total}}', { from: offset || (total ? 1 : 0), to, total })}
            </Typography>
            <Pagination
              count={pages}
              shape="rounded"
              onChange={handlePageChange}
              page={page}
              color="primary"
            />
          </Footer>
        </Panel>
      </Page>
    </Layout>
  );
};

export default Transactions;
