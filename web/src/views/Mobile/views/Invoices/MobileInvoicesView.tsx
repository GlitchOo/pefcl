import InvoiceItem from '@components/InvoiceItem';
import { Heading2, Heading5 } from '@components/ui/Typography/Headings';
import { invoicesAtom } from '@data/invoices';
import { useGlobalSettings } from '@hooks/useGlobalSettings';
import { Box, Stack, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const InvoiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem;
  margin-top: 1.5rem;
`;

const MobileInvoicesView = () => {
  const { t } = useTranslation();
  const { isTablet } = useGlobalSettings();
  const [invoices, setInvoices] = useAtom(invoicesAtom);

  useEffect(() => {
    setInvoices();
  }, [setInvoices]);

  const hasInvoices = (invoices?.invoices?.length ?? 0) > 0;

  return (
    <Box
      px={0}
      pt={0}
      pb={2}
      sx={{ height: '100%', minHeight: 0, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}
    >
      <Stack spacing={0.35}>
        <Heading2 style={{ fontSize: isTablet ? '1.55rem' : '1.35rem' }}>{t('Invoices')}</Heading2>
        <Heading5>{t('Handle your unpaid invoices')}</Heading5>
      </Stack>

      {!hasInvoices && (
        <Stack marginTop={6} alignItems="center">
          <Typography color="text.secondary">{t('There is nothing to see here.')}</Typography>
        </Stack>
      )}

      {isTablet ? (
        <InvoiceGrid>
          {invoices.invoices.map((invoice) => (
            <InvoiceItem key={invoice.id} invoice={invoice} />
          ))}
        </InvoiceGrid>
      ) : (
        <Stack spacing={0.9} marginTop={2.5}>
          {invoices.invoices.map((invoice) => (
            <InvoiceItem key={invoice.id} invoice={invoice} />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default MobileInvoicesView;
