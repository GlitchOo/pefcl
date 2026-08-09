import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router';
import styled from '@emotion/styled';
import image from './bg.png';
import { NuiProvider } from 'react-fivem-hooks';
import MobileApp from './views/mobile/Mobile';

const Container = styled.div`
  position: relative;
  width: 500px;
  height: 1000px;
`;
const Background = styled.div<{ src: string }>`
  z-index: 10;
  background: url(${({ src }) => src});
  position: absolute;
  width: 500px;
  height: 1000px;
  pointer-events: none;
`;

const AppContainer = styled.div`
  z-index: 2;
  position: absolute;
  bottom: 100px;
  left: 50px;
  right: 50px;
  top: 100px;
  display: flex;
  flex-direction: column;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 20px;
`;

const Root = () => (
  <HashRouter>
    <NuiProvider>
      <Container>
        <Background src={image} />
        <React.Suspense fallback="Loading phone">
          <AppContainer>
            <MobileApp />
          </AppContainer>
        </React.Suspense>
      </Container>
    </NuiProvider>
  </HashRouter>
);

const container = document.getElementById('mobile-app');
if (!container) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(container!);
root.render(<Root />);
