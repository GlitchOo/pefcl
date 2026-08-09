import React, { useState } from 'react';
import { Alert, FormHelperText, LinearProgress, Stack } from '@mui/material';
import { useAtom } from 'jotai';
import { accountsAtom, defaultAccountAtom } from '../data/accounts';
import { Heading6 } from './ui/Typography/Headings';
import AccountSelect from './AccountSelect';
import Button from './ui/Button';
import { useTranslation } from 'react-i18next';
import PriceField from './ui/Fields/PriceField';
import { fetchNui } from '../utils/fetchNui';
import { transactionBaseAtom } from 'src/data/transactions';
import { TransactionEvents } from '@typings/Events';
import { CreateTransferInput, TransferType } from '@typings/Transaction';
import { externalAccountsAtom } from '@data/externalAccounts';
import { GenericErrors } from '@typings/Errors';
import NewBalance from './ui/NewBalance';
import BankPanel from './ui/BankPanel';
import styled from '@emotion/styled';
import theme from '@utils/theme';
import { formatMoney } from '@utils/currency';
import { useConfig } from '@hooks/useConfig';

const Page = styled.div`
  display: grid;
  grid-template-columns: minmax(16rem, 0.85fr) minmax(0, 1.5fr);
  gap: 1.15rem;
  align-items: stretch;
  height: 100%;
  min-height: 0;
`;

const SummaryCard = styled(BankPanel)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  background:
    radial-gradient(circle at 0% 0%, rgba(124, 181, 24, 0.18), transparent 50%),
    var(--bg-card);
  border-color: rgba(124, 181, 24, 0.22);
`;

const Balance = styled.div`
  font-size: 1.85rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1.15;
  color: ${theme.palette.primary.light};
`;

const FormCard = styled(BankPanel)`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const TransferFunds: React.FC<{ onClose?(): void }> = ({ onClose }) => {
  const { t } = useTranslation();
  const config = useConfig();
  const [amount, setAmount] = useState('');
  const [accounts, updateAccounts] = useAtom(accountsAtom);
  const [, updateTransactions] = useAtom(transactionBaseAtom);
  const [defaultAccount] = useAtom(defaultAccountAtom);
  const [externalAccounts] = useAtom(externalAccountsAtom);
  const [fromAccountId, setFromAccountId] = useState(defaultAccount?.id ?? 0);
  const [toAccountId, setToAccountID] = useState(0);
  const [isTransfering, setIsTransfering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const parsedAmount = Number(amount.replace(/\D/g, ''));
  const fromAccount = accounts.find((account) => account.id === fromAccountId);

  const isExternalTransfer = externalAccounts.some((e) => e.id === toAccountId);
  const message = isExternalTransfer ? t('External transfer') : t('Internal transfer');
  const type = isExternalTransfer ? TransferType.External : TransferType.Internal;

  const handleTransfer = async () => {
    setIsTransfering(true);
    setError('');
    setSuccess('');

    const payload: CreateTransferInput = {
      type,
      message,
      amount: parsedAmount,
      fromAccountId,
      toAccountId: toAccountId,
    };

    try {
      await fetchNui(TransactionEvents.CreateTransfer, payload);
      await updateAccounts();
      await updateTransactions();
      onClose?.();
      setAmount('');
      setSuccess(t('Successfully transferred funds'));
    } catch (error: Error | unknown) {
      if (error instanceof Error && error.message === GenericErrors.NotFound) {
        setError(t('No account found to receive transfer.'));
      } else {
        setError(t('Something went wrong, please try again later.'));
      }
    }

    setIsTransfering(false);
  };

  const isAmountTooHigh = fromAccount && fromAccount.balance < parsedAmount;
  const isAmountTooLow = parsedAmount <= 0;
  const isToAccountSelected = toAccountId > 0;
  const isSameAccount = toAccountId === fromAccountId;
  const isDisabled =
    isSameAccount || !parsedAmount || !isToAccountSelected || isAmountTooHigh || isAmountTooLow;

  const rawValue = parseInt(amount.replace(/\D/g, ''));
  const value = isNaN(rawValue) ? 0 : rawValue;
  const newBalance = (fromAccount?.balance ?? 0) - value;
  const isValidNewBalance = newBalance >= 0;

  return (
    <Page>
      <SummaryCard title={t('From balance')}>
        <div>
          <Heading6>{fromAccount?.accountName ?? t('Select an account')}</Heading6>
          <Balance>
            {formatMoney(fromAccount?.balance ?? 0, config.general)}
          </Balance>
        </div>
        <Heading6>
          {isExternalTransfer ? t('External transfer') : t('Internal transfer')}
        </Heading6>
      </SummaryCard>

      <FormCard title={t('Transfer details')}>
        <Stack spacing={2.25} flex={1}>
          <Grid>
            <Stack spacing={0.85}>
              <Heading6>{t('From account')}</Heading6>
              <AccountSelect
                isFromAccount
                onSelect={setFromAccountId}
                accounts={accounts}
                selectedId={fromAccountId}
              />
            </Stack>

            <Stack spacing={0.85}>
              <Heading6>{t('To account')}</Heading6>
              <AccountSelect
                onSelect={setToAccountID}
                accounts={accounts}
                selectedId={toAccountId}
                externalAccounts={externalAccounts}
              />
            </Stack>
          </Grid>

          <Stack spacing={0.85}>
            <Heading6>{t('Amount')}</Heading6>
            <PriceField
              placeholder={t('Amount')}
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
            <NewBalance amount={newBalance} isValid={isValidNewBalance} />
          </Stack>

          <FormHelperText error={Boolean(error)}>{error}</FormHelperText>
          {success && <Alert color="success">{success}</Alert>}

          <Stack mt="auto" alignItems="flex-end">
            <Button disabled={isDisabled} onClick={handleTransfer}>
              {t('Transfer funds')}
            </Button>
          </Stack>
        </Stack>
        {isTransfering && <LinearProgress color="primary" sx={{ mt: 2 }} />}
      </FormCard>
    </Page>
  );
};

export default TransferFunds;
