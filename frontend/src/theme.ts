import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#0a84ff',
			dark: '#0066d6',
			light: '#66b4ff',
			contrastText: '#ffffff',
		},
		secondary: {
			main: '#12b3a8',
		},
		background: {
			default: '#f5f6f8',
			paper: '#ffffff',
		},
		text: {
			primary: '#0b0f14',
			secondary: '#374151',
		},
		divider: 'rgba(15, 23, 42, 0.08)',
	},
	shape: {
		borderRadius: 16,
	},
	typography: {
		fontFamily:
			'"SF Pro Display", "SF Pro Text", "Space Grotesk", "Helvetica Neue", Arial, sans-serif',
		h4: {
			fontWeight: 600,
			letterSpacing: '-0.02em',
		},
		h5: {
			fontWeight: 600,
			letterSpacing: '-0.02em',
		},
		h6: {
			fontWeight: 600,
			letterSpacing: '-0.015em',
		},
		subtitle1: {
			fontWeight: 600,
		},
		button: {
			textTransform: 'none',
			fontWeight: 600,
			letterSpacing: '0.01em',
		},
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				'::selection': {
					backgroundColor: alpha('#0a84ff', 0.2),
				},
			},
		},
		MuiAppBar: {
			styleOverrides: {
				root: {
					backgroundColor: 'rgba(255, 255, 255, 0.75)',
					backdropFilter: 'blur(18px)',
					border: '1px solid rgba(15, 23, 42, 0.08)',
					boxShadow: '0 6px 18px rgba(15, 23, 42, 0.08)',
					borderRadius: 20,
					marginTop: 16,
				},
			},
		},
		MuiToolbar: {
			styleOverrides: {
				root: {
					minHeight: 72,
					paddingLeft: 24,
					paddingRight: 24,
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 999,
					padding: '8px 18px',
				},
				containedPrimary: {
					boxShadow: '0 12px 30px rgba(10, 132, 255, 0.25)',
					background: 'linear-gradient(140deg, #0a84ff 0%, #1b6dff 100%)',
					color: '#ffffff',
					'&.Mui-disabled': {
						background: 'rgba(15, 23, 42, 0.12)',
						color: 'rgba(11, 15, 20, 0.45)',
						boxShadow: 'none',
					},
				},
				outlinedPrimary: {
					borderColor: 'rgba(10, 132, 255, 0.4)',
					backgroundColor: 'rgba(10, 132, 255, 0.06)',
				},
			},
		},
		MuiIconButton: {
			styleOverrides: {
				root: {
					borderRadius: 14,
					transition: 'transform 0.2s ease, background-color 0.2s ease',
					backgroundColor: 'rgba(15, 23, 42, 0.04)',
					'&:hover': {
						backgroundColor: 'rgba(15, 23, 42, 0.1)',
						transform: 'translateY(-1px)',
					},
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: 20,
					border: '1px solid rgba(15, 23, 42, 0.08)',
					boxShadow: '0 12px 26px rgba(15, 23, 42, 0.08)',
					backgroundColor: 'rgba(255, 255, 255, 0.92)',
					transition: 'transform 0.25s ease, box-shadow 0.25s ease',
					'&:hover': {
						transform: 'translateY(-3px)',
						boxShadow: '0 18px 40px rgba(15, 23, 42, 0.12)',
					},
				},
			},
		},
		MuiCardActionArea: {
			styleOverrides: {
				root: {
					borderRadius: 20,
				},
			},
		},
		MuiTextField: {
			defaultProps: {
				size: 'small',
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					borderRadius: 14,
					backgroundColor: 'rgba(255, 255, 255, 0.9)',
					transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
					'&.Mui-focused': {
						boxShadow: '0 0 0 4px rgba(10, 132, 255, 0.2)',
					},
				},
				notchedOutline: {
					borderColor: 'rgba(15, 23, 42, 0.16)',
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
	},
});

export default theme;
