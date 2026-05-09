import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { AppButton } from "@/components/ui/Button/app-button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useOnboarding } from "@/hooks/use-onboarding";
import { useThemeColors } from "@/theme/hooks/useThemeColors";
import { useWithAppTheme } from "@/theme/hooks/useWithAppTheme";
import { ThemeColors } from "@/theme/types/themeColors";

const STEPS = [
  {
    key: "1",
    title: "Tu clima, claro y a tiempo",
    subtitle:
      "Consulta el tiempo actual, la temperatura y los cambios del dia con una experiencia visual simple, amigable y pensada para entender el clima de un vistazo.",
    icon: "cloud.sun.fill" as const,
  },
  {
    key: "2",
    title: "Alertas que te ayudan a anticiparte",
    subtitle:
      "Recibe avisos de calor intenso, frio extremo y cambios importantes en el pronostico para actuar antes de que el clima te tome por sorpresa.",
    icon: "star.fill" as const,
  },
  {
    key: "3",
    title: "Pronosticos por hora, por dia y en otras ciudades",
    subtitle:
      "Consulta temperaturas por hora, el resumen de los proximos dias y compara el clima de otras ciudades con una interfaz mas cercana y facil de usar. ¿Comenzamos?",
    icon: "map.fill" as const,
  },
];

export default function OnboardingScreen() {
  const styles = useWithAppTheme(createStyles);
  const themeColors = useThemeColors();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const router = useRouter();
  const { completeOnboarding } = useOnboarding();

  const carouselRef = useRef<ICarouselInstance>(null);
  const progress = useSharedValue(0);
  const [step, setStep] = useState(0);

  const isLast = step === STEPS.length - 1;
  const carouselHeight = Math.min(Math.max(height * 0.58, 420), 540);

  const handleNext = async () => {
    if (isLast) {
      await completeOnboarding();
      router.replace("/(tabs)");
      return;
    }

    carouselRef.current?.scrollTo({
      count: 1,
      animated: true,
    });
  };

  const handleSkip = async () => {
    await completeOnboarding();
    router.replace("/(tabs)");
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
          onProgressChange={progress}
          style={styles.carousel}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.92,
            parallaxScrollingOffset: 50,
          }}
          renderItem={({ item }) => (
            <View style={[styles.page, { width }]}>
              <View style={styles.imageContainer}>
                <View style={styles.iconCircle}>
                  <IconSymbol
                    name={item.icon}
                    size={100}
                    color={themeColors.general.background}
                  />
                </View>
              </View>

              <View style={styles.textContainer}>
                <ThemedText type="title" style={styles.title}>
                  {item.title}
                </ThemedText>
                <ThemedText style={styles.subtitle}>{item.subtitle}</ThemedText>
              </View>
            </View>
          )}
        />
      </View>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom + 20, 32) },
        ]}
      >
        <Pagination.Basic
          progress={progress}
          data={STEPS}
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}
          containerStyle={styles.pagination}
          onPress={(index) => {
            carouselRef.current?.scrollTo({
              count: index - step,
              animated: true,
            });
          }}
        />

        <AppButton
          label={isLast ? "Comenzar" : "Siguiente"}
          onPress={handleNext}
          variant="primary"
        />

        <AppButton label="Saltar" onPress={handleSkip} variant="ghost" />
      </View>
    </View>
  );
}

const createStyles = (Color: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.general.background,
    },
    carouselWrapper: {
      flex: 1,
      justifyContent: "center",
    },
    carousel: {
      width: "100%",
    },
    page: {
      flex: 1,
      alignItems: "center",
      paddingHorizontal: 32,
      paddingTop: 12,
      justifyContent: "center",
    },
    imageContainer: {
      flex: 0.58,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
    iconCircle: {
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: Color.button.buttonBackground,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: Color.button.buttonBackground,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 10,
    },
    textContainer: {
      flex: 0.42,
      alignItems: "center",
      justifyContent: "flex-start",
      width: "100%",
      paddingTop: 12,
    },
    title: {
      color: Color.onboarding.titleText,
      fontSize: 28,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 16,
    },
    subtitle: {
      color: Color.onboarding.subtitleText,
      fontSize: 16,
      lineHeight: 24,
      textAlign: "center",
      maxWidth: 320,
    },
    footer: {
      paddingHorizontal: 32,
      paddingTop: 12,
      gap: 18,
    },
    pagination: {
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      minHeight: 12,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 999,
      backgroundColor: Color.button.buttonBackground,
      opacity: 0.35,
    },
    activeDot: {
      width: 18,
      height: 8,
      borderRadius: 999,
      backgroundColor: Color.button.buttonBackground,
    },
  });
