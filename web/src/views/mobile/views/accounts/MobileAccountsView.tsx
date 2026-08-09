import React from 'react';
import { AccountCard } from '@components/AccountCard';
import TotalBalance from '@components/TotalBalance';
import { Heading2, Heading5 } from '@components/ui/Typography/Headings';
import { accountsAtom } from '@data/accounts';
import { useGlobalSettings } from '@hooks/useGlobalSettings';
import { Stack } from '@mui/material';
import { Box } from '@mui/system';
import styled from '@emotion/styled';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';

const AccountGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem;
`;

const MobileAccountsView = () => {
  const { t } = useTranslation();
  const { isTablet } = useGlobalSettings();
  const [accounts] = useAtom(accountsAtom);

  return (
    <Box
      px={0}
      pt={0}
      pb={2}
      sx={{ height: '100%', minHeight: 0, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}
    >
      <Stack spacing={isTablet ? 2 : 2.5}>
        {isTablet && (
          <Stack spacing={0.35}>
            <Heading2 style={{ fontSize: '1.55rem' }}>{t('Accounts')}</Heading2>
            <Heading5>{t('Your accounts')}</Heading5>
          </Stack>
        )}

        <TotalBalance />

        {isTablet ? (
          <AccountGrid>
            {accounts.map((account) => (
              <AccountCard account={account} key={account.id} compact />
            ))}
          </AccountGrid>
        ) : (
          <Stack spacing={1}>
            {accounts.map((account) => (
              <AccountCard account={account} key={account.id} compact />
            ))}
          </Stack>
        )}

        {accounts.length <= 1 && (
          <Heading5>
            {t('You can create more accounts by visiting the nearest bank ..')}
          </Heading5>
        )}
      </Stack>
    </Box>
  );
};

export default MobileAccountsView;
