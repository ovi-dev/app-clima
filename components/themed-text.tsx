import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts } from '@/constants/fontConfig';
import { useThemeColors } from '@/theme/hooks/useThemeColors';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({ style, lightColor, darkColor, type = 'default', ...rest }: ThemedTextProps) {
  const themeColors = useThemeColors();
  const color = lightColor ?? darkColor ?? themeColors.general.text;

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Fonts.OverpassRegular,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Fonts.OverpassSemiBold,
  },
  title: {
    fontSize: 32,
    lineHeight: 32,
    fontFamily: Fonts.OverpassBold,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: Fonts.OverpassMedium,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
    fontFamily: Fonts.OverpassRegular,
  },
});

/**
 * ThemedText
 *
 * Componente de texto que aplica automáticamente el color del tema activo
 * (dark/light) y una tipografía predefinida según el `type` indicado.
 *
 * @prop type - Variante visual del texto:
 *   - `"default"`         → 16px, fuente regular
 *   - `"defaultSemiBold"` → 16px, fuente semi-negrita
 *   - `"title"`           → 32px, fuente bold
 *   - `"subtitle"`        → 20px, fuente medium
 *   - `"link"`            → 16px, color azul, fuente regular
 * @prop lightColor - Color explícito para modo claro (sobreescribe el tema).
 * @prop darkColor  - Color explícito para modo oscuro (sobreescribe el tema).
 *
 * @example
 * <ThemedText type="title">Hola mundo</ThemedText>
 * <ThemedText type="subtitle" lightColor="#888">Subtítulo</ThemedText>
 */
