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
import { TABLET_SAFE } from '../safeArea';

export const SidebarWidth = '5.75rem';

const highlight = `
  color: ${theme.palette.primary.main};
  background: rgba(124, 181, 24, 0.14);
  box-shadow: inset 0 0 0 1px rgba(124, 181, 24, 0.22);

  span {
    color: ${theme.palette.primary.main};
    opacity: 1;
  }
`;

const Rail = styled.nav`
  width: ${SidebarWidth};
  flex-shrink: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: ${TABLET_SAFE.top} 0.65rem ${TABLET_SAFE.bottom};
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  background:
    linear-gradient(180deg, rgba(124, 181, 24, 0.08) 0%, transparent 40%),
    rgba(12, 18, 14, 0.96);
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding-bottom: 0.5rem;
  margin-bottom: 0.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const LogoMark = styled.div`
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 1.15rem;
  color: #0b110e;
  background: linear-gradient(145deg, #95d12a, #7cb518);
  box-shadow: 0 6px 16px rgba(124, 181, 24, 0.28);
`;

const BrandName = styled.span`
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${theme.palette.text.secondary};
`;

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
`;

const Tab = styled.li<{ isActive: boolean }>`
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.28rem;
  min-height: 3.65rem;
  padding: 0.55rem 0.25rem;
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
    font-size: 0.62rem;
    letter-spacing: 0.02em;
    line-height: 1;
    opacity: 0.9;
  }

  svg {
    font-size: 1.35rem;
  }
`;

const CountBadge = styled.div`
  position: absolute;
  top: 0.35rem;
  right: 0.35rem;
  min-width: 1.05rem;
  height: 1.05rem;
  padding: 0 0.28rem;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-size: 0.62rem;
  font-weight: 700;
  line-height: 1;
  color: #fff;
  background: ${theme.palette.error.main};
  box-shadow: 0 0 0 2px rgba(12, 18, 14, 0.95);
`;

interface ListItemProps {
  to: string;
  label: string;
  icon: ReactNode;
  badge?: ReactNode;
}

const ListItem = ({ to, icon, label, badge }: ListItemProps) => {
  return (
    <NavLink to={to} style={{ textDecoration: 'none' }}>
      {({ isActive }) => (
        <Tab isActive={isActive}>
          {badge}
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
  return <CountBadge>{unpaid > 99 ? '99+' : unpaid}</CountBadge>;
};

const MobileSidebar = () => {
  const { t } = useTranslation();

  return (
    <Rail>
      <Brand>
        <LogoMark>F</LogoMark>
        <BrandName>Fleeca</BrandName>
      </Brand>

      <NavList>
        <ListItem icon={<HomeRounded />} label={t('Home')} to="/mobile/dashboard" />
        <ListItem icon={<AccountBalanceRounded />} label={t('Accounts')} to="/mobile/accounts" />
        <ListItem icon={<SwapHorizRounded />} label={t('Pay')} to="/mobile/transfer" />
        <ListItem icon={<TimelineRounded />} label={t('Activity')} to="/mobile/transactions" />
        <ListItem
          icon={<ReceiptLongRounded />}
          label={t('Bills')}
          to="/mobile/invoices"
          badge={
            <Suspense fallback={null}>
              <UnpaidBadge />
            </Suspense>
          }
        />
      </NavList>
    </Rail>
  );
};

export default MobileSidebar;
