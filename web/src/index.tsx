import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from '@mui/material';
import theme from './utils/theme';
import { HashRouter } from 'react-router';
import i18n from './utils/i18n';
import { SnackbarProvider } from 'notistack';
import { NuiProvider } from 'react-fivem-hooks';
import { I18nextProvider } from 'react-i18next';
import { GlobalSettingsProvider } from '@hooks/useGlobalSettings';

const hash = window.location.hash;
const isMobile = hash.includes('/mobile');
const isTablet =
  hash.includes('device=tablet') ||
  new URLSearchParams(window.location.search).get('device') === 'tablet';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <NuiProvider>
      <GlobalSettingsProvider isMobile={isMobile} isTablet={isTablet}>
        <I18nextProvider i18n={i18n}>
          <HashRouter>
            <ThemeProvider theme={theme}>
              <SnackbarProvider maxSnack={2}>
                <React.Suspense fallback={<div>Fetching app</div>}>
                  <App />
                </React.Suspense>
              </SnackbarProvider>
            </ThemeProvider>
          </HashRouter>
        </I18nextProvider>
      </GlobalSettingsProvider>
    </NuiProvider>
  </React.StrictMode>,
);
