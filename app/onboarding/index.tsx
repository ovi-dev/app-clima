import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { 
  FlatList, 
  Pressable, 
  StyleSheet, 
  useWindowDimensions, 
  View, 
  ViewToken,
  Animated
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useOnboarding } from "@/hooks/use-onboarding";
import { useWithAppTheme } from "@/theme/hooks/useWithAppTheme";
import { useThemeColors } from "@/theme/hooks/useThemeColors";
import { ThemeColors } from "@/theme/types/themeColors";
import { IconSymbol } from "@/components/ui/icon-symbol";

const STEPS = [
  {
    key: "1",
    title: "Bienvenido a app-clima",
    subtitle: "Consulta el clima de tu ciudad en tiempo real con una interfaz hermosa y precisa.",
    icon: "cloud.sun.fill" as const,
  },
  {
    key: "2",
    title: "Siempre preparado",
    subtitle: "Guarda tus ubicaciones frecuentes y accede rápidamente al pronóstico desde tus favoritos.",
    icon: "star.fill" as const,
  },
  {
    key: "3",
    title: "Explora el mundo",
    subtitle: "Revisa mapas dinámicos y condiciones climatológicas en cualquier lugar del planeta. ¿Comenzamos?",
    icon: "map.fill" as const,
  },
];

export default function OnboardingScreen() {
  const styles = useWithAppTheme(createStyles);
  const themeColors = useThemeColors();
  
  const [step, setStep] = useState(0);
  const { completeOnboarding } = useOnboarding();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const isLast = step === STEPS.length - 1;

  const handleNext = async () => {
    if (isLast) {
      await completeOnboarding();
      router.replace("/(tabs)");
    } else {
      flatListRef.current?.scrollToIndex({ index: step + 1, animated: true });
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
    router.replace("/(tabs)");
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0] && viewableItems[0].index !== null) {
      setStep(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <View style={styles.container}>
      {/* Botón de Saltar */}
      <View style={styles.header}>
        {!isLast && (
          <Pressable style={styles.skipButton} onPress={handleSkip}>
            <ThemedText style={styles.skipText}>Saltar</ThemedText>
          </Pressable>
        )}
      </View>

      {/* Slider */}
      <Animated.FlatList
        ref={flatListRef}
        data={STEPS}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false } // false porque animamos dimensiones de width y backgroundColor
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfig}
        renderItem={({ item, index }) => {
          // Parallax y desvanecimiento
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.7, 1, 0.7],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <View style={[styles.page, { width }]}>
              <Animated.View style={[styles.imageContainer, { transform: [{ scale }], opacity }]}>
                 <View style={styles.iconCircle}>
                    <IconSymbol 
                      name={item.icon} 
                      size={100} 
                      color={themeColors.general.background} 
                    />
                 </View>
              </Animated.View>
              <View style={styles.textContainer}>
                <ThemedText type="title" style={styles.title}>
                  {item.title}
                </ThemedText>
                <ThemedText style={styles.subtitle}>{item.subtitle}</ThemedText>
              </View>
            </View>
          );
        }}
      />

      {/* Controles: Dots y Botón */}
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {STEPS.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i}
                style={[
                  styles.dot, 
                  { width: dotWidth, opacity }
                ]}
              />
            );
          })}
        </View>

        <Pressable 
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.8 }
          ]} 
          onPress={handleNext}
        >
          <ThemedText style={styles.buttonText}>
            {isLast ? "Comenzar" : "Siguiente"}
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const createStyles = (themeColors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.general.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingHorizontal: 24,
      paddingTop: 60,
      height: 100,
    },
    skipButton: {
      padding: 10,
    },
    skipText: {
      color: themeColors.general.textSecondary,
      fontSize: 16,
      fontWeight: '600',
    },
    page: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    imageContainer: {
      flex: 0.55,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    iconCircle: {
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: themeColors.button.buttonBackground,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: themeColors.button.buttonBackground,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 10,
    },
    textContainer: {
      flex: 0.45,
      alignItems: 'center',
      paddingTop: 20,
    },
    title: {
      color: themeColors.onboarding.titleText,
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 16,
    },
    subtitle: {
      color: themeColors.onboarding.subtitleText,
      fontSize: 16,
      lineHeight: 24,
      textAlign: 'center',
    },
    footer: {
      paddingHorizontal: 32,
      paddingBottom: 60,
      paddingTop: 20,
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 32,
      height: 10,
    },
    dot: {
      height: 8,
      borderRadius: 4,
      backgroundColor: themeColors.button.buttonBackground,
      marginHorizontal: 4,
    },
    button: {
      backgroundColor: themeColors.button.buttonBackground,
      paddingVertical: 18,
      borderRadius: 16,
      alignItems: 'center',
      shadowColor: themeColors.button.buttonBackground,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    buttonText: {
      color: themeColors.general.background,
      fontWeight: 'bold',
      fontSize: 18,
    },
  });
