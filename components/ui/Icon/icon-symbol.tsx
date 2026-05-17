// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'cloud.sun.fill': 'wb-sunny',
  'star.fill': 'star',
  'map.fill': 'map',
} as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}

/**
 * IconSymbol
 *
 * Ícono multiplataforma: usa SF Symbols nativos en iOS y Material Icons en
 * Android/web, garantizando consistencia visual entre plataformas.
 * Los nombres de los iconos siguen la nomenclatura de SF Symbols y se
 * mapean manualmente a Material Icons en la constante MAPPING.
 *
 * @prop name   - Nombre del símbolo (clave del objeto MAPPING).
 * @prop size   - Tamaño en px. Por defecto 24.
 * @prop color  - Color del ícono.
 * @prop style  - Estilos adicionales (TextStyle).
 * @prop weight - Grosor del trazo (solo aplica en iOS con SF Symbols).
 *
 * @example
 * <IconSymbol name="house.fill" size={28} color="#fff" />
 * <IconSymbol name="star.fill" size={20} color={theme.accentColor} />
 */
