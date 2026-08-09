import AccountSelect from '@components/AccountSelect';
import Button from '@components/ui/Button';
import PriceField from '@components/ui/Fields/PriceField';
import NewBalance from '@components/ui/NewBalance';
import { Heading2, Heading5 } from '@components/ui/Typography/Headings';
import { accountsAtom } from '@data/accounts';
import { externalAccountsAtom } from '@data/externalAccounts';
import { transactionBaseAtom } from '@data/transactions';
import { useConfig } from '@hooks/useConfig';
import { useGlobalSettings } from '@hooks/useGlobalSettings';
import { Alert, Stack } from '@mui/material';
import { Box } from '@mui/system';
import { GenericErrors } from '@typings/Errors';
import { TransactionEvents } from '@typings/Events';
import { CreateTransferInput, TransferType } from '@typings/Transaction';
import { formatMoney } from '@utils/currency';
import { fetchNui } from '@utils/fetchNui';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const MobileTransferView = () => {
  const { t } = useTranslation();
  const { general } = useConfig();
  const { isTablet } = useGlobalSettings();

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedFromAccountId, setSelectedFromAccountId] = useState<number>();
  const [selectedToAccountId, setSelectedToAccountId] = useState<number>();
  const [accounts, updateAccounts] = useAtom(accountsAtom);
  const [externalAccounts, updateExternalAccounts] = useAtom(externalAccountsAtom);
  const [, updateTransactions] = useAtom(transactionBaseAtom);

  const selectedFromAccount = accounts.find((account) => account.id === selectedFromAccountId);

  const rawValue = parseInt(amount.replace(/\D/g, ''));
  const value = isNaN(rawValue) ? 0 : rawValue;
  const newBalance = (selectedFromAccount?.balance ?? 0) - value;
  const isValidNewBalance = newBalance >= 0;
  const isValidTransaction =
    Boolean(amount) && value > 0 && selectedFromAccountId && selectedToAccountId;
  const isSameAccount = selectedFromAccountId === selectedToAccountId;
  const isButtonDisabled = !isValidNewBalance || !isValidTransaction || isSameAccount || isLoading;

  const isExternalTransfer = externalAccounts.some((e) => e.id === selectedToAccountId);
  const message = isExternalTransfer ? t('External transfer') : t('Internal transfer');
  const type = isExternalTransfer ? TransferType.External : TransferType.Internal;

  const handleTransfer = async () => {
    if (!selectedFromAccountId || !selectedToAccountId) {
      return;
    }

    setIsLoading(true);
    const transfer: CreateTransferInput = {
      amount: value,
      fromAccountId: selectedFromAccountId,
      toAccountId: selectedToAccountId,
      message,
      type,
    };

    try {
      await fetchNui(TransactionEvents.CreateTransfer, transfer);
      setSuccess(
        t('Successfully transferred {{amount}}.', { amount: formatMoney(value, general) }),
      );
      setIsLoading(false);
      updateAccounts();
      updateExternalAccounts();
      updateTransactions();
      setAmount('');
    } catch (error: Error | unknown) {
      if (error instanceof Error && error.message === GenericErrors.NotFound) {
        setError(t('No account found to receive transfer.'));
      } else {
        setError(t('Something went wrong, please try again later.'));
      }
      setIsLoading(false);
      updateAccounts();
      updateExternalAccounts();
      updateTransactions();
    }
  };

  return (
    <Box
      px={0}
      pt={0}
      pb={2}
      sx={{ height: '100%', minHeight: 0, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}
    >
      <Stack spacing={0.35}>
        <Heading2 style={{ fontSize: isTablet ? '1.55rem' : '1.35rem' }}>
          {t('Transfer funds')}
        </Heading2>
        <Heading5>{t('Transfer between internal & external accounts.')}</Heading5>
      </Stack>

      <Stack
        spacing={2.25}
        marginTop={2.5}
        direction={isTablet ? 'row' : 'column'}
        alignItems={isTablet ? 'flex-start' : undefined}
      >
        <Stack spacing={2.25} flex={1} width="100%">
          <Stack spacing={0.75}>
            <Heading5>{t('From account')}</Heading5>
            <AccountSelect
              isFromAccount
              accounts={accounts}
              onSelect={setSelectedFromAccountId}
              selectedId={selectedFromAccountId}
            />
          </Stack>

          <Stack spacing={0.75}>
            <Heading5>{t('To account')}</Heading5>
            <AccountSelect
              accounts={accounts}
              externalAccounts={externalAccounts}
              onSelect={setSelectedToAccountId}
              selectedId={selectedToAccountId}
            />
          </Stack>
        </Stack>

        <Stack spacing={2.25} flex={1} width="100%">
          <Stack spacing={0.75}>
            <Heading5>{t('Amount')}</Heading5>
            <PriceField value={amount} onChange={(event) => setAmount(event.target.value)} />
            <NewBalance amount={newBalance} isValid={isValidNewBalance} />
          </Stack>

          <Button size="large" onClick={handleTransfer} disabled={isButtonDisabled}>
            {t('Transfer funds')}
          </Button>

          {success && (
            <Alert color="info" variant="outlined" sx={{ color: '#fff' }}>
              {success}
            </Alert>
          )}
          {error && (
            <Alert color="error" variant="outlined" sx={{ color: '#fff' }}>
              {error}
            </Alert>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default MobileTransferView;
