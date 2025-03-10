import React from 'react';
import { InputAdornment, StandardTextFieldProps, TextField } from '@mui/material';

interface IconTextFieldProps extends StandardTextFieldProps {
  icon: React.ReactElement;
}

const IconTextField: React.FC<IconTextFieldProps> = ({ icon, ...props }) => (
  <>
    <TextField
      {...props}
      InputProps={{ startAdornment: <InputAdornment position="start">{icon}</InputAdornment> }}
    />
  </>
);

export default IconTextField;
