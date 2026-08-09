import styled from '@emotion/styled';
import theme from '@utils/theme';
import React from 'react';
import { Heading5, Heading6 } from './Typography/Headings';

const Panel = styled.section`
  background: var(--bg-card);
  border: 1px solid var(--glass-border);
  border-radius: var(--panel-radius);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  padding: 1.25rem 1.35rem;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 1.25rem;
`;

const Title = styled(Heading5)`
  font-size: 1rem;
  font-weight: 650;
  color: ${theme.palette.text.primary};
`;

const Subtitle = styled(Heading6)`
  font-size: 0.78rem;
  font-weight: 450;
  letter-spacing: 0.01em;
  text-transform: none;
  color: ${theme.palette.text.secondary};
  line-height: 1.35;
`;

interface BankPanelProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const BankPanel = ({ title, subtitle, children, className, style }: BankPanelProps) => {
  return (
    <Panel className={className} style={style}>
      {(title || subtitle) && (
        <Header>
          {title && <Title>{title}</Title>}
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
        </Header>
      )}
      {children}
    </Panel>
  );
};

export default BankPanel;
