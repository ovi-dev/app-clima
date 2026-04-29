import { useColorScheme } from '@/theme/hooks/useColorScheme';
import React from 'react';
import { AppThemeColors } from '../constants/appThemeColors';
import { ThemeColorScheme } from '../types/themeColorScheme';
import { ThemeColors } from '../types/themeColors';

/**
 * Pass as parameter to the given function 'fn' the current app theme colors
 * depending in the current color scheme.
 */
export const useWithAppTheme = <T,>(fn: (colorPalette: ThemeColors) => T) => {
  const themeScheme = useColorScheme() ?? ThemeColorScheme.Light;
  const appThemeColors = AppThemeColors[themeScheme];
  return React.useMemo(() => fn(appThemeColors), [fn, appThemeColors]);
};
