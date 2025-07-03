import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { THEME_COLORS } from '../constants';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: THEME_COLORS.light.primary,
    secondary: THEME_COLORS.light.secondary,
    background: THEME_COLORS.light.background,
    surface: THEME_COLORS.light.surface,
    onSurface: THEME_COLORS.light.text,
    onSurfaceVariant: THEME_COLORS.light.textSecondary,
    accent: THEME_COLORS.light.accent,
    error: THEME_COLORS.light.error,
    outline: THEME_COLORS.light.border,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: THEME_COLORS.dark.primary,
    secondary: THEME_COLORS.dark.secondary,
    background: THEME_COLORS.dark.background,
    surface: THEME_COLORS.dark.surface,
    onSurface: THEME_COLORS.dark.text,
    onSurfaceVariant: THEME_COLORS.dark.textSecondary,
    accent: THEME_COLORS.dark.accent,
    error: THEME_COLORS.dark.error,
    outline: THEME_COLORS.dark.border,
  },
};

export const paperTheme = lightTheme; // Default theme
