import { AccountCard, LoadingAccountCard } from '@components/AccountCard';
import CreateAccountModal from '@components/modals/CreateAccount';
import { orderedAccountsAtom } from '@data/accounts';
import styled from '@emotion/styled';
import { useConfig } from '@hooks/useConfig';
import { Add } from '@mui/icons-material';
import { Dialog } from '@mui/material';
import theme from '@utils/theme';
import { useAtom } from 'jotai';
import React, { useState } from 'react';

const Cards = styled.div<{ compact: boolean }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${({ compact }) => (compact ? '200px' : '240px')}, 1fr));
  gap: 0.85rem;
  width: 100%;
  align-items: stretch;
`;

const CardSlot = styled.div<{ compact: boolean }>`
  min-width: 0;
  height: ${({ compact }) => (compact ? '8rem' : '9.5rem')};
`;

const CreateCard = styled.button<{ compact: boolean }>`
  appearance: none;
  width: 100%;
  height: ${({ compact }) => (compact ? '8rem' : '9.5rem')};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.35rem;
  border-radius: var(--card-radius);
  border: 1px dashed ${theme.palette.text.disabled};
  color: ${theme.palette.text.secondary};
  background: rgba(124, 181, 24, 0.06);

  :hover:not(:disabled) {
    color: ${theme.palette.primary.main};
    border-color: ${theme.palette.primary.main};
    background: var(--accent-muted);
  }

  :disabled {
    opacity: 0.5;
    cursor: default;
  }

  svg {
    font-size: 1.75rem;
  }

  span {
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
`;

interface AccountCardsProps {
  selectedAccountId?: number;
  onSelectAccount?: (id: number) => void;
  compact?: boolean;
}

const AccountCards = ({
  onSelectAccount,
  selectedAccountId,
  compact = false,
}: AccountCardsProps) => {
  const config = useConfig();
  const [orderedAccounts] = useAtom(orderedAccountsAtom);
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  const canCreate = orderedAccounts.length < (config.accounts.maximumNumberOfAccounts || 4);

  return (
    <>
      <Dialog
        open={isCreateAccountOpen}
        onClose={() => setIsCreateAccountOpen(false)}
        maxWidth="md"
        fullWidth
        hideBackdrop
      >
        <CreateAccountModal onClose={() => setIsCreateAccountOpen(false)} />
      </Dialog>

      <Cards compact={compact}>
        {orderedAccounts.map((account) => (
          <CardSlot key={account.id} compact={compact} onClick={() => onSelectAccount?.(account.id)}>
            <AccountCard
              account={account}
              selected={account.id === selectedAccountId}
              withCopy
              compact={compact}
            />
          </CardSlot>
        ))}

        {canCreate && (
          <CardSlot compact={compact}>
            <CreateCard type="button" compact={compact} onClick={() => setIsCreateAccountOpen(true)}>
              <Add />
              <span>New</span>
            </CreateCard>
          </CardSlot>
        )}
      </Cards>
    </>
  );
};

export const LoadingCards = ({ compact = false }: { compact?: boolean }) => {
  return (
    <Cards compact={compact}>
      <CardSlot compact={compact}>
        <LoadingAccountCard compact={compact} />
      </CardSlot>
      <CardSlot compact={compact}>
        <LoadingAccountCard compact={compact} />
      </CardSlot>
      <CardSlot compact={compact}>
        <LoadingAccountCard compact={compact} />
      </CardSlot>
      <CardSlot compact={compact}>
        <CreateCard type="button" compact={compact} disabled>
          <Add />
          <span>New</span>
        </CreateCard>
      </CardSlot>
    </Cards>
  );
};

export default AccountCards;
