import styled from '@emotion/styled';
import { ButtonProps, css } from '@mui/material';
import { Button as ButtonBase } from '@mui/material';
import React from 'react';
import theme from '../../utils/theme';

const colors = {
  inherit: '',
  secondary: css`
    color: ${theme.palette.secondary.main};
  `,
  success: css`
    color: #0b110e;
    background: linear-gradient(180deg, ${theme.palette.success.light}, ${theme.palette.success.main});
    border-color: transparent;
  `,
  info: '',
  warning: '',
  error: css`
    color: ${theme.palette.error.main};
    background-color: rgba(232, 92, 74, 0.14);
  `,
  primary: css`
    color: #0b110e;
    background: linear-gradient(180deg, ${theme.palette.primary.light}, ${theme.palette.primary.main});
    border-color: transparent;
    box-shadow: 0 6px 16px rgba(124, 181, 24, 0.22);
  `,
};

const StyledButtonBase = styled(ButtonBase)`
  font-weight: 650;
  letter-spacing: 0.01em;
  box-shadow: none;
  border-radius: 10px;
  background-color: var(--bg-elevated);
  border: 1px solid var(--glass-border);
  padding: 0.55rem 1.5rem;
  transition: all var(--transition-fast);
  text-transform: none;

  ${({ color }) => colors[color ?? 'primary']};

  :hover:not(:disabled) {
    filter: brightness(1.06);
    border-color: var(--border-accent);
  }

  :disabled {
    opacity: 0.35;
    ${({ color }) => colors[color ?? 'primary']};
  }
`;

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <StyledButtonBase {...props} color={props.color || 'primary'}>
      {children}
    </StyledButtonBase>
  );
};

export default Button;
