import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { THEME_COLORS } from '../constants';
import { useAppSelector } from '../store';

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
    warning: THEME_COLORS.light.warning,
    success: THEME_COLORS.light.success,
    info: THEME_COLORS.light.info,
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
    warning: THEME_COLORS.dark.warning,
    success: THEME_COLORS.dark.success,
    info: THEME_COLORS.dark.info,
  },
};

// Hook to get current theme
export const useTheme = () => {
  const { isDark } = useAppSelector((state) => state.theme);
  return isDark ? darkTheme : lightTheme;
};

// Hook to get theme colors only
export const useThemeColors = () => {
  const { isDark } = useAppSelector((state) => state.theme);
  return isDark ? THEME_COLORS.dark : THEME_COLORS.light;
};

export const paperTheme = lightTheme; // Default theme
