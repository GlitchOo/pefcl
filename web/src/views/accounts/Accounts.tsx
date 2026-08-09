import TextField from '@components/ui/Fields/TextField';
import BankPanel from '@components/ui/BankPanel';
import styled from '@emotion/styled';
import { Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import { Box } from '@mui/system';
import copy from 'copy-to-clipboard';
import { AccountType } from '@typings/Account';
import { AccountEvents } from '@typings/Events';
import { getIsAdmin, getIsOwner } from '@utils/account';
import { useAtom } from 'jotai';
import React, { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { transactionBaseAtom } from 'src/data/transactions';
import Layout from '../../components/Layout';
import Button from '../../components/ui/Button';
import { PreHeading } from '../../components/ui/Typography/BodyText';
import { Heading1, Heading5, Heading6 } from '../../components/ui/Typography/Headings';
import { accountsAtom, defaultAccountAtom, totalBalanceAtom } from '../../data/accounts';
import { useConfig } from '../../hooks/useConfig';
import { formatMoney } from '../../utils/currency';
import { fetchNui } from '../../utils/fetchNui';
import theme from '../../utils/theme';
import AccountCards from '../dashboard/components/AccountCards';
import SharedSettings from './SharedSettings';

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  min-height: 0;
  height: 100%;
  overflow: auto;
`;

const Hero = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1.1rem 1.25rem;
  border-radius: var(--panel-radius);
  background:
    radial-gradient(circle at 0% 0%, rgba(124, 181, 24, 0.2), transparent 45%),
    var(--bg-card);
  border: 1px solid rgba(124, 181, 24, 0.2);
`;

const Balance = styled(Heading1)`
  font-size: 2.1rem;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
`;

const Actions = styled(BankPanel)`
  flex: 1;
`;

const Dangerzone = styled.div`
  border: 1px solid rgba(232, 92, 74, 0.45);
  background: rgba(232, 92, 74, 0.08);
  padding: ${theme.spacing(2.5)};
  border-radius: 12px;
`;

const HelperText = styled(Heading6)`
  font-weight: 450;
  color: ${theme.palette.text.disabled};
`;

const Accounts = () => {
  const config = useConfig();
  const { t } = useTranslation();
  const [totalBalance] = useAtom(totalBalanceAtom);
  const [accounts, updateAccounts] = useAtom(accountsAtom);
  const [, updateTransactions] = useAtom(transactionBaseAtom);
  const [defaultAccount] = useAtom(defaultAccountAtom);
  const [selectedAccountId, setSelectedAccountId] = useState<number>(defaultAccount?.id ?? 0);
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renameInput, setRenameInput] = useState('');

  const handleUpdateAccounts = () => {
    updateAccounts();
  };

  const handleSetDefault = () => {
    fetchNui(AccountEvents.SetDefaultAccount, { accountId: selectedAccountId })
      .then(handleUpdateAccounts)
      .catch((err) => {
        console.log({ err });
      });
  };

  const handleDeleteAccount = async () => {
    await fetchNui(AccountEvents.DeleteAccount, { accountId: selectedAccountId });
    await updateAccounts();
    await updateTransactions();
  };

  const handleRename = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchNui(AccountEvents.RenameAccount, { accountId: selectedAccountId, name: renameInput }).then(
      handleUpdateAccounts,
    );
    setIsRenameOpen(false);
  };

  useEffect(() => {
    if (selectedAccount?.accountName) {
      setRenameInput(selectedAccount.accountName);
    }
  }, [selectedAccount?.accountName]);

  const isAdmin = Boolean(selectedAccount && getIsAdmin(selectedAccount));
  const isOwner = Boolean(selectedAccount && getIsOwner(selectedAccount));
  const isShared = selectedAccount?.type === AccountType.Shared;
  const isDefaultAccountSelected = defaultAccount?.id === selectedAccountId;

  return (
    <Layout title={t('Accounts')} subtitle={t('Manage your Fleeca accounts and settings')}>
      <Page>
        <Dialog
          fullWidth
          maxWidth="xs"
          open={isRenameOpen}
          onClose={() => setIsRenameOpen(false)}
          hideBackdrop
        >
          <DialogTitle>{t('Rename account')}</DialogTitle>
          <form onSubmit={handleRename}>
            <DialogContent>
              <Stack spacing={2}>
                <TextField
                  autoFocus
                  placeholder={t('New account name')}
                  value={renameInput}
                  onChange={(event) => setRenameInput(event.target.value)}
                />

                <DialogActions>
                  <Button color="error" onClick={() => setIsRenameOpen(false)}>
                    {t('Cancel')}
                  </Button>
                  <Button type="submit">{t('Rename')}</Button>
                </DialogActions>
              </Stack>
            </DialogContent>
          </form>
        </Dialog>

        <Hero>
          <PreHeading>{t('Total balance')}</PreHeading>
          <Balance>{formatMoney(totalBalance, config.general)}</Balance>
        </Hero>

        <AccountCards
          onSelectAccount={setSelectedAccountId}
          selectedAccountId={selectedAccountId}
        />

        <Actions title={t('Account settings')}>
          <Stack direction="row" spacing={4} flexWrap="wrap" useFlexGap>
            <Stack spacing={2.5} flex={1} minWidth="18rem">
              <Heading5>{t('General')}</Heading5>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                <Stack spacing={0.75}>
                  <Button
                    onClick={handleSetDefault}
                    disabled={isDefaultAccountSelected || !isAdmin || isShared}
                  >
                    {t('Set account to default')}
                  </Button>
                  {!isAdmin && <HelperText>{t('Admin role required')}</HelperText>}
                  {isAdmin && isShared && (
                    <HelperText>{t('Shared account cannot be default account')}</HelperText>
                  )}
                </Stack>

                <Stack spacing={0.75}>
                  <Button onClick={() => setIsRenameOpen(true)} disabled={!isAdmin}>
                    {t('Rename account')}
                  </Button>
                  {!isAdmin && <HelperText>{t('Admin role required')}</HelperText>}
                </Stack>

                <Button onClick={() => copy(selectedAccount?.number ?? '')}>
                  {t('Copy account number')}
                </Button>
              </Stack>

              {isOwner && (
                <Stack spacing={1.25}>
                  <Heading5>{t('Danger zone')}</Heading5>
                  <Dangerzone>
                    <Stack spacing={1.25}>
                      <Button
                        color="error"
                        onClick={handleDeleteAccount}
                        disabled={isDefaultAccountSelected}
                      >
                        {t('Delete account')}
                      </Button>
                      <HelperText>
                        {isDefaultAccountSelected
                          ? t('You cannot delete the default account')
                          : t('Funds will be transfered to default account.')}
                      </HelperText>
                    </Stack>
                  </Dangerzone>
                </Stack>
              )}
            </Stack>

            <Box flex={1} minWidth="16rem">
              {isShared && <SharedSettings accountId={selectedAccountId} isAdmin={isAdmin} />}
            </Box>
          </Stack>
        </Actions>
      </Page>
    </Layout>
  );
};

export default Accounts;
