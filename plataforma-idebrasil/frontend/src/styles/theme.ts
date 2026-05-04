import { createTheme } from '@mui/material/styles';

// IDEBRASIL Brand Colors - Manual de Identidade Visual
const colors = {
  // Primary Brand Colors - IDEBRASIL Vermelho 01
  primary: {
    main: '#C23535', // IDEBRASIL Vermelho 01 - main brand color (R:192 G:51 B:51)
    light: '#E63946', // IDEBRASIL Vermelho 02 - lighter variant (R:230 G:57 B:70)
    dark: '#A52A2A', // Darker vermelho for hover states
    contrastText: '#ffffff',
  },
  // Secondary - Neutral Cinza for secondary actions
  secondary: {
    main: '#616161', // Medium gray for secondary elements
    light: '#9e9e9e', // Light gray
    dark: '#2C2C2C', // Dark gray/nearly black (IDEBRASIL Cinza)
    contrastText: '#ffffff',
  },
  // Accent - Additional Vermelho for highlights
  accent: {
    main: '#E63946', // IDEBRASIL Vermelho 02 for accents
    light: '#F5A5AC',
    dark: '#C23535',
    contrastText: '#ffffff',
  },
  success: {
    main: '#4caf50',
    light: '#81c784',
    dark: '#388e3c',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#ff9800',
    light: '#ffb74d',
    dark: '#f57c00',
    contrastText: '#000000',
  },
  error: {
    main: '#C23535', // Use IDEBRASIL red for errors
    light: '#E63946',
    dark: '#A52A2A',
    contrastText: '#ffffff',
  },
  info: {
    main: '#2196f3',
    light: '#64b5f6',
    dark: '#1976d2',
    contrastText: '#ffffff',
  },
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#2C2C2C', // IDEBRASIL Cinza
  },
};

export const theme = createTheme({
  palette: {
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    grey: colors.grey,
    background: {
      default: '#fafafa', // Clean, minimal background
      paper: '#ffffff',
    },
    text: {
      primary: '#212121', // High contrast for accessibility
      secondary: '#616161', // Muted but readable
    },
  },
  typography: {
    fontFamily: '"ASAP", "Myriad Pro", "Roboto", "Helvetica", "Arial", sans-serif', // IDEBRASIL fonts per manual
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700, // Bold for headings
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: '#C23535', // IDEBRASIL Vermelho 01
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      color: '#C23535', // IDEBRASIL Vermelho 01
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: '#2C2C2C', // IDEBRASIL Cinza
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#2C2C2C',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#2C2C2C',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#2C2C2C',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#424242',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#616161',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600, // IDEBRASIL uses bold buttons
      textTransform: 'none',
      letterSpacing: '0.02em',
      color: '#ffffff',
    },
  },
  shape: {
    borderRadius: 8, // Slightly more modern than default 4px
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 24px',
          fontSize: '0.875rem',
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            backgroundColor: 'rgba(30, 136, 229, 0.04)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'border-color 0.2s ease-in-out',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1e88e5',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#212121',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});