import React from 'react';
import calendar from 'dayjs/plugin/calendar';
import dayjs from 'dayjs';
import {
  ArrowDownwardRounded,
  ArrowForwardRounded,
  ArrowUpwardRounded,
} from '@mui/icons-material';
import styled from '@emotion/styled';
import theme from '@utils/theme';
import { useConfig } from '@hooks/useConfig';
import { Transaction, TransactionType } from '@typings/Transaction';
import { formatMoney } from '@utils/currency';
import { useTranslation } from 'react-i18next';

dayjs.extend(calendar);

const Row = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 0.9rem;
  align-items: center;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  transition: background var(--transition-fast), border-color var(--transition-fast);

  :hover {
    background: rgba(255, 255, 255, 0.035);
    border-color: rgba(124, 181, 24, 0.25);
  }
`;

const IconBubble = styled.div<{ tone: 'in' | 'out' | 'transfer' }>`
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: ${({ tone }) =>
    tone === 'in'
      ? 'rgba(61, 207, 122, 0.15)'
      : tone === 'out'
        ? 'rgba(232, 92, 74, 0.15)'
        : 'rgba(124, 181, 24, 0.15)'};
  color: ${({ tone }) =>
    tone === 'in'
      ? theme.palette.success.main
      : tone === 'out'
        ? theme.palette.error.main
        : theme.palette.primary.main};

  svg {
    font-size: 1.15rem;
  }
`;

const Main = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const Message = styled.div<{ isLimitedSpace?: boolean }>`
  font-size: 0.92rem;
  font-weight: 600;
  color: ${theme.palette.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${({ isLimitedSpace }) => isLimitedSpace && `max-width: 14rem`};
`;

const Meta = styled.div`
  font-size: 0.72rem;
  color: ${theme.palette.text.disabled};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Side = styled.div`
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  align-items: flex-end;
`;

const Amount = styled.div<{ tone: 'in' | 'out' | 'transfer' }>`
  font-size: 0.98rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${({ tone }) =>
    tone === 'in'
      ? theme.palette.success.main
      : tone === 'out'
        ? theme.palette.error.main
        : theme.palette.primary.light};
`;

const DateText = styled.div`
  font-size: 0.7rem;
  color: ${theme.palette.text.disabled};
`;

const TransactionItem: React.FC<{ transaction: Transaction; isLimitedSpace?: boolean }> = ({
  isLimitedSpace,
  transaction,
  ...rest
}) => {
  const { t } = useTranslation();
  const { message, amount, id, createdAt, toAccount, fromAccount, type } = transaction;
  const config = useConfig();
  const createdAtDate = dayjs(createdAt);
  const isOutgoing = type === TransactionType.Outgoing;
  const isIncoming = type === TransactionType.Incoming;
  const tone = isOutgoing ? 'out' : isIncoming ? 'in' : 'transfer';

  const routeLabel = !isLimitedSpace
    ? [fromAccount?.accountName, toAccount?.accountName].filter(Boolean).join(' → ')
    : undefined;

  return (
    <Row key={id} {...rest}>
      <IconBubble tone={tone}>
        {isOutgoing && <ArrowDownwardRounded />}
        {isIncoming && <ArrowUpwardRounded />}
        {!isOutgoing && !isIncoming && <ArrowForwardRounded />}
      </IconBubble>

      <Main>
        <Message isLimitedSpace={isLimitedSpace}>{message}</Message>
        <Meta>
          {routeLabel ? `${routeLabel} · ` : ''}
          {createdAtDate.fromNow()}
        </Meta>
      </Main>

      <Side>
        <Amount tone={tone}>{formatMoney(amount, config.general)}</Amount>
        {!isLimitedSpace && (
          <DateText>{createdAtDate.format(t('DATE_FORMAT'))}</DateText>
        )}
      </Side>
    </Row>
  );
};

export default TransactionItem;
