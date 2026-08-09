import styled from '@emotion/styled';
import {
  AddRounded,
  ReceiptLongRounded,
  RemoveRounded,
  SwapHorizRounded,
} from '@mui/icons-material';
import { Badge } from '@mui/material';
import { totalUnpaidInvoicesAtom } from '@data/invoices';
import theme from '@utils/theme';
import { useAtomValue } from 'jotai';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const Grid = styled.div<{ compact?: boolean; twoCol?: boolean }>`
  display: grid;
  grid-template-columns: ${({ twoCol, compact }) =>
    twoCol || compact ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))'};
  gap: ${({ compact }) => (compact ? '0.65rem' : '0.85rem')};
`;

const Action = styled.button`
  appearance: none;
  border: 1px solid var(--glass-border);
  background: var(--bg-card);
  color: var(--text-primary);
  border-radius: var(--card-radius);
  padding: 0.65rem 0.5rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  transition: background var(--transition-fast), border-color var(--transition-fast),
    color var(--transition-fast);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);

  svg {
    font-size: 1.25rem;
    color: ${theme.palette.primary.main};
  }

  span {
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${theme.palette.text.secondary};
  }

  :hover {
    background: var(--bg-card-hover);
    border-color: var(--border-accent);

    span {
      color: ${theme.palette.text.primary};
    }
  }
`;

export interface QuickActionPaths {
  transfer: string;
  deposit: string;
  withdraw: string;
  invoices: string;
}

const defaultPaths: QuickActionPaths = {
  transfer: '/transfer',
  deposit: '/deposit',
  withdraw: '/withdraw',
  invoices: '/invoices',
};

interface QuickActionsProps {
  compact?: boolean;
  paths?: Partial<QuickActionPaths>;
  hideDepositWithdraw?: boolean;
}

const QuickActions = ({
  compact = false,
  paths: pathOverrides,
  hideDepositWithdraw = false,
}: QuickActionsProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const unpaid = useAtomValue(totalUnpaidInvoicesAtom);
  const paths = { ...defaultPaths, ...pathOverrides };

  return (
    <Grid compact={compact} twoCol={hideDepositWithdraw}>
      <Action type="button" onClick={() => navigate(paths.transfer)}>
        <SwapHorizRounded />
        <span>{t('Transfer')}</span>
      </Action>
      {!hideDepositWithdraw && (
        <>
          <Action type="button" onClick={() => navigate(paths.deposit)}>
            <AddRounded />
            <span>{t('Deposit')}</span>
          </Action>
          <Action type="button" onClick={() => navigate(paths.withdraw)}>
            <RemoveRounded />
            <span>{t('Withdraw')}</span>
          </Action>
        </>
      )}
      <Action type="button" onClick={() => navigate(paths.invoices)}>
        <Badge color="error" badgeContent={unpaid} invisible={!unpaid}>
          <ReceiptLongRounded />
        </Badge>
        <span>{t('Invoices')}</span>
      </Action>
    </Grid>
  );
};

export default QuickActions;
