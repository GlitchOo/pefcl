import styled from '@emotion/styled';
import theme from '../../../utils/theme';

const BaseText = styled.span`
  display: block;
  margin: 0;
  line-height: 1.4;
  font-family: ${theme.typography.fontFamily};
  font-weight: ${theme.typography.fontWeightLight};
`;

export const PreHeading = styled(BaseText)`
  font-size: 0.8rem;
  font-weight: 550;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${theme.palette.text.secondary};
  margin-bottom: 0.35rem;
`;

export const BodyText = styled(BaseText)`
  font-size: 0.95rem;
`;
