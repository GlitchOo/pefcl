import { totalBalanceAtom } from '@data/accounts';
import { useConfig } from '@hooks/useConfig';
import { Stack } from '@mui/material';
import { formatMoney } from '@utils/currency';
import theme from '@utils/theme';
import styled from '@emotion/styled';
import { useAtom } from 'jotai';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PreHeading } from './ui/Typography/BodyText';
import { Heading1 } from './ui/Typography/Headings';

const Hero = styled(Stack)`
  gap: 0.15rem;
`;

const Label = styled(PreHeading)`
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.75rem;
  color: ${theme.palette.text.secondary};
  font-weight: 500;
`;

const Amount = styled(Heading1)`
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
  font-size: 2.35rem;
  line-height: 1.1;
  text-shadow: var(--text-shadow);
  background: linear-gradient(180deg, #ffffff 0%, ${theme.palette.text.primary} 100%);
  -webkit-background-clip: text;
  background-clip: text;
`;

const AccentBar = styled.div`
  width: 3rem;
  height: 3px;
  margin-top: 0.35rem;
  border-radius: 2px;
  background: linear-gradient(90deg, ${theme.palette.primary.main}, transparent);
`;

const TotalBalance = () => {
  const config = useConfig();
  const { t } = useTranslation();
  const [totalBalance] = useAtom(totalBalanceAtom);

  return (
    <Hero>
      <Label>{t('Total balance')}</Label>
      <Amount>{formatMoney(totalBalance, config.general)}</Amount>
      <AccentBar />
    </Hero>
  );
};

export default TotalBalance;
