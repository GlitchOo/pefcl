import WeekGraph from '@components/WeekGraph';
import { Heading5, Heading6 } from '@components/ui/Typography/Headings';
import styled from '@emotion/styled';
import { useConfig } from '@hooks/useConfig';
import { Skeleton, Stack } from '@mui/material';
import { TransactionEvents } from '@typings/Events';
import { GetTransactionHistoryResponse } from '@typings/Transaction';
import { formatMoney } from '@utils/currency';
import { fetchNui } from '@utils/fetchNui';
import theme from '@utils/theme';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  padding: 1rem 1.15rem;
  border-radius: var(--card-radius);
  background: ${theme.palette.background.paper};
  border: 1px solid var(--glass-border);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
`;

const Title = styled(Heading5)`
  color: ${theme.palette.text.primary};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.8rem;
  font-weight: 600;
`;

const KpiRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
`;

const Kpi = styled.div`
  padding: 0.75rem 0.85rem;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid var(--border-color);
`;

const KpiLabel = styled(Heading6)`
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-size: 0.65rem;
  color: ${theme.palette.text.disabled};
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const KpiValue = styled.div<{ tone?: 'income' | 'expense' | 'net' }>`
  font-size: 1.05rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.01em;
  color: ${({ tone }) =>
    tone === 'income'
      ? theme.palette.success.main
      : tone === 'expense'
        ? theme.palette.error.main
        : theme.palette.text.primary};
`;

const ChartBlock = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

const DashboardSummary = () => {
  const { t } = useTranslation();
  const config = useConfig();
  const [data, setData] = useState<GetTransactionHistoryResponse | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchNui<GetTransactionHistoryResponse>(TransactionEvents.GetHistory)
      .then((result) => {
        if (alive) setData(result);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const income = data?.income ?? 0;
  const expenses = Math.abs(data?.expenses ?? 0);
  const net = income - expenses;

  const netTone = useMemo<'income' | 'expense' | 'net'>(() => {
    if (net > 0) return 'income';
    if (net < 0) return 'expense';
    return 'net';
  }, [net]);

  return (
    <Panel>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Title>{t('Weekly cashflow')}</Title>
      </Stack>

      <KpiRow>
        <Kpi>
          <KpiLabel>{t('Income')}</KpiLabel>
          <KpiValue tone="income">
            {loading ? <Skeleton width={90} /> : formatMoney(income, config.general)}
          </KpiValue>
        </Kpi>
        <Kpi>
          <KpiLabel>{t('Expenses')}</KpiLabel>
          <KpiValue tone="expense">
            {loading ? <Skeleton width={90} /> : formatMoney(expenses, config.general)}
          </KpiValue>
        </Kpi>
        <Kpi>
          <KpiLabel>{t('Net')}</KpiLabel>
          <KpiValue tone={netTone}>
            {loading ? <Skeleton width={90} /> : formatMoney(net, config.general)}
          </KpiValue>
        </Kpi>
      </KpiRow>

      <ChartBlock>
        {loading ? (
          <Skeleton variant="rounded" height={180} sx={{ bgcolor: 'rgba(255,255,255,0.04)' }} />
        ) : (
          <WeekGraph data={data?.lastWeek ?? {}} />
        )}
      </ChartBlock>
    </Panel>
  );
};

export default DashboardSummary;
