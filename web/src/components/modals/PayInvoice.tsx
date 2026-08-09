import styled from '@emotion/styled';
import { CloseRounded } from '@mui/icons-material';
import { IconButton, Stack } from '@mui/material';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import relative from 'dayjs/plugin/relativeTime';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InvoiceEvents } from '@typings/Events';
import { Invoice, PayInvoiceInput } from '@typings/Invoice';
import { accountsAtom, defaultAccountAtom } from '../../data/accounts';
import { invoicesAtom } from '../../data/invoices';
import { transactionBaseAtom } from '../../data/transactions';
import { useConfig } from '../../hooks/useConfig';
import { useGlobalSettings } from '@hooks/useGlobalSettings';
import { formatMoney } from '../../utils/currency';
import { fetchNui } from '../../utils/fetchNui';
import theme from '../../utils/theme';
import AccountSelect from '../AccountSelect';
import Summary from '../Summary';
import Button from '../ui/Button';
import { BodyText } from '../ui/Typography/BodyText';
import { Heading2, Heading5, Heading6 } from '../ui/Typography/Headings';

dayjs.extend(calendar);
dayjs.extend(relative);

const Shell = styled.div<{ isMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  height: ${({ isMobile }) => (isMobile ? '100%' : 'auto')};
  min-height: 0;
  background: ${({ isMobile }) =>
    isMobile ? theme.palette.background.default : theme.palette.background.paper};
`;

const TopBar = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const Title = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${theme.palette.text.secondary};
`;

const ScrollArea = styled.div<{ isMobile?: boolean; isTablet?: boolean }>`
  flex: 1;
  min-height: 0;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  padding: ${({ isMobile }) => (isMobile ? '0 0 1rem' : '2rem')};
  display: flex;
  flex-direction: column;
  gap: ${({ isMobile, isTablet }) => (isTablet ? '1rem' : isMobile ? '0.85rem' : '0')};
`;

const Hero = styled.div`
  padding: 1.15rem 1.1rem;
  border-radius: 14px;
  background:
    radial-gradient(ellipse 80% 80% at 100% 0%, rgba(232, 92, 74, 0.18), transparent 55%),
    rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(232, 92, 74, 0.22);
`;

const From = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${theme.palette.text.secondary};
  margin-bottom: 0.35rem;
`;

const HeroAmount = styled.div`
  font-size: 2rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  color: ${theme.palette.error.main};
  line-height: 1.1;
`;

const Panel = styled.div`
  padding: 1rem 1.05rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`;

const DetailRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DetailLabel = styled.div`
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${theme.palette.text.disabled};
`;

const DetailValue = styled.div`
  font-size: 0.92rem;
  font-weight: 500;
  line-height: 1.45;
  color: ${theme.palette.text.primary};
  word-break: break-word;
`;

const DesktopAmount = styled.div`
  font-size: 1.35rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${theme.palette.error.main};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const Actions = styled.div<{ isMobile?: boolean }>`
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  padding: ${({ isMobile }) => (isMobile ? '0.9rem 0 0' : '0 2rem 2rem')};
  border-top: ${({ isMobile }) => (isMobile ? '1px solid var(--border-color)' : 'none')};
  background: ${({ isMobile }) =>
    isMobile ? theme.palette.background.default : theme.palette.background.paper};

  button {
    ${({ isMobile }) => isMobile && 'flex: 1; min-height: 2.85rem;'}
  }
`;

const Warning = styled.div`
  font-size: 0.78rem;
  font-weight: 600;
  color: ${theme.palette.error.main};
`;

const TabletGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1rem;
  align-items: start;
`;

interface PayInvoiceModalProps {
  invoice: Invoice;
  onClose(): void;
}

const PayInvoiceModal = ({ onClose, invoice }: PayInvoiceModalProps) => {
  const { isMobile, isTablet } = useGlobalSettings();
  const [accounts, updateAccounts] = useAtom(accountsAtom);
  const [defaultAccount] = useAtom(defaultAccountAtom);
  const [, updateInvoices] = useAtom(invoicesAtom);
  const [, updateTransactions] = useAtom(transactionBaseAtom);
  const [selectedAccountId, setSelectedAccountId] = useState(0);
  const [isPaying, setIsPaying] = useState(false);
  const config = useConfig();
  const { t } = useTranslation();

  useEffect(() => {
    if (defaultAccount?.id) {
      setSelectedAccountId((current) => current || defaultAccount.id);
    }
  }, [defaultAccount?.id]);

  const expiresDate = invoice.expiresAt ? dayjs(invoice.expiresAt) : null;
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId);
  const hasEnoughFunds = (selectedAccount?.balance ?? 0) >= invoice.amount;

  const handlePayInvoice = () => {
    if (!selectedAccountId || isPaying) return;

    const payload: PayInvoiceInput = {
      fromAccountId: selectedAccountId,
      invoiceId: invoice.id,
    };

    setIsPaying(true);
    fetchNui(InvoiceEvents.PayInvoice, payload)
      .then(() => {
        updateInvoices();
        updateAccounts();
        updateTransactions();
      })
      .finally(() => {
        setIsPaying(false);
        onClose();
      });
  };

  if (!isMobile) {
    return (
      <Shell>
        <ScrollArea>
          <Stack spacing={4} direction="row">
            <Stack spacing={3} flex={1}>
              <Stack spacing={0.35}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
                  <Heading2>{t('Invoice')}</Heading2>
                  <DesktopAmount>{formatMoney(invoice.amount, config.general)}</DesktopAmount>
                </Stack>
                <Heading5>{invoice.from}</Heading5>
              </Stack>

              <Field>
                <Heading6>{t('Message')}</Heading6>
                <BodyText style={{ lineHeight: 1.45, wordBreak: 'break-word' }}>
                  {invoice.message}
                </BodyText>
              </Field>

              {expiresDate && (
                <Field>
                  <Heading6>{t('Expires')}</Heading6>
                  <BodyText>
                    {expiresDate.format(t('DATE_TIME_FORMAT'))} ({expiresDate.fromNow()})
                  </BodyText>
                </Field>
              )}
            </Stack>

            <Stack spacing={3} flex={1}>
              <Field>
                <Heading6>{t('Account')}</Heading6>
                <AccountSelect
                  isFromAccount
                  accounts={accounts}
                  onSelect={setSelectedAccountId}
                  selectedId={selectedAccountId}
                />
              </Field>

              <Summary balance={selectedAccount?.balance ?? 0} payment={invoice.amount} />

              <Stack direction="row" justifyContent="space-between">
                <Button color="error" onClick={onClose}>
                  {t('Cancel')}
                </Button>
                <Button
                  onClick={handlePayInvoice}
                  disabled={!selectedAccountId || !hasEnoughFunds || isPaying}
                >
                  {t('Pay invoice')}
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </ScrollArea>
      </Shell>
    );
  }

  const details = (
    <Panel>
      <DetailRow>
        <DetailLabel>{t('Message')}</DetailLabel>
        <DetailValue>{invoice.message}</DetailValue>
      </DetailRow>
      {expiresDate && (
        <DetailRow>
          <DetailLabel>{t('Expires')}</DetailLabel>
          <DetailValue>
            {expiresDate.format(t('DATE_TIME_FORMAT'))}
            <span style={{ color: theme.palette.text.disabled }}> · {expiresDate.fromNow()}</span>
          </DetailValue>
        </DetailRow>
      )}
    </Panel>
  );

  const payment = (
    <Panel>
      <Field>
        <DetailLabel>{t('Account')}</DetailLabel>
        <AccountSelect
          isFromAccount
          accounts={accounts}
          onSelect={setSelectedAccountId}
          selectedId={selectedAccountId}
        />
      </Field>

      <Summary balance={selectedAccount?.balance ?? 0} payment={invoice.amount} />

      {!hasEnoughFunds && selectedAccountId > 0 && (
        <Warning>{t('Insufficent funds')}</Warning>
      )}
    </Panel>
  );

  return (
    <Shell isMobile>
      <ScrollArea isMobile isTablet={isTablet}>
        <TopBar>
          <Title>{t('Invoice')}</Title>
          <IconButton
            size="small"
            onClick={onClose}
            aria-label={t('Cancel')}
            sx={{ color: theme.palette.text.secondary }}
          >
            <CloseRounded />
          </IconButton>
        </TopBar>

        <Hero>
          <From>{invoice.from}</From>
          <HeroAmount>{formatMoney(invoice.amount, config.general)}</HeroAmount>
        </Hero>

        {isTablet ? (
          <TabletGrid>
            {details}
            {payment}
          </TabletGrid>
        ) : (
          <>
            {details}
            {payment}
          </>
        )}
      </ScrollArea>

      <Actions isMobile>
        <Button color="error" onClick={onClose} disabled={isPaying}>
          {t('Cancel')}
        </Button>
        <Button
          onClick={handlePayInvoice}
          disabled={!selectedAccountId || !hasEnoughFunds || isPaying}
        >
          {t('Pay invoice')}
        </Button>
      </Actions>
    </Shell>
  );
};

export default PayInvoiceModal;
