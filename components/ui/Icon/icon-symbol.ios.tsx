import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle } from 'react-native';

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: SymbolViewProps['name'];
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}

/**
 * IconSymbol (iOS)
 *
 * Implementación nativa de iOS usando expo-symbols (SF Symbols).
 * Renderiza el símbolo con tintColor, resizeMode y weight configurables.
 * Este archivo reemplaza automáticamente a icon-symbol.tsx en iOS.
 *
 * @prop name   - Nombre del SF Symbol (ej. "house.fill", "star.fill").
 * @prop size   - Tamaño en px. Por defecto 24.
 * @prop color  - Color del símbolo.
 * @prop style  - Estilos de vista adicionales.
 * @prop weight - Grosor del trazo: 'thin' | 'light' | 'regular' | 'medium' | 'bold'. Por defecto 'regular'.
 *
 * @example
 * <IconSymbol name="paperplane.fill" size={24} color="white" weight="medium" />
 */
