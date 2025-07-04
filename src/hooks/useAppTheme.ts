import { useAppDispatch, useAppSelector } from '../store';
import { toggleTheme, setThemeMode } from '../store/slices/themeSlice';
import { useTheme as usePaperTheme } from 'react-native-paper';
import { lightTheme, darkTheme } from '../utils/theme';

export const useAppTheme = () => {
  const dispatch = useAppDispatch();
  const { isDark, mode } = useAppSelector((state) => state.theme);
  
  const currentTheme = isDark ? darkTheme : lightTheme;
  
  const toggleAppTheme = () => {
    dispatch(toggleTheme());
  };
  
  const setAppThemeMode = (newMode: 'light' | 'dark' | 'system') => {
    dispatch(setThemeMode(newMode));
  };
  
  return {
    isDark,
    mode,
    theme: currentTheme,
    colors: currentTheme.colors,
    toggle: toggleAppTheme,
    setMode: setAppThemeMode,
  };
};
