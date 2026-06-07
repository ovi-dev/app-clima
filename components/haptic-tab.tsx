import * as Haptics from 'expo-haptics';
import { BottomTabBarButtonProps } from 'expo-router/js-tabs';
import { PlatformPressable } from 'expo-router/react-navigation';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={ev => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}

/**
 * HapticTab
 *
 * Reemplazo del botón de tab de la barra de navegación inferior que añade
 * vibración háptica suave (Light) al presionar en iOS. En otras plataformas
 * se comporta igual que el botón nativo.
 *
 * @example
 * // En el layout de tabs:
 * <Tabs screenOptions={{ tabBarButton: HapticTab }} />
 */
