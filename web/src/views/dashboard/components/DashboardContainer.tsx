import styled from '@emotion/styled';
import { CircularProgress, Stack } from '@mui/material';
import { Atom, useAtom } from 'jotai';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import Button from '@ui/Button';
import { Heading5 } from '@ui/Typography/Headings';
import theme from '../../../utils/theme';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  padding: ${theme.spacing(2)} ${theme.spacing(2.25)};
  border-radius: var(--card-radius);
  background-color: ${theme.palette.background.paper};
  border: 1px solid var(--glass-border);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
`;

const LoadingContainer = styled(Container)``;

const Total = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-width: 2rem;
  height: 1.6rem;
  padding: 0 0.55rem;
  border-radius: 6px;
  font-weight: ${theme.typography.fontWeightBold};
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  color: ${theme.palette.primary.light};
  background-color: var(--accent-muted);
  border: 1px solid rgba(124, 181, 24, 0.25);
`;

const Content = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding-right: 4px;
  margin: 0.65rem 0;
`;

const Title = styled(Heading5)`
  color: ${theme.palette.text.primary};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.75rem;
  font-weight: 600;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
`;

interface DashboardContainerProps {
  title: string;
  children?: React.ReactNode;
  totalAtom: Atom<number | Promise<number>>;
  viewAllRoute: string;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({
  title,
  children,
  totalAtom,
  viewAllRoute,
}) => {
  const [total] = useAtom(totalAtom);
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Container>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Title>{title}</Title>
        <Total>{total}</Total>
      </Stack>

      <Content>{children}</Content>

      <Footer>
        <Button onClick={() => navigate(viewAllRoute)}>{t('View all')}</Button>
      </Footer>
    </Container>
  );
};

export const DashboardContainerFallback: React.FC<{ title: string }> = ({ title }) => {
  return (
    <LoadingContainer>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Heading5>{title}</Heading5>
        <Total>0</Total>
      </Stack>

      <Stack flex={1} alignItems="center" justifyContent="center">
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
      </Stack>
    </LoadingContainer>
  );
};

export default DashboardContainer;
