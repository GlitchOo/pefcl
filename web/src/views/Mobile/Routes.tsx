import React from 'react';
import { Outlet, Routes, Route } from 'react-router';
import styled from '@emotion/styled';
import MobileAccountsView from './views/accounts/MobileAccountsView';
import MobileDashboardView from './views/dashboard/MobileDashboardView';
import MobileInvoicesView from './views/invoices/MobileInvoicesView';
import MobileTransferView from './views/transfer/MobileTransferView';
import MobileTransactionsView from './views/transactions/MobileTransactionsView';

const LayoutRoot = styled.div`
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

const MobilePageLayout = () => (
  <LayoutRoot>
    <Outlet />
  </LayoutRoot>
);

const MobileRoutes = () => {
  return (
    <Routes>
      <Route element={<MobilePageLayout />}>
        <Route path="mobile/accounts" element={<MobileAccountsView />} />
        <Route path="mobile/dashboard" element={<MobileDashboardView />} />
        <Route path="mobile/transfer" element={<MobileTransferView />} />
        <Route path="mobile/transactions" element={<MobileTransactionsView />} />
        <Route path="mobile/invoices" element={<MobileInvoicesView />} />
      </Route>
    </Routes>
  );
};

export default MobileRoutes;
