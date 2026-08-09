import { AccountCard } from '@components/AccountCard';
import InvoiceItem from '@components/InvoiceItem';
import QuickActions from '@components/QuickActions';
import TotalBalance from '@components/TotalBalance';
import TransactionItem from '@components/TransactionItem';
import { Heading2, Heading4, Heading5 } from '@components/ui/Typography/Headings';
import { unpaidInvoicesAtom } from '@data/invoices';
import { useFetchNui } from '@hooks/useFetchNui';
import { useGlobalSettings } from '@hooks/useGlobalSettings';
import { Stack } from '@mui/material';
import { Account } from '@typings/Account';
import { AccountEvents, TransactionEvents } from '@typings/Events';
import { Transaction } from '@typings/Transaction';
import { fetchNui } from '@utils/fetchNui';
import theme from '@utils/theme';
import styled from '@emotion/styled';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Page = styled.div<{ isTablet?: boolean }>`
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ isTablet }) => (isTablet ? '1rem' : '0.85rem')};
  overflow: hidden;
`;

const Top = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const TabletGrid = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1.25fr);
  gap: 1.15rem;
`;

const Column = styled.div`
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  overflow: hidden;
`;

const Panel = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding: 1rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
`;

const SectionTitle = styled(Heading4)`
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${theme.palette.text.secondary};
`;

const Empty = styled(Heading5)`
  color: ${theme.palette.text.disabled};
  font-weight: 500;
`;

const TransactionsSection = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
`;

const ScrollList = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-bottom: 0.25rem;
`;

const MobileDashboardView = () => {
  const { t } = useTranslation();
  const { isTablet } = useGlobalSettings();
  const [defaultAccount, setDefaultAccount] = useState<Account>();
  const [invoices] = useAtom(unpaidInvoicesAtom);

  useEffect(() => {
    fetchNui<Account[]>(AccountEvents.GetAccounts).then((accounts) => {
      const defaultAccount = accounts?.find((account) => account.isDefault);
      setDefaultAccount(defaultAccount);
    });
  }, []);

  const options = {
    offset: 0,
    limit: isTablet ? 30 : 20,
  };
  const { data } = useFetchNui<{ total: number; transactions: Transaction[] }>(
    TransactionEvents.Get,
    options,
  );

  const unpaidPreview = invoices.slice(0, isTablet ? 4 : 2);

  if (isTablet) {
    return (
      <Page isTablet>
        <Stack spacing={0.35} flexShrink={0}>
          <Heading2 style={{ fontSize: '1.55rem' }}>{t('Dashboard')}</Heading2>
          <Heading5>{t('Your accounts')}</Heading5>
        </Stack>

        <TabletGrid>
          <Column>
            <TotalBalance />
            <QuickActions
              hideDepositWithdraw
              paths={{
                transfer: '/mobile/transfer',
                invoices: '/mobile/invoices',
                deposit: '/mobile/dashboard',
                withdraw: '/mobile/dashboard',
              }}
            />
            <Stack spacing={0.55} flexShrink={0}>
              <SectionTitle>{t('Default account')}</SectionTitle>
              {defaultAccount && <AccountCard account={defaultAccount} compact />}
            </Stack>
            <Panel>
              <SectionTitle>{t('Unpaid invoices')}</SectionTitle>
              <ScrollList>
                {unpaidPreview.map((invoice) => (
                  <InvoiceItem key={invoice.id} invoice={invoice} />
                ))}
                {unpaidPreview.length <= 0 && (
                  <Empty>{t('There are currently no unpaid invoices!')}</Empty>
                )}
              </ScrollList>
            </Panel>
          </Column>

          <Column>
            <Panel>
              <SectionTitle>{t('Latest transactions')}</SectionTitle>
              <ScrollList>
                {data?.transactions?.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    isLimitedSpace
                  />
                ))}
                {!data?.transactions?.length && <Empty>{t('No recent transactions')}</Empty>}
              </ScrollList>
            </Panel>
          </Column>
        </TabletGrid>
      </Page>
    );
  }

  return (
    <Page>
      <Top>
        <TotalBalance />

        <QuickActions
          compact
          hideDepositWithdraw
          paths={{
            transfer: '/mobile/transfer',
            invoices: '/mobile/invoices',
            deposit: '/mobile/dashboard',
            withdraw: '/mobile/dashboard',
          }}
        />

        <Stack spacing={0.55}>
          <SectionTitle>{t('Default account')}</SectionTitle>
          {defaultAccount && <AccountCard account={defaultAccount} compact />}
        </Stack>

        {unpaidPreview.length > 0 && (
          <Stack spacing={0.55}>
            <SectionTitle>{t('Unpaid invoices')}</SectionTitle>
            <Stack spacing={0.75}>
              {unpaidPreview.map((invoice) => (
                <InvoiceItem key={invoice.id} invoice={invoice} />
              ))}
            </Stack>
          </Stack>
        )}
      </Top>

      <TransactionsSection>
        <SectionTitle>{t('Latest transactions')}</SectionTitle>
        <ScrollList>
          {data?.transactions?.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} isLimitedSpace />
          ))}
          {!data?.transactions?.length && <Empty>{t('No recent transactions')}</Empty>}
        </ScrollList>
      </TransactionsSection>
    </Page>
  );
};

export default MobileDashboardView;
