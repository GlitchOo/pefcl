import { createTheme } from '@mui/material';

/* Fleeca Bank theme — lime green fintech */
const theme = createTheme({
  palette: {
    background: {
      light2: 'rgba(255, 255, 255, 0.02)',
      light4: 'rgba(255, 255, 255, 0.04)',
      light8: 'rgba(255, 255, 255, 0.08)',
      dark4: 'rgba(0, 0, 0, 0.04)',
      dark12: 'rgba(0, 0, 0, 0.12)',
      primary20: 'rgba(124, 181, 24, 0.2)',
      paper: '#162019',
      default: '#0b110e',
      secondary: '#101814',
    },
    primary: {
      light: '#95d12a',
      main: '#7cb518',
      dark: '#5f8f12',
      contrastText: '#0b110e',
    },
    secondary: {
      light: '#55e090',
      main: '#3dcf7a',
      contrastText: '#0b110e',
    },
    error: {
      main: '#e85c4a',
    },
    success: {
      main: '#3dcf7a',
      contrastText: '#0b110e',
    },
    warning: {
      main: '#e8b84a',
    },
    divider: 'rgba(255, 255, 255, 0.07)',
    common: {
      white: '#1c2a21',
    },
    text: {
      primary: '#f4f7f2',
      secondary: '#a8b5a6',
      disabled: '#6d7a6b',
    },
  },
  typography: {
    fontFamily: "'Outfit', 'Segoe UI', system-ui, sans-serif",
    fontWeightBold: 600,
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiListItem: {
      styleOverrides: {
        root: {
          height: 52,
          borderRadius: 10,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
        },
      },
    },
  },
});

declare module '@mui/material/styles' {
  interface TypeBackground {
    light2: string;
    light4: string;
    light8: string;
    dark4: string;
    dark12: string;
    primary20: string;
    secondary: string;
  }
}

export default theme;
