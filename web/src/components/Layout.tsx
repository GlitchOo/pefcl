import styled from '@emotion/styled';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import { Heading2, Heading5, Heading6 } from './ui/Typography/Headings';
import { AnimatePresence, motion } from 'motion/react';
import theme from '@utils/theme';

const Container = styled.div`
  display: flex;
  position: relative;
  height: 100%;
  transform: translateZ(0);
  min-height: 0;
`;

const Content = styled(motion.div)<{ children?: React.ReactNode }>`
  position: relative;
  padding: 1.5rem 1.75rem;
  flex: 1;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
`;

const PageHeader = styled.header`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding-bottom: 0.15rem;
`;

const PageTitle = styled(Heading2)`
  font-size: 1.5rem;
  font-weight: 650;
  letter-spacing: -0.015em;
  color: ${theme.palette.text.primary};
`;

const PageSubtitle = styled(Heading6)`
  font-size: 0.82rem;
  font-weight: 450;
  letter-spacing: 0.01em;
  text-transform: none;
  color: ${theme.palette.text.secondary};
  max-width: 40rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  gap: 1rem;
`;

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -8 },
};

const Layout: React.FC<
  React.PropsWithChildren<{ title?: string; subtitle?: string }>
> = ({ children, title, subtitle }) => {
  const { t } = useTranslation();
  return (
    <Container>
      <Sidebar />
      <AnimatePresence>
        <Content
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          {(title || subtitle) && (
            <PageHeader>
              {title && <PageTitle>{title}</PageTitle>}
              {subtitle && <PageSubtitle>{subtitle}</PageSubtitle>}
            </PageHeader>
          )}
          <React.Suspense
            fallback={
              <LoadingContainer>
                <Heading5>{t('Loading {{name}} view ..', { name: title })}</Heading5>
                <Box>
                  <CircularProgress sx={{ color: theme.palette.primary.main }} />
                </Box>
              </LoadingContainer>
            }
          >
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              {children}
            </div>
          </React.Suspense>
        </Content>
      </AnimatePresence>
    </Container>
  );
};

export default Layout;
