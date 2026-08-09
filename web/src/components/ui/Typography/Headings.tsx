import styled from '@emotion/styled';
import theme from '../../../utils/theme';

const BaseHeading = styled.span`
  display: block;
  margin: 0;
  line-height: 1.25;
  font-family: ${theme.typography.fontFamily};
  font-weight: ${theme.typography.fontWeightBold};
`;

export const Heading1 = styled(BaseHeading)`
  font-size: 2.5rem;
  line-height: 1.15;
`;

export const Heading2 = styled(BaseHeading)`
  font-size: 1.75rem;
  line-height: 1.2;
`;

export const Heading3 = styled(BaseHeading)`
  font-size: 1.35rem;
`;

export const Heading4 = styled(BaseHeading)`
  font-size: 1.15rem;
`;

export const Heading5 = styled(BaseHeading)`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${theme.palette.text.secondary};
`;

export const Heading6 = styled(BaseHeading)`
  font-size: 0.72rem;
  font-weight: 550;
  letter-spacing: 0.04em;
  color: ${theme.palette.text.secondary};
`;
