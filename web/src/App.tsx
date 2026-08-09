import Devbar from '@components/DebugBar';
import { accountsAtom, rawAccountAtom } from '@data/accounts';
import { transactionBaseAtom, transactionInitialState } from '@data/transactions';
import styled from '@emotion/styled';
import { BroadcastsWrapper } from '@hooks/useBroadcasts';
import { useExitListener } from '@hooks/useExitListener';
import { useNuiEvent } from '@hooks/useNuiEvent';
import { GeneralEvents, NUIEvents, UserEvents } from '@typings/Events';
import { fetchNui } from '@utils/fetchNui';
import dayjs from 'dayjs';
import 'dayjs/locale/sv';
import updateLocale from 'dayjs/plugin/updateLocale';
import { useSetAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route } from 'react-router';
import './App.css';
import { useConfig } from './hooks/useConfig';
import theme from './utils/theme';
import Atm from './views/atm/Atm';
import Deposit from './views/deposit/Deposit';
import Invoices from './views/invoices/Invoices';
import Withdraw from './views/withdraw/Withdraw';
import Accounts from './views/accounts/Accounts';
import Dashboard from './views/dashboard/Dashboard';
import Transactions from './views/transactions/Transactions';
import Transfer from './views/transfer/Transfer';
import CardsView from './views/cards/CardsView';
import MobileApp from './views/mobile/Mobile';
import { useGlobalSettings } from '@hooks/useGlobalSettings';
import { useLBPhoneSettings } from '@hooks/useLBPhoneSettings';
import { useLBTabletSettings } from '@hooks/useLBTabletSettings';

dayjs.extend(updateLocale);

const Container = styled.div`
  padding: 3.5rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 1440px;
  height: 820px;
  overflow: hidden;
  border-radius: 16px;
  color: ${theme.palette.text.primary};
  background:
    radial-gradient(ellipse 80% 50% at 0% 0%, rgba(124, 181, 24, 0.12), transparent 55%),
    ${theme.palette.background.default};
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-panel), inset 0 1px 0 rgba(255, 255, 255, 0.04);
`;

const ShellBody = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

const App: React.FC = () => {
  const config = useConfig();
  const setRawAccounts = useSetAtom(rawAccountAtom);
  const setAccounts = useSetAtom(accountsAtom);
  const setTransactions = useSetAtom(transactionBaseAtom);
  const [isAtmVisible, setIsAtmVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { isMobile } = useGlobalSettings();
  const LBPhoneSettings = useLBPhoneSettings();
  const LBTabletSettings = useLBTabletSettings();

  const [hasLoaded, setHasLoaded] = useState(process.env.NODE_ENV === 'development' || isMobile);

  useNuiEvent('pefcl', UserEvents.Loaded, () => setHasLoaded(true));
  useNuiEvent('pefcl', UserEvents.Unloaded, () => {
    setHasLoaded(false);
    setAccounts([]);
    setRawAccounts([]);
    setTransactions();
    fetchNui(GeneralEvents.CloseUI);
    setTransactions(transactionInitialState);
  });

  useEffect(() => {
    fetchNui(NUIEvents.Loaded);
    return () => {
      fetchNui(NUIEvents.Unloaded);
    };
  }, []);

  useNuiEvent('pefcl', 'setVisible', (data) => setIsVisible(data as boolean));
  useNuiEvent('pefcl', 'setVisibleATM', (data) => setIsAtmVisible(data as boolean));

  useEffect(() => {
    if (hasLoaded && (isVisible || isAtmVisible)) {
      setAccounts(undefined);
      setTransactions(undefined);
    }
  }, [hasLoaded, isVisible, isAtmVisible, setAccounts, setTransactions]);

  const { i18n } = useTranslation();
  useExitListener(isVisible);

  useEffect(() => {
    i18n
      .changeLanguage(
        LBPhoneSettings?.locale ?? LBTabletSettings?.locale ?? config?.general?.language,
      )
      .catch((e) => console.error(e));
  }, [i18n, config, LBPhoneSettings, LBTabletSettings]);

  useEffect(() => {
    dayjs.locale(
      LBPhoneSettings?.locale ?? LBTabletSettings?.locale ?? config?.general?.language ?? 'en',
    );
  }, [i18n, config, LBPhoneSettings, LBTabletSettings]);

  if (!hasLoaded) {
    return null;
  }

  return (
    <>
      {process.env.NODE_ENV === 'development' && <Devbar />}

      <React.Suspense fallback={'Loading bank'}>
        {!isAtmVisible && isVisible && (
          <Container>
            <Content>
              <ShellBody>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="accounts" element={<Accounts />} />
                  <Route path="transactions" element={<Transactions />} />
                  <Route path="invoices" element={<Invoices />} />
                  <Route path="transfer" element={<Transfer />} />
                  <Route path="deposit" element={<Deposit />} />
                  <Route path="withdraw" element={<Withdraw />} />
                  <Route path="cards" element={<CardsView />} />
                </Routes>
              </ShellBody>
            </Content>
          </Container>
        )}
      </React.Suspense>

      <React.Suspense fallback={null}>
        <Atm />
      </React.Suspense>

      {isMobile && (
        <React.Suspense fallback={null}>
          <Routes>
            <Route path="*" element={<MobileApp />} />
          </Routes>
        </React.Suspense>
      )}

      <React.Suspense fallback={null}>
        <BroadcastsWrapper />
      </React.Suspense>
    </>
  );
};

export default App;
