import { AccountCard } from '@components/AccountCard';
import Layout from '@components/Layout';
import { accountsAtom } from '@data/accounts';
import { Backdrop, Stack } from '@mui/material';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'motion/react';
import theme from '@utils/theme';
import BankCards from './components/BankCards';
import { selectedAccountIdAtom } from '@data/cards';
import { AccountType } from '@typings/Account';
import BankPanel from '@components/ui/BankPanel';

const Page = styled.div`
  position: relative;
  height: 100%;
  min-height: 0;
  overflow: auto;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0.85rem;
`;

const Modal = styled(motion.div)`
  z-index: 2;
  padding: 1.5rem 2rem;
  position: absolute;
  inset: 0;
  background-color: ${theme.palette.background.default};
  border-left: 1px solid var(--border-color);
`;

const CardsView = () => {
  const [selectedCardId, setSelectedCardId] = useState(0);
  const [selectedAccountId, setSelectedAccountId] = useAtom(selectedAccountIdAtom);
  const [accounts] = useAtom(accountsAtom);
  const { t } = useTranslation();

  return (
    <Layout title={t('Cards')} subtitle={t('Handle cards for your accounts')}>
      <Page>
        <BankPanel>          <CardGrid>
            {accounts.map((account) => (
              <div
                key={account.id}
                onClick={() =>
                  account.type !== AccountType.Shared && setSelectedAccountId(account.id)
                }
              >
                <AccountCard
                  account={account}
                  selected={account.id === selectedAccountId}
                  isDisabled={account.type === AccountType.Shared}
                  compact
                />
              </div>
            ))}
          </CardGrid>
        </BankPanel>

        <Backdrop
          open={Boolean(selectedAccountId)}
          onClick={() => {
            setSelectedAccountId(0);
            setSelectedCardId(0);
          }}
          sx={{ position: 'absolute' }}
        />

        <AnimatePresence>
          {Boolean(selectedAccountId) && (
            <Modal animate={{ x: 0 }} initial={{ x: 40 }} exit={{ x: 80, opacity: 0 }}>
              <BankCards
                selectedCardId={selectedCardId}
                onSelectCardId={setSelectedCardId}
                accountId={selectedAccountId}
                onClose={() => {
                  setSelectedAccountId(0);
                  setSelectedCardId(0);
                }}
              />
            </Modal>
          )}
        </AnimatePresence>
      </Page>
    </Layout>
  );
};

export default CardsView;
