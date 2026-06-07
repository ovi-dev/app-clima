import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { AppButton } from '@/components/ui/Button/app-button';
import { PaginationDots } from '@/components/ui/PaginationDots/pagination-dots';
import { useOnboarding } from '@/hooks/use-onboarding';
import { useThemeColors } from '@/theme/hooks/useThemeColors';
import { useWithAppTheme } from '@/theme/hooks/useWithAppTheme';
import { ThemeColors } from '@/theme/types/themeColors';

const STEPS = [
  {
    key: '1',
    title: 'Tu clima, claro y a tiempo',
    subtitle:
      'Consulta el tiempo actual, la temperatura y los cambios del día con una experiencia visual simple, amigable y pensada para entender el clima de un vistazo.',
    image: require('@/assets/images/diaSoleado.png'),
  },
  {
    key: '2',
    title: 'Alertas que te ayudan a anticiparte',
    subtitle:
      'Recibe avisos de calor intenso, frío extremo y cambios importantes en el pronóstico para actuar antes de que el clima te tome por sorpresa.',
    image: require('@/assets/images/screen2.png'),
  },
  {
    key: '3',
    title: 'Pronósticos por hora y día',
    subtitle:
      'Consulta temperaturas por hora, el resumen de los próximos días y compara el clima de otras ciudades con una interfaz más cercana y fácil de usar. ¿Comenzamos?',
    image: require('@/assets/images/diaOtono.png'),
  },
];

export default function OnboardingScreen() {
  const styles = useWithAppTheme(createStyles);
  const themeColors = useThemeColors();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const router = useRouter();
  const { completeOnboarding: completarOnboarding } = useOnboarding();

  const carouselRef = useRef<ICarouselInstance>(null);
  const [step, setStep] = useState(0);
  const progress = useSharedValue(0);

  const isLast = step === STEPS.length - 1;
  const carouselHeight = Math.min(Math.max(height * 0.70, 520), 700);

  const handleNext = async () => {
    if (isLast) {
      await completarOnboarding();
      router.replace('/(tabs)');
      return;
    }
    carouselRef.current?.scrollTo({ count: 1, animated: true });
  };

  const handleSkip = async () => {
    await completarOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.carouselWrapper}>
        <Carousel
          ref={carouselRef}
          loop={false}
          width={width}
          height={carouselHeight}
          data={STEPS}
          pagingEnabled
          snapEnabled
          onSnapToItem={setStep}
          onProgressChange={(_offset, absolute) => {
            progress.value = absolute;
          }}
          style={styles.carousel}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.95,
            parallaxScrollingOffset: 40,
          }}
          renderItem={({ item, animationValue }) => (
            <CarouselItem
              item={item}
              animationValue={animationValue}
              width={width}
              styles={styles}
            />
          )}
        />
      </View>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom + 20, 32) }]}>
        <View style={styles.paginationContainer}>
          <PaginationDots
            total={STEPS.length}
            progress={progress}
            color={themeColors.button.buttonBackground}
            onPress={index => carouselRef.current?.scrollTo({ count: index - step, animated: true })}
          />
        </View>

        <AppButton label={isLast ? 'Comenzar' : 'Siguiente'} onPress={handleNext} variant="primary" />
        <AppButton label="Saltar" onPress={handleSkip} variant="ghost" />
      </View>
    </View>
  );
}

const CarouselItem = ({ item, animationValue, width, styles }: any) => {
  const animatedImageStyle = useAnimatedStyle(() => {
    const scale = interpolate(animationValue.value, [-1, 0, 1], [0.85, 1, 0.85], Extrapolation.CLAMP);
    return { transform: [{ scale }] };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const translateY = interpolate(animationValue.value, [-1, 0, 1], [40, 0, 40], Extrapolation.CLAMP);
    const opacity = interpolate(animationValue.value, [-1, 0, 1], [0, 1, 0], Extrapolation.CLAMP);
    return { transform: [{ translateY }], opacity };
  });

  return (
    <View style={[styles.page, { width }]}>
      <Animated.View style={[styles.imageContainer, animatedImageStyle]}>
        <Image
          source={item.image}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
      </Animated.View>

      <Animated.View style={[styles.textContainer, animatedTextStyle]}>
        <ThemedText type="title" style={styles.title}>
          {item.title}
        </ThemedText>
        <ThemedText style={styles.subtitle}>{item.subtitle}</ThemedText>
      </Animated.View>
    </View>
  );
};

const createStyles = (Color: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.general.background,
    },
    carouselWrapper: {
      flex: 1,
      justifyContent: 'center',
    },
    carousel: {
      width: '100%',
    },
    page: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingTop: 16,
      justifyContent: 'center',
    },
    imageContainer: {
      flex: 0.65,
      width: '100%',
      backgroundColor: 'transparent',
      borderRadius: 32,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.2,
      shadowRadius: 24,
      elevation: 8,
      marginBottom: 32,
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 32,
    },
    textContainer: {
      flex: 0.35,
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
      paddingHorizontal: 8,
    },
    title: {
      color: Color.onboarding.titleText,
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 16,
    },
    subtitle: {
      color: Color.onboarding.subtitleText,
      fontSize: 16,
      lineHeight: 24,
      textAlign: 'center',
      maxWidth: 320,
    },
    footer: {
      paddingHorizontal: 32,
      paddingTop: 12,
      gap: 16,
    },
    paginationContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
  });
