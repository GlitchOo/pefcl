import TransactionItem from '@components/TransactionItem';
import Count from '@components/ui/Count';
import { Heading2, Heading5, Heading6 } from '@components/ui/Typography/Headings';
import { AccountEvents } from '@typings/Events';
import { Account, AccountType } from '@typings/Account';
import { fetchNui } from '@utils/fetchNui';
import { GetTransactionsResponse, Transaction } from '@typings/Transaction';
import { TransactionEvents } from '@typings/Events';
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { ChevronLeft, ChevronRight, Paid } from '@mui/icons-material';
import styled from '@emotion/styled';
import { useGlobalSettings } from '@hooks/useGlobalSettings';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ALL_ACCOUNTS = 0;
const MOBILE_PAGE_SIZE = 15;
const TABLET_PAGE_SIZE = 25;

const Page = styled.div`
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const Header = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const List = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-bottom: 0.25rem;
`;

const Empty = styled.div`
  flex: 1;
  min-height: 8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
`;

const Pagination = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const MobileTransactionsView = () => {
  const { t } = useTranslation();
  const { isTablet } = useGlobalSettings();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [limit] = useState(isTablet ? TABLET_PAGE_SIZE : MOBILE_PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [selectedAccountId, setSelectedAccountId] = useState<number>(ALL_ACCOUNTS);

  const offset = limit * (page - 1);
  const pages = Math.ceil(total / limit) || 1;
  const to = Math.min(offset + limit, total);

  useEffect(() => {
    fetchNui<Account[]>(AccountEvents.GetAccounts).then((res) => {
      setAccounts(res ?? []);
    });
  }, []);

  useEffect(() => {
    const input: { limit: number; offset: number; accountId?: number } = {
      limit,
      offset,
    };
    if (selectedAccountId !== ALL_ACCOUNTS) {
      input.accountId = selectedAccountId;
    }

    fetchNui<GetTransactionsResponse>(TransactionEvents.Get, input).then((res) => {
      if (!res) return;
      setTotal(res.total);
      setTransactions(res.transactions);
    });
  }, [offset, limit, selectedAccountId]);

  const handleAccountChange = (event: { target: { value: unknown } }) => {
    const value = Number(event.target.value);
    setSelectedAccountId(isNaN(value) ? ALL_ACCOUNTS : value);
    setPage(1);
  };

  return (
    <Page>
      <Header>
        <Stack spacing={0.35}>
          <Heading2 style={{ fontSize: isTablet ? '1.55rem' : '1.35rem' }}>
            {t('Transactions')}
          </Heading2>
          <Heading5>{t('View your transaction history')}</Heading5>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={isTablet ? { maxWidth: '28rem' } : undefined}
        >
          <FormControl size="small" fullWidth>
            <InputLabel id="mobile-transactions-account">{t('Account')}</InputLabel>
            <Select
              labelId="mobile-transactions-account"
              value={selectedAccountId}
              label={t('Account')}
              onChange={handleAccountChange}
            >
              <MenuItem value={ALL_ACCOUNTS}>{t('All accounts')}</MenuItem>
              {accounts.map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.accountName} (
                  {account.type === AccountType.Shared ? t('Shared') : t('Personal')})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Heading6>{t('Total')}</Heading6>
            <Count amount={total} />
          </Stack>
        </Stack>
      </Header>

      {transactions.length === 0 ? (
        <Empty>
          <Paid sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
          <Typography color="text.secondary">{t('There is nothing to see here.')}</Typography>
        </Empty>
      ) : (
        <List>
          {transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} isLimitedSpace />
          ))}
        </List>
      )}

      {total > 0 && (
        <Pagination>
          <IconButton
            size="small"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            color="primary"
          >
            <ChevronLeft />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {t('{{from}}-{{to}} of {{total}}', { from: total === 0 ? 0 : offset + 1, to, total })}
          </Typography>
          <IconButton
            size="small"
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page >= pages}
            color="primary"
          >
            <ChevronRight />
          </IconButton>
        </Pagination>
      )}
    </Page>
  );
};

export default MobileTransactionsView;
