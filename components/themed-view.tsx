import { View, type ViewProps } from 'react-native';

import { useThemeColors } from '@/theme/hooks/useThemeColors';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const themeColors = useThemeColors();
  const backgroundColor = lightColor ?? darkColor ?? themeColors.general.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

/**
 * ThemedView
 *
 * Wrapper sobre `View` que aplica automáticamente el color de fondo del
 * tema activo (dark/light). Acepta los mismos props que `View`.
 *
 * @prop lightColor - Color de fondo explícito para modo claro.
 * @prop darkColor  - Color de fondo explícito para modo oscuro.
 *
 * @example
 * <ThemedView style={{ padding: 16 }}>
 *   <ThemedText>Contenido</ThemedText>
 * </ThemedView>
 *
 * // Con color personalizado:
 * <ThemedView lightColor="#fff" darkColor="#000">
 *   <ThemedText>Contenido</ThemedText>
 * </ThemedView>
 */
