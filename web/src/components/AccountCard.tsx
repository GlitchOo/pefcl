import styled from '@emotion/styled';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Account, AccountType } from '@typings/Account';
import { useConfig } from '../hooks/useConfig';
import { formatMoney } from '../utils/currency';
import theme from '../utils/theme';
import { BodyText } from './ui/Typography/BodyText';
import { Heading3, Heading5, Heading6 } from './ui/Typography/Headings';
import { IconButton, Skeleton, Stack } from '@mui/material';
import { ContentCopyRounded } from '@mui/icons-material';
import copy from 'copy-to-clipboard';

interface ContainerProps {
  isDisabled: boolean;
  accountType: AccountType;
  selected: boolean;
  compact: boolean;
}

const Container = styled.div<ContainerProps>`
  user-select: none;
  position: relative;
  width: 100%;
  height: 100%;
  padding: ${({ compact }) => (compact ? '0.85rem 1rem 1rem' : '1.15rem 1.25rem')};
  border-radius: var(--card-radius);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: ${({ compact }) => (compact ? '0.35rem' : '0.65rem')};
  cursor: pointer;
  transition: box-shadow var(--transition-fast), border-color var(--transition-fast);
  box-shadow: var(--shadow-card), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 2px solid transparent;
  background: ${({ accountType }) =>
    accountType === AccountType.Personal ? 'var(--card-personal)' : 'var(--card-shared)'};

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      125deg,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 40%,
      transparent 100%
    );
    pointer-events: none;
  }

  :hover {
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  }

  ${({ selected }) =>
    selected &&
    `
    border-color: ${theme.palette.primary.main};
    box-shadow: 0 0 0 1px ${theme.palette.primary.main}, 0 6px 18px rgba(124, 181, 24, 0.22);
  `};

  ${({ isDisabled }) =>
    isDisabled &&
    `
    opacity: 0.5;
    pointer-events: none;
  `}
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  position: relative;
  z-index: 1;
`;

const Balance = styled(Heading3)<{ compact?: boolean }>`
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
  text-shadow: var(--text-shadow);
  font-size: ${({ compact }) => (compact ? '1.35rem' : '1.75rem')};
  line-height: 1.15;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: rgba(0, 0, 0, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
`;

const DefaultBadge = styled(TypeBadge)`
  background: rgba(124, 181, 24, 0.35);
  border-color: rgba(124, 181, 24, 0.55);
  color: #fff;
`;

const AccountNumber = styled(Heading5)<{ compact?: boolean }>`
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.06em;
  position: relative;
  z-index: 1;
  font-size: ${({ compact }) => (compact ? '0.9rem' : '1.1rem')};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Label = styled(Heading6)`
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(240, 242, 245, 0.55);
  font-weight: 500;
  font-size: 0.62rem;
  line-height: 1.2;
  margin: 0;
`;

const Name = styled(BodyText)`
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.25;
  margin: 0;
`;

const Footer = styled.div<{ compact: boolean }>`
  margin-top: auto;
  padding-top: ${({ compact }) => (compact ? '0.2rem' : '0')};
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
`;

type AccountCardProps = {
  account: Account;
  selected?: boolean;
  withCopy?: boolean;
  isDisabled?: boolean;
  compact?: boolean;
};

export const AccountCard = ({
  account,
  selected = false,
  withCopy = false,
  isDisabled = false,
  compact = false,
  ...props
}: AccountCardProps) => {
  const { type, id, balance, isDefault, accountName, number } = account;
  const { t } = useTranslation();
  const config = useConfig();

  return (
    <Container
      {...props}
      key={id}
      accountType={type}
      selected={selected}
      isDisabled={isDisabled}
      compact={compact}
    >
      <Row>
        <Balance compact={compact}>{formatMoney(balance, config.general)}</Balance>
        <Stack direction="row" spacing={0.5} alignItems="center">
          {isDefault && <DefaultBadge>{t('Default')}</DefaultBadge>}
          <TypeBadge>{type === AccountType.Shared ? t('SHARED') : t('PERSONAL')}</TypeBadge>
        </Stack>
      </Row>

      <Stack direction="row" alignItems="center" sx={{ position: 'relative', zIndex: 1, minWidth: 0 }}>
        <AccountNumber compact={compact}>{number}</AccountNumber>
        {withCopy && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              copy(number);
            }}
            size="small"
            color="inherit"
            style={{ opacity: '0.55', marginLeft: '0.15rem', flexShrink: 0 }}
          >
            <ContentCopyRounded color="inherit" fontSize="small" />
          </IconButton>
        )}
      </Stack>

      <Footer compact={compact}>
        {!compact && <Label>{t('Account name')}</Label>}
        <Name>{accountName}</Name>
      </Footer>
    </Container>
  );
};

export const LoadingAccountCard = ({ compact = false }: { compact?: boolean }) => {
  return (
    <Container
      accountType={AccountType.Personal}
      selected={false}
      isDisabled={false}
      compact={compact}
    >
      <Row>
        <Balance compact={compact}>
          <Skeleton variant="text" width={120} />
        </Balance>
        <TypeBadge>
          <Skeleton variant="text" width={50} />
        </TypeBadge>
      </Row>

      <AccountNumber compact={compact}>
        <Skeleton variant="text" width="65%" />
      </AccountNumber>

      <Footer compact={compact}>
        {!compact && (
          <Label>
            <Skeleton variant="text" width={80} />
          </Label>
        )}
        <Name>
          <Skeleton variant="text" width={60} />
        </Name>
      </Footer>
    </Container>
  );
};
