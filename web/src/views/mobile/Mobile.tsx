import React from 'react';
import './mobile.css';
import styled from '@emotion/styled';
import theme from '@utils/theme';
import MobileFooter from './components/MobileFooter';
import MobileSidebar from './components/MobileSidebar';
import MobileRoutes from './Routes';
import { Box } from '@mui/system';
import { Heading6 } from '@components/ui/Typography/Headings';
import { CircularProgress, Stack } from '@mui/material';
import { useGlobalSettings } from '@hooks/useGlobalSettings';
import { PHONE_SAFE, TABLET_SAFE } from './safeArea';

const Shell = styled.div<{ isTablet?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: ${({ isTablet }) => (isTablet ? 'row' : 'column')};
  height: 100%;
  overflow: ${({ isTablet }) => (isTablet ? 'hidden' : 'visible')};
  color: ${theme.palette.text.primary};
  background:
    radial-gradient(ellipse 90% 40% at 50% -10%, rgba(124, 181, 24, 0.18), transparent 55%),
    ${theme.palette.background.default};
`;

const Main = styled.div<{ isTablet?: boolean }>`
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-top: ${({ isTablet }) => (isTablet ? TABLET_SAFE.top : PHONE_SAFE.top)};
  padding-left: ${({ isTablet }) => (isTablet ? '1.25rem' : PHONE_SAFE.side)};
  padding-right: ${({ isTablet }) => (isTablet ? TABLET_SAFE.sideRight : PHONE_SAFE.sideRight)};
  padding-bottom: ${({ isTablet }) => (isTablet ? TABLET_SAFE.bottom : '0')};
`;

const BrandStrip = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin-bottom: 0.85rem;
`;

const LogoMark = styled.div`
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 7px;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 0.9rem;
  color: #0b110e;
  background: linear-gradient(145deg, #95d12a, #7cb518);
`;

const BrandName = styled.span`
  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${theme.palette.text.primary};
`;

const PageSlot = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  & > * {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
`;

const FooterSlot = styled.div`
  flex-shrink: 0;
  position: relative;
  z-index: 10;
  overflow: visible;
`;

interface LoadingFallbackProps {
  message: string;
}

const LoadingFallback = (props: LoadingFallbackProps) => (
  <Box
    p={4}
    sx={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Stack spacing={3} alignItems="center">
      <CircularProgress size={64} sx={{ color: theme.palette.primary.main }} />
      <Heading6>{props.message}</Heading6>
    </Stack>
  </Box>
);

const MobileApp = () => {
  const { isTablet } = useGlobalSettings();

  return (
    <Shell isTablet={isTablet}>
      {isTablet && <MobileSidebar />}
      <Main isTablet={isTablet}>
        {!isTablet && (
          <BrandStrip>
            <LogoMark>F</LogoMark>
            <BrandName>Fleeca</BrandName>
          </BrandStrip>
        )}
        <PageSlot>
          <React.Suspense fallback={<LoadingFallback message={'Getting data...'} />}>
            <MobileRoutes />
          </React.Suspense>
        </PageSlot>
      </Main>
      {!isTablet && (
        <FooterSlot>
          <MobileFooter />
        </FooterSlot>
      )}
    </Shell>
  );
};

export default MobileApp;
