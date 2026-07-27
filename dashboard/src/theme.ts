import { createTheme } from '@mui/material/styles';

export const GoSafeCommandTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0D47A1', // Deep Indigo Blue
      light: '#E1F5FE',
      dark: '#002171',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#311B92', // Command Purple
      light: '#EDE7F6',
      dark: '#12005e',
      contrastText: '#ffffff',
    },
    error: {
      main: '#D32F2F', // Alert/SOS Red
      light: '#FFEBEE',
      dark: '#9a0007',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#EF6C00', // Warning Orange
      light: '#FFF3E0',
      dark: '#b23c00',
    },
    success: {
      main: '#2E7D32', // Active/Safe Green
      light: '#E8F5E9',
      dark: '#005005',
    },
    background: {
      default: '#F4F6F9',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1C1E',
      secondary: '#43474E',
    },
  },
  shape: {
    borderRadius: 12, // Material Design 3 large rounded corners
  },
  typography: {
    fontFamily: '"Roboto", "Segoe UI", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 700,
      letterSpacing: -0.5,
    },
    h6: {
      fontWeight: 600,
      letterSpacing: -0.25,
    },
    subtitle1: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none', // Material Design 3 has case-sensitive buttons
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.04), 0px 4px 16px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24, // MD3 pill buttons
          padding: '8px 20px',
        },
      },
    },
  },
});
