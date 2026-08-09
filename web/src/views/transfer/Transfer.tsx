import Layout from '@components/Layout';
import TransferFunds from '@components/TransferFunds';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Transfer = () => {
  const { t } = useTranslation();
  return (
    <Layout
      title={t('Transfer')}
      subtitle={t('Transfer between your accounts or to another Fleeca customer')}
    >
      <TransferFunds />
    </Layout>
  );
};

export default Transfer;
