import styled from '@emotion/styled';
import { useConfig } from '@hooks/useConfig';
import { GetTransactionHistoryResponse } from '@typings/Transaction';
import { formatMoney } from '@utils/currency';
import theme from '@utils/theme';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ChartWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  width: 100%;
  height: 100%;
  min-height: 0;
`;

const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${theme.palette.text.secondary};
`;

const Swatch = styled.span<{ tone: 'income' | 'expense' }>`
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 2px;
  background: ${({ tone }) =>
    tone === 'income' ? theme.palette.success.main : theme.palette.error.main};
`;

const Plot = styled.div`
  position: relative;
  flex: 1;
  min-height: 8.5rem;
  display: flex;
  align-items: stretch;
  gap: 0.35rem;
  padding: 0.5rem 0.15rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
`;

const Grid = styled.div`
  position: absolute;
  inset: 0.5rem 0 1.75rem 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;

  span {
    display: block;
    width: 100%;
    height: 1px;
    background: rgba(255, 255, 255, 0.05);
  }
`;

const DayCol = styled.button<{ active: boolean }>`
  appearance: none;
  border: 0;
  background: ${({ active }) => (active ? 'rgba(124, 181, 24, 0.1)' : 'transparent')};
  border-radius: 6px;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 0.45rem;
  padding: 0.35rem 0.15rem 0.25rem;
  cursor: pointer;
  position: relative;
  z-index: 1;
  transition: background var(--transition-fast);
`;

const Bars = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 0.3rem;
  min-height: 0;
`;

const Bar = styled.div<{ tone: 'income' | 'expense'; heightPct: number; active: boolean }>`
  width: 42%;
  max-width: 1.15rem;
  min-height: ${({ heightPct }) => (heightPct > 0 ? '3px' : '0')};
  height: ${({ heightPct }) => `${Math.max(heightPct, 0)}%`};
  border-radius: 3px 3px 1px 1px;
  background: ${({ tone }) =>
    tone === 'income' ? theme.palette.success.main : theme.palette.error.main};
  opacity: ${({ active }) => (active ? 1 : 0.82)};
  box-shadow: ${({ active, tone }) =>
    active
      ? `0 0 10px ${tone === 'income' ? 'rgba(46,157,106,0.35)' : 'rgba(232,92,74,0.35)'}`
      : 'none'};
  transition: height var(--transition-smooth), opacity var(--transition-fast),
    box-shadow var(--transition-fast);
`;

const DayLabel = styled.span<{ active: boolean }>`
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ active }) =>
    active ? theme.palette.text.primary : theme.palette.text.disabled};
`;

const Tooltip = styled.div`
  position: absolute;
  left: 50%;
  bottom: calc(100% + 0.4rem);
  transform: translateX(-50%);
  min-width: 8.75rem;
  padding: 0.6rem 0.7rem;
  border-radius: 6px;
  background: rgba(12, 14, 18, 0.97);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-card);
  z-index: 3;
  pointer-events: none;
`;

const TipDate = styled.div`
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${theme.palette.text.disabled};
  margin-bottom: 0.4rem;
`;

const TipRow = styled.div<{ tone: 'income' | 'expense' }>`
  display: flex;
  justify-content: space-between;
  gap: 0.85rem;
  font-size: 0.78rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${({ tone }) =>
    tone === 'income' ? theme.palette.success.main : theme.palette.error.main};

  span:first-child {
    color: ${theme.palette.text.secondary};
    font-weight: 500;
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
`;

const Empty = styled.div`
  flex: 1;
  min-height: 8.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.palette.text.disabled};
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px dashed var(--border-color);
  border-radius: var(--card-radius);
`;

interface WeekGraphProps {
  data: GetTransactionHistoryResponse['lastWeek'];
}

type DayPoint = {
  key: string;
  date: Date;
  income: number;
  expenses: number;
  absExpense: number;
};

const WeekGraph = ({ data }: WeekGraphProps) => {
  const { t } = useTranslation();
  const config = useConfig();
  const [hoverKey, setHoverKey] = useState<string | null>(null);

  const points = useMemo<DayPoint[]>(() => {
    return Object.entries(data)
      .map(([key, value]) => ({
        key,
        date: new Date(key),
        income: value.income ?? 0,
        expenses: value.expenses ?? 0,
        absExpense: Math.abs(value.expenses ?? 0),
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [data]);

  const maxValue = useMemo(() => {
    const peak = points.reduce((max, p) => Math.max(max, p.income, p.absExpense), 0);
    return peak > 0 ? peak : 1;
  }, [points]);

  if (!points.length) {
    return <Empty>{t('No activity this week')}</Empty>;
  }

  return (
    <ChartWrap>
      <Legend>
        <LegendItem>
          <Swatch tone="income" />
          {t('Income')}
        </LegendItem>
        <LegendItem>
          <Swatch tone="expense" />
          {t('Expenses')}
        </LegendItem>
      </Legend>

      <Plot>
        <Grid>
          <span />
          <span />
          <span />
          <span />
          <span />
        </Grid>

        {points.map((point) => {
          const active = hoverKey === point.key;
          const incomePct = (point.income / maxValue) * 100;
          const expensePct = (point.absExpense / maxValue) * 100;

          return (
            <DayCol
              key={point.key}
              type="button"
              active={active}
              onMouseEnter={() => setHoverKey(point.key)}
              onMouseLeave={() => setHoverKey(null)}
              onFocus={() => setHoverKey(point.key)}
              onBlur={() => setHoverKey(null)}
            >
              {active && (
                <Tooltip>
                  <TipDate>
                    {point.date.toLocaleDateString(config.general.language, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TipDate>
                  <TipRow tone="income">
                    <span>{t('Income')}</span>
                    <span>{formatMoney(point.income, config.general)}</span>
                  </TipRow>
                  <div style={{ height: 4 }} />
                  <TipRow tone="expense">
                    <span>{t('Expenses')}</span>
                    <span>{formatMoney(point.absExpense, config.general)}</span>
                  </TipRow>
                </Tooltip>
              )}

              <Bars>
                <Bar tone="expense" heightPct={expensePct} active={active} />
                <Bar tone="income" heightPct={incomePct} active={active} />
              </Bars>
              <DayLabel active={active}>
                {point.date.toLocaleDateString(config.general.language, { weekday: 'short' })}
              </DayLabel>
            </DayCol>
          );
        })}
      </Plot>
    </ChartWrap>
  );
};

export default WeekGraph;
