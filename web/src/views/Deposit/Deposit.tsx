import AccountSelect from '@components/AccountSelect';
import Layout from '@components/Layout';
import BankPanel from '@components/ui/BankPanel';
import Button from '@components/ui/Button';
import PriceField from '@components/ui/Fields/PriceField';
import NewBalance from '@components/ui/NewBalance';
import { Heading6 } from '@components/ui/Typography/Headings';
import { accountsAtom } from '@data/accounts';
import { transactionBaseAtom } from '@data/transactions';
import { useConfig } from '@hooks/useConfig';
import { Error } from '@mui/icons-material';
import { Alert, LinearProgress, Stack, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { AtmInput } from '@typings/Account';
import { BalanceErrors } from '@typings/Errors';
import { AccountEvents, CashEvents } from '@typings/Events';
import { formatMoney } from '@utils/currency';
import { fetchNui } from '@utils/fetchNui';
import theme from '@utils/theme';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Page = styled.div`
  display: grid;
  grid-template-columns: minmax(16rem, 0.9fr) minmax(0, 1.4fr);
  gap: 1.15rem;
  align-items: stretch;
  height: 100%;
  min-height: 0;
`;

const SummaryCard = styled(BankPanel)`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  height: 100%;
  background:
    radial-gradient(circle at 0% 0%, rgba(124, 181, 24, 0.18), transparent 50%),
    var(--bg-card);
  border-color: rgba(124, 181, 24, 0.22);
`;

const CashValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1.15;
  color: ${theme.palette.primary.light};
`;

const Tip = styled(Typography)`
  color: ${theme.palette.text.disabled};
  line-height: 1.45;
`;

const FormCard = styled(BankPanel)`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Deposit = () => {
  const { t } = useTranslation();
  const [currentCash, setCurrentCash] = useState(0);
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, updateAccounts] = useAtom(accountsAtom);
  const [, updateTransactions] = useAtom(transactionBaseAtom);
  const [selectedAccountId, setSelectedAccountId] = useState<number>();
  const [accounts] = useAtom(accountsAtom);
  const { general } = useConfig();

  const rawValue = parseInt(amount.replace(/\D/g, ''));
  const value = isNaN(rawValue) ? 0 : rawValue;
  const newCash = currentCash - value;
  const isValidNewBalance = newCash >= 0;
  const isValidTransaction = Boolean(amount) && value > 0 && selectedAccountId;
  const isButtonDisabled = !isValidNewBalance || !isValidTransaction || isLoading;

  useEffect(() => {
    fetchNui<number>(CashEvents.GetMyCash).then((cash) => setCurrentCash(cash ?? 0));
  }, [success]);

  const handleDeposit = () => {
    const payload: AtmInput = {
      amount: value,
      message: t('Deposited {{amount}} into account.', { amount: formatMoney(value, general) }),
      accountId: selectedAccountId,
    };

    setSuccess('');
    setError('');
    setIsLoading(true);
    fetchNui<AtmInput>(AccountEvents.DepositMoney, payload)
      .then(() => {
        setAmount('');
        setCurrentCash(newCash);
        updateAccounts();
        updateTransactions();
        setSuccess(
          t('Successfully deposited {{amount}} into selected account.', {
            amount: formatMoney(value, general),
          }),
        );
      })
      .catch((err: Error) => {
        if (err.message === BalanceErrors.InsufficentFunds) {
          setError(t('Insufficent funds'));
          return;
        }

        setError(err.message ?? t('Something went wrong'));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Layout title={t('Deposit')} subtitle={t('Move cash on hand into a Fleeca account')}>
      <Page>
        <SummaryCard title={t('On hand')}>
          <div>
            <Heading6>{t('Current cash')}</Heading6>
            <CashValue>{formatMoney(currentCash, general)}</CashValue>
          </div>
          <Tip variant="body2">
            {t('This will take cash from your person and insert into selected bank account')}
          </Tip>
        </SummaryCard>

        <FormCard title={t('Deposit details')}>
          <Stack spacing={2.25} flex={1}>
            <Stack spacing={0.85}>
              <Heading6>{t('Amount')}</Heading6>
              <PriceField
                placeholder={t('Amount')}
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
              <NewBalance amount={newCash} isValid={isValidNewBalance} newBalanceText={t('New cash')} />
            </Stack>

            <Stack spacing={0.85}>
              <Heading6>{t('Destination account')}</Heading6>
              <AccountSelect
                accounts={accounts}
                isFromAccount={false}
                onSelect={setSelectedAccountId}
                selectedId={selectedAccountId}
              />
            </Stack>

            <Stack spacing={1.25} mt="auto">
              <Button size="large" disabled={isButtonDisabled} onClick={handleDeposit}>
                {t('Deposit')}
              </Button>
              {success && <Alert color="success">{success}</Alert>}
              {error && (
                <Alert icon={<Error />} color="error">
                  {error}
                </Alert>
              )}
              {isLoading && <LinearProgress color="primary" />}
            </Stack>
          </Stack>
        </FormCard>
      </Page>
    </Layout>
  );
};

export default Deposit;
