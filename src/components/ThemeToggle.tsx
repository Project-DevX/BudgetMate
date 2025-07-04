import * as React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useAppTheme } from '../hooks/useAppTheme';

interface ThemeToggleProps {
  size?: number;
  style?: ViewStyle;
  iconOnly?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 24, 
  style,
  iconOnly = true 
}) => {
  const { isDark, mode, toggle, colors } = useAppTheme();

  const getIcon = () => {
    if (mode === 'system') {
      return 'theme-light-dark';
    }
    return isDark ? 'weather-sunny' : 'weather-night';
  };

  if (iconOnly) {
    return (
      <IconButton
        icon={getIcon()}
        size={size}
        iconColor={colors.onSurface}
        onPress={toggle}
        style={style}
        testID="theme-toggle-button"
      />
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.outline },
        style
      ]}
      onPress={toggle}
      testID="theme-toggle-button"
    >
      <IconButton
        icon={getIcon()}
        size={size}
        iconColor={colors.onSurface}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  icon: {
    margin: 0,
  },
});
