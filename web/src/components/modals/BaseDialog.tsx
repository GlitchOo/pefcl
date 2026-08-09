import { useGlobalSettings } from '@hooks/useGlobalSettings';
import { Dialog, DialogProps } from '@mui/material';
import theme from '@utils/theme';
import { getMobileSafe } from '../../views/mobile/safeArea';
import React, { ReactNode } from 'react';

interface BaseDialogProps extends DialogProps {
  children: ReactNode;
}

const BaseDialog = ({ children, PaperProps, sx, ...props }: BaseDialogProps) => {
  const { isMobile, isTablet } = useGlobalSettings();
  const safe = getMobileSafe(isTablet);

  return (
    <Dialog
      {...props}
      fullWidth
      hideBackdrop={false}
      disablePortal={false}
      fullScreen={isMobile}
      sx={{
        position: 'fixed',
        inset: isMobile ? 0 : undefined,
        zIndex: 1400,
        ...(typeof sx === 'object' && sx !== null ? sx : {}),
      }}
      PaperProps={{
        ...PaperProps,
        sx: {
          ...(isMobile
            ? {
                m: 0,
                width: '100%',
                maxWidth: '100%',
                height: '100%',
                maxHeight: '100%',
                borderRadius: 0,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                backgroundColor: theme.palette.background.default,
                paddingTop: safe.top,
                paddingLeft: safe.side,
                paddingRight: safe.sideRight,
                paddingBottom: safe.bottom,
                boxSizing: 'border-box',
              }
            : {
                backgroundColor: theme.palette.background.paper,
              }),
          ...(PaperProps?.sx && typeof PaperProps.sx === 'object' ? PaperProps.sx : {}),
        },
      }}
    >
      {children}
    </Dialog>
  );
};

export default BaseDialog;
