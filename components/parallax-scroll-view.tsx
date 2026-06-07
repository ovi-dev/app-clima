import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollOffset } from 'react-native-reanimated';

import { useThemeColors } from '@/theme/hooks/useThemeColors';
import { ThemedView } from './themed-view';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({ children, headerImage, headerBackgroundColor }: Props) {
  const themeColors = useThemeColors();
  const backgroundColor = themeColors.general.background;
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  return (
    <Animated.ScrollView ref={scrollRef} style={{ backgroundColor, flex: 1 }} scrollEventThrottle={16}>
      <Animated.View style={[styles.header, headerAnimatedStyle]}>{headerImage}</Animated.View>
      <ThemedView style={styles.content}>{children}</ThemedView>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
});

/**
 * ParallaxScrollView
 *
 * ScrollView con efecto parallax en la cabecera. Al hacer scroll hacia abajo
 * la imagen del header se mueve más lento que el contenido (parallax), y al
 * hacer pull-to-top se escala ligeramente para dar profundidad.
 *
 * @prop headerImage      - Elemento React que se renderiza como imagen de cabecera.
 * @prop headerBackgroundColor - Color de fondo del header para modo claro y oscuro.
 * @prop children         - Contenido principal de la pantalla.
 *
 * @example
 * <ParallaxScrollView
 *   headerImage={<Image source={require('@/assets/images/bg.png')} style={{ width: '100%' }} />}
 *   headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
 * >
 *   <Text>Contenido</Text>
 * </ParallaxScrollView>
 */
