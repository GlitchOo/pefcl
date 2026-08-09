import styled from '@emotion/styled';
import {
  AccountBalanceRounded,
  HomeRounded,
  ReceiptLongRounded,
  SwapHorizRounded,
  TimelineRounded,
} from '@mui/icons-material';
import theme from '@utils/theme';
import React, { ReactNode, Suspense } from 'react';
import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAtomValue } from 'jotai';
import { totalUnpaidInvoicesAtom } from '@data/invoices';

export const FooterHeight = '4.85rem';

const highlight = `
  color: ${theme.palette.primary.main};
  background: rgba(124, 181, 24, 0.14);
  box-shadow: inset 0 0 0 1px rgba(124, 181, 24, 0.22);

  span {
    color: ${theme.palette.primary.main};
    opacity: 1;
  }
`;

const Container = styled.nav`
  position: relative;
  z-index: 20;
  overflow: visible;
  padding: 0.45rem max(0.75rem, env(safe-area-inset-left, 0px))
    max(0.55rem, env(safe-area-inset-bottom, 0px)) max(0.75rem, env(safe-area-inset-right, 0px));
  pointer-events: none;
  background: linear-gradient(to top, rgba(11, 17, 14, 0.96) 55%, rgba(11, 17, 14, 0.85) 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.04);
`;

const DockWrap = styled.div`
  position: relative;
  overflow: visible;
  pointer-events: auto;
`;

const Dock = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0.35rem;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.15rem;
  border-radius: 1.15rem;
  background: rgba(16, 24, 20, 0.94);
  border: 1px solid rgba(124, 181, 24, 0.18);
  box-shadow:
    0 10px 28px rgba(0, 0, 0, 0.38),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);

  a {
    text-decoration: none;
    min-width: 0;
    display: block;
  }
`;

const Tab = styled.li<{ isActive: boolean }>`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.18rem;
  min-height: 3.15rem;
  padding: 0.35rem 0.2rem;
  border-radius: 0.85rem;
  color: ${theme.palette.text.disabled};
  transition:
    color var(--transition-fast),
    background-color var(--transition-fast),
    box-shadow var(--transition-fast);

  ${({ isActive }) => (isActive ? highlight : '')};

  :hover {
    ${highlight}
  }

  span {
    font-weight: 600;
    font-size: 0.58rem;
    letter-spacing: 0.02em;
    line-height: 1;
    opacity: 0.85;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  svg {
    font-size: 1.2rem;
  }
`;

const BillsCountBadge = styled.div`
  position: absolute;
  top: 0.1rem;
  right: calc(10% - 0.55rem);
  z-index: 50;
  min-width: 1.05rem;
  height: 1.05rem;
  padding: 0 0.28rem;
  border-radius: 999px;
  display: grid;
  place-items: center;
  pointer-events: none;
  font-size: 0.62rem;
  font-weight: 700;
  line-height: 1;
  color: #fff;
  background: ${theme.palette.error.main};
  box-shadow: 0 0 0 2px rgba(16, 24, 20, 0.95);
`;

interface ListItemProps {
  to: string;
  label: string;
  icon: ReactNode;
}

const ListItem = ({ to, icon, label }: ListItemProps) => {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <Tab isActive={isActive}>
          {icon}
          <span>{label}</span>
        </Tab>
      )}
    </NavLink>
  );
};

const UnpaidBadge = () => {
  const unpaid = useAtomValue(totalUnpaidInvoicesAtom);
  if (!unpaid) return null;
  return <BillsCountBadge>{unpaid > 99 ? '99+' : unpaid}</BillsCountBadge>;
};

const MobileFooter = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <DockWrap>
        <Dock>
          <ListItem icon={<HomeRounded />} label={t('Home')} to="/mobile/dashboard" />
          <ListItem icon={<AccountBalanceRounded />} label={t('Accounts')} to="/mobile/accounts" />
          <ListItem icon={<SwapHorizRounded />} label={t('Pay')} to="/mobile/transfer" />
          <ListItem icon={<TimelineRounded />} label={t('Activity')} to="/mobile/transactions" />
          <ListItem icon={<ReceiptLongRounded />} label={t('Bills')} to="/mobile/invoices" />
        </Dock>
        <Suspense fallback={null}>
          <UnpaidBadge />
        </Suspense>
      </DockWrap>
    </Container>
  );
};

export default MobileFooter;
