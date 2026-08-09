import styled from '@emotion/styled';
import { Skeleton, Stack } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { transactionsTotalAtom } from 'src/data/transactions';
import Layout from '../../components/Layout';
import theme from '../../utils/theme';
import DashboardContainer, { DashboardContainerFallback } from './components/DashboardContainer';
import PendingInvoices from './components/PendingInvoices';
import Transactions from './components/Transactions';
import DashboardSummary from './components/Summary';
import AccountCards, { LoadingCards } from './components/AccountCards';
import TotalBalance from '@components/TotalBalance';
import QuickActions from '@components/QuickActions';
import { PreHeading } from '@components/ui/Typography/BodyText';
import { Heading1, Heading5 } from '@components/ui/Typography/Headings';
import { totalUnpaidInvoicesAtom } from '@data/invoices';

const Page = styled.div`
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  gap: 1rem;
  height: 100%;
  min-height: 0;
  overflow: hidden;
`;

const Overview = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: 1rem;
  align-items: center;
  padding: 1.15rem 1.35rem;
  border-radius: var(--panel-radius);
  background:
    radial-gradient(circle at 0% 0%, rgba(124, 181, 24, 0.22), transparent 42%),
    linear-gradient(135deg, #1a2a18 0%, #132017 55%, #101814 100%);
  border: 1px solid rgba(124, 181, 24, 0.22);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
`;

const SectionLabel = styled(Heading5)`
  letter-spacing: 0.04em;
  color: ${theme.palette.text.secondary};
  font-weight: 550;
  font-size: 0.78rem;
  margin-bottom: 0.55rem;
`;

const AccountsBlock = styled.section`
  flex-shrink: 0;
  min-width: 0;
  padding-bottom: 0.15rem;
`;

const MainGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(280px, 1fr);
  gap: 1rem;
  min-height: 0;
  overflow: hidden;
`;

const SideStack = styled.div`
  display: grid;
  grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1rem;
  min-height: 0;
  overflow: hidden;
`;

const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <Page>
        <Overview>
          <React.Suspense
            fallback={
              <Stack>
                <PreHeading>
                  <Skeleton variant="text" width={80} height={20} />
                </PreHeading>
                <Heading1>
                  <Skeleton variant="text" width={220} height={48} />
                </Heading1>
              </Stack>
            }
          >
            <TotalBalance />
          </React.Suspense>

          <div>
            <SectionLabel>{t('Quick actions')}</SectionLabel>
            <QuickActions />
          </div>
        </Overview>

        <AccountsBlock>
          <SectionLabel>{t('Your accounts')}</SectionLabel>
          <React.Suspense fallback={<LoadingCards compact />}>
            <AccountCards compact />
          </React.Suspense>
        </AccountsBlock>

        <MainGrid>
          <React.Suspense
            fallback={<DashboardContainerFallback title={t('Loading transactions')} />}
          >
            <DashboardSummary />
          </React.Suspense>

          <SideStack>
            <React.Suspense
              fallback={<DashboardContainerFallback title={t('Loading transactions')} />}
            >
              <DashboardContainer
                title={t('Latest transactions')}
                viewAllRoute="/transactions"
                totalAtom={transactionsTotalAtom}
              >
                <Transactions />
              </DashboardContainer>
            </React.Suspense>

            <React.Suspense
              fallback={<DashboardContainerFallback title={t('Loading invoices')} />}
            >
              <DashboardContainer
                title={t('Unpaid invoices')}
                viewAllRoute="/invoices"
                totalAtom={totalUnpaidInvoicesAtom}
              >
                <PendingInvoices />
              </DashboardContainer>
            </React.Suspense>
          </SideStack>
        </MainGrid>
      </Page>
    </Layout>
  );
};

export default Dashboard;
