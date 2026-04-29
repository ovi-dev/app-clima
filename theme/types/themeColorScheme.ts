/**
 * Enum with the possible theme colors.
 */
export enum ThemeColorScheme {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}

export const themeColorSchemeToColorSchemeName = (themeColorScheme?: ThemeColorScheme | null) => {
  if (!themeColorScheme) return null;

  switch (themeColorScheme) {
    case ThemeColorScheme.Light:
      return 'light';
    case ThemeColorScheme.Dark:
      return 'dark';
    case ThemeColorScheme.System:
      return null;
  }
};
