import InvoiceItem from '@components/InvoiceItem';
import Layout from '@components/Layout';
import BankPanel from '@components/ui/BankPanel';
import React, { useEffect, useState } from 'react';
import { Heading3 } from '@components/ui/Typography/Headings';
import { Pagination, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import theme from '@utils/theme';
import styled from '@emotion/styled';
import { GetInvoicesResponse, Invoice } from '@typings/Invoice';
import { InvoiceEvents } from '@typings/Events';
import { fetchNui } from '@utils/fetchNui';
import { DEFAULT_PAGINATION_LIMIT } from '@utils/constants';

const Page = styled.div`
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

const Panel = styled(BankPanel)`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

const NoInvoicesText = styled(Heading3)`
  padding: 3rem 1rem;
  text-align: center;
  color: ${theme.palette.text.secondary};
  font-weight: 500;
`;

const List = styled.div`
  overflow: auto;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-right: 0.35rem;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.75rem;
  padding-top: 1rem;
  margin-top: auto;
  border-top: 1px solid var(--border-color);
`;

const Invoices = () => {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_PAGINATION_LIMIT);
  const pages = Math.ceil(total / limit);
  const [page, setPage] = useState(1);

  const offset = limit * (page - 1);
  const to = offset + limit > total ? total : offset + limit;

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    fetchNui<GetInvoicesResponse>(InvoiceEvents.Get, {
      limit,
      offset,
    }).then((res) => {
      if (!res) {
        return;
      }

      setLimit(res.limit);
      setTotal(res.total);
      setInvoices(res.invoices);
    });
  }, [limit, offset]);

  return (
    <Layout title={t('Invoices')} subtitle={t('Pay your bills')}>
      <Page>
        <Panel>
          <List>
            {invoices.map((invoice) => (
              <InvoiceItem key={invoice.id} invoice={invoice} />
            ))}

            {invoices.length === 0 && <NoInvoicesText>{t('No invoices, yet.')}</NoInvoicesText>}
          </List>

          <Footer>
            <Typography variant="caption" color="text.secondary">
              {t('{{from}}-{{to}} of {{total}}', { from: offset || (total ? 1 : 0), to, total })}
            </Typography>
            <Pagination
              count={pages}
              shape="rounded"
              onChange={handleChange}
              page={page}
              color="primary"
            />
          </Footer>
        </Panel>
      </Page>
    </Layout>
  );
};

export default Invoices;
