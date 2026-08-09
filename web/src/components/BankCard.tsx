import { Stack } from '@mui/material';
import { Card, InventoryCard } from '@typings/BankCard';
import theme from '@utils/theme';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MasterCardIcon } from 'src/icons/MasterCardIcon';
import styled from '@emotion/styled';
import { BodyText } from './ui/Typography/BodyText';
import { Heading4, Heading6 } from './ui/Typography/Headings';

const Container = styled.div<{ selected: boolean; blocked: boolean }>`
  user-select: none;
  position: relative;
  width: 100%;
  min-height: 8rem;
  padding: 1.1rem 1.25rem;
  border-radius: var(--card-radius);
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow var(--transition-fast), border-color var(--transition-fast),
    transform var(--transition-fast);
  box-shadow: var(--shadow-card), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  border: 2px solid transparent;
  background: ${({ blocked }) => (blocked ? 'var(--card-blocked)' : 'var(--card-debit)')};

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      125deg,
      rgba(255, 255, 255, 0.12) 0%,
      transparent 42%,
      transparent 100%
    );
    pointer-events: none;
  }

  :hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.14);
    transform: translateY(-1px);
  }

  ${({ selected }) =>
    selected &&
    `
    border-color: ${theme.palette.primary.light};
    box-shadow: 0 0 0 1px ${theme.palette.primary.main}, 0 6px 20px rgba(124, 181, 24, 0.25);
  `}

  ${({ blocked }) =>
    blocked &&
    `
    opacity: 0.85;
  `}
`;

const Chip = styled.div`
  width: 2.1rem;
  height: 1.55rem;
  border-radius: 4px;
  background: linear-gradient(135deg, #e8d48b 0%, #c4a35a 45%, #a8873a 100%);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 3px;
    border: 1px solid rgba(0, 0, 0, 0.18);
    border-radius: 2px;
  }
`;

const Brand = styled(Heading6)`
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(240, 242, 245, 0.75);
  font-weight: 500;
`;

const CardNumber = styled(Heading4)`
  letter-spacing: 0.14em;
  font-variant-numeric: tabular-nums;
  text-shadow: var(--text-shadow);
`;

const Label = styled(Heading6)`
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(240, 242, 245, 0.55);
  font-weight: 500;
  font-size: 0.65rem;
`;

const Holder = styled(BodyText)`
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const StyledIcon = styled(MasterCardIcon)`
  color: rgba(240, 242, 245, 0.85);
  align-self: flex-end;
  width: 2.4rem;
  height: 1.6rem;
`;

const BlockedBadge = styled.span`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: rgba(232, 92, 74, 0.9);
  color: #fff;
`;

interface BankCardProps {
  card: Card | InventoryCard;
  isBlocked?: boolean;
  selected?: boolean;
}

const BankCard = ({ card, selected = false, isBlocked = false }: BankCardProps) => {
  const { t } = useTranslation();

  return (
    <Container selected={selected} blocked={isBlocked}>
      {isBlocked && <BlockedBadge>{t('Blocked')}</BlockedBadge>}
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Chip />
          <Brand>Fleeca</Brand>
        </Stack>

        <CardNumber>{card.number}</CardNumber>

        <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
          <Stack spacing={0.25}>
            <Label>{t('Card holder')}</Label>
            <Holder>{card.holder}</Holder>
          </Stack>
          <StyledIcon />
        </Stack>
      </Stack>
    </Container>
  );
};

export default BankCard;
