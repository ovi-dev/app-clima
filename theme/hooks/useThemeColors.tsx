import { useColorScheme } from '@/theme/hooks/useColorScheme';
import { AppThemeColors } from '../constants/appThemeColors';
import { ThemeColors } from '../types/themeColors';

/**
 * Return all the theme colors depending on the current color scheme.
 */
export const useThemeColors = (): ThemeColors => {
  const themeColorScheme = useColorScheme();
  return AppThemeColors[themeColorScheme];
};
