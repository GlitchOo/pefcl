import React, { useState } from 'react';

import styled from '@emotion/styled';
import calendar from 'dayjs/plugin/calendar';
import relative from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import theme from '@utils/theme';
import { Invoice, InvoiceStatus } from '@typings/Invoice';
import { useTranslation } from 'react-i18next';
import { useConfig } from '@hooks/useConfig';
import PayInvoiceModal from './modals/PayInvoice';
import { formatMoney } from '@utils/currency';
import Status from './ui/Status';
import BaseDialog from './modals/BaseDialog';
import { ReceiptLongRounded } from '@mui/icons-material';

dayjs.extend(calendar);
dayjs.extend(relative);

const isPaidStatus = (status: unknown) =>
  String(status ?? '')
    .trim()
    .toUpperCase() === InvoiceStatus.PAID;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.95rem 1rem 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
`;

const Top = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 0.75rem;
  align-items: start;
`;

const IconBubble = styled.div<{ tone?: 'pending' | 'paid' | 'expired' }>`
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 10px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  background: ${({ tone }) =>
    tone === 'paid'
      ? 'rgba(61, 207, 122, 0.15)'
      : tone === 'expired'
        ? 'rgba(232, 184, 74, 0.15)'
        : 'rgba(232, 92, 74, 0.15)'};
  color: ${({ tone }) =>
    tone === 'paid'
      ? theme.palette.success.main
      : tone === 'expired'
        ? theme.palette.warning.main
        : theme.palette.error.main};

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

const From = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${theme.palette.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Message = styled.div`
  font-size: 0.82rem;
  line-height: 1.4;
  color: ${theme.palette.text.secondary};
  word-break: break-word;
`;

const Amount = styled.div<{ muted?: boolean }>`
  font-size: 1rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${({ muted }) => (muted ? theme.palette.text.disabled : theme.palette.error.main)};
  white-space: nowrap;
  text-align: right;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.85rem;
  font-size: 0.72rem;
  color: ${theme.palette.text.disabled};
`;

const MetaItem = styled.span`
  white-space: nowrap;
`;

const PayButton = styled.button`
  appearance: none;
  width: 100%;
  min-height: 2.75rem;
  margin: 0;
  padding: 0.7rem 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: #0b110e;
  background: linear-gradient(180deg, ${theme.palette.primary.light}, ${theme.palette.primary.main});
  box-shadow: 0 6px 16px rgba(124, 181, 24, 0.22);

  &:hover {
    filter: brightness(1.06);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const PaidRow = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 0.55rem;
  border-top: 1px solid ${theme.palette.background.light8};
`;

const InvoiceItem: React.FC<{ invoice: Invoice }> = ({ invoice, ...props }) => {
  const { t } = useTranslation();
  const { message, amount, id, createdAt, expiresAt, from } = invoice;
  const config = useConfig();
  const expiresDate = expiresAt ? dayjs(expiresAt) : null;
  const createdDate = createdAt ? dayjs(createdAt) : null;
  const [isPayOpen, setIsPayOpen] = useState(false);
  const isPaid = isPaidStatus(invoice.status);
  const isExpired = !isPaid && !!expiresDate && expiresDate.isBefore(dayjs());
  const canPay = !isPaid && !isExpired;
  const tone = isPaid ? 'paid' : isExpired ? 'expired' : 'pending';

  const handleCloseModal = () => {
    setIsPayOpen(false);
  };

  return (
    <Card {...props} key={id}>
      <BaseDialog open={isPayOpen} onClose={handleCloseModal} maxWidth="md">
        {isPayOpen ? <PayInvoiceModal onClose={handleCloseModal} invoice={invoice} /> : null}
      </BaseDialog>

      <Top>
        <IconBubble tone={tone}>
          <ReceiptLongRounded />
        </IconBubble>

        <Main>
          <From title={from}>{from}</From>
          <Message>{message}</Message>
        </Main>

        <Amount muted={isPaid || isExpired}>{formatMoney(amount, config.general)}</Amount>
      </Top>

      <Meta>
        {createdDate && <MetaItem>{createdDate.fromNow()}</MetaItem>}
        {canPay && expiresDate && (
          <MetaItem>
            {t('Expires')} {expiresDate.format(t('DATE_FORMAT'))}
          </MetaItem>
        )}
        {isExpired && expiresDate && (
          <MetaItem>
            {t('Expired')} {expiresDate.format(t('DATE_FORMAT'))}
          </MetaItem>
        )}
      </Meta>

      {canPay && (
        <PayButton type="button" onClick={() => setIsPayOpen(true)}>
          {t('Pay invoice')}
        </PayButton>
      )}

      {isPaid && (
        <PaidRow>
          <Status label={t('Paid')} color="success" />
        </PaidRow>
      )}

      {isExpired && (
        <PaidRow>
          <Status label={t('Expired')} color="warning" />
        </PaidRow>
      )}
    </Card>
  );
};

export default InvoiceItem;
