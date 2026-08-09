import React, { ReactNode } from 'react';
import {
  AccountBalanceRounded,
  Add,
  CreditCardRounded,
  DashboardRounded,
  Paid,
  Receipt,
  Remove,
  SwapHoriz,
} from '@mui/icons-material';
import styled from '@emotion/styled';
import theme from '@utils/theme';
import { Badge } from '@mui/material';
import { Link, useMatch } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Atom } from 'jotai';
import { totalUnpaidInvoicesAtom } from '@data/invoices';
import BadgeAtom from './ui/BadgeAtom';
import { useConfig } from '@hooks/useConfig';

const Nav = styled.nav`
  width: 12.5rem;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  padding: 1rem 0.75rem;
  background: linear-gradient(180deg, rgba(124, 181, 24, 0.06) 0%, transparent 8rem),
    var(--bg-secondary);
  border-right: 1px solid var(--border-color);

  a {
    text-decoration: none;
  }
`;

const BrandMark = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.35rem 0.65rem 1.1rem;
  margin-bottom: 0.35rem;
  border-bottom: 1px solid var(--border-color);
`;

const LogoMark = styled.div`
  width: 1.85rem;
  height: 1.85rem;
  border-radius: 8px;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 1rem;
  color: #0b110e;
  background: linear-gradient(145deg, #95d12a, #7cb518);
  box-shadow: 0 4px 12px rgba(124, 181, 24, 0.3);
`;

const BrandText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.1;

  strong {
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  span {
    font-size: 0.62rem;
    color: ${theme.palette.text.disabled};
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
`;

const List = styled.ul`
  margin: 0;
  padding: 0.5rem 0 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const ListItemContainer = styled.li<{ isActive: boolean }>`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.7rem;
  padding: 0.7rem 0.8rem;
  border-radius: 10px;
  color: ${theme.palette.text.secondary};
  transition: color var(--transition-fast), background-color var(--transition-fast);

  :hover {
    background-color: var(--accent-muted);
    color: ${theme.palette.text.primary};
  }

  ${({ isActive }) =>
    isActive &&
    `
      color: ${theme.palette.primary.light};
      background-color: var(--accent-muted);
      box-shadow: inset 3px 0 0 ${theme.palette.primary.main};
  `};

  span {
    font-weight: 550;
    font-size: 0.82rem;
    letter-spacing: 0.01em;
  }

  svg {
    font-size: 1.2rem;
    opacity: 0.95;
  }
`;

interface ListItemProps {
  to: string;
  label: string;
  icon: ReactNode;
  amount?: number;
  countAtom?: Atom<number | Promise<number>>;
}
const ListItem = ({ to, icon, label, amount, countAtom }: ListItemProps) => {
  const match = useMatch(to);

  return (
    <Link to={to}>
      <ListItemContainer isActive={!!match}>
        {countAtom ? (
          <BadgeAtom color="error" countAtom={countAtom}>
            {icon}
          </BadgeAtom>
        ) : (
          <Badge color="error" badgeContent={amount}>
            {icon}
          </Badge>
        )}

        <span>{label}</span>
      </ListItemContainer>
    </Link>
  );
};

const Sidebar = () => {
  const { t } = useTranslation();
  const config = useConfig();

  return (
    <Nav>
      <BrandMark>
        <LogoMark>F</LogoMark>
        <BrandText>
          <strong>Fleeca</strong>
          <span>{t('Banking')}</span>
        </BrandText>
      </BrandMark>

      <List>
        <ListItem to="../" icon={<DashboardRounded />} label={t('Dashboard')} />
        <ListItem to="../accounts" icon={<AccountBalanceRounded />} label={t('Accounts')} />
        <ListItem to="../transfer" icon={<SwapHoriz />} label={t('Transfer')} />
        <ListItem to="../transactions" icon={<Paid />} label={t('Transactions')} />
        <ListItem
          to="../invoices"
          icon={<Receipt />}
          label={t('Invoices')}
          countAtom={totalUnpaidInvoicesAtom}
        />
        <ListItem to="../deposit" icon={<Add />} label={t('Deposit')} />
        <ListItem to="../withdraw" icon={<Remove />} label={t('Withdraw')} />

        {config.frameworkIntegration.isCardsEnabled && (
          <ListItem to="../cards" icon={<CreditCardRounded />} label={t('Cards')} />
        )}
      </List>
    </Nav>
  );
};

export default Sidebar;
