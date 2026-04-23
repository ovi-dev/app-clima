import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useOnboarding } from "@/hooks/use-onboarding";
import { useWithAppTheme } from "@/theme/hooks/useWithAppTheme";
import { ThemeColors } from "@/theme/types/themeColors";

const STEPS = [
  {
    title: "Bienvenido a app-clima",
    subtitle: "Consulta el clima de tu ciudad en tiempo real.",
  },
  {
    title: "Personaliza tu experiencia",
    subtitle: "Guarda tus ciudades favoritas y accede rápido a ellas.",
  },
  {
    title: "Todo listo",
    subtitle: "Empieza a explorar el clima donde estés.",
  },
];

export default function OnboardingScreen() {
  const styles = useWithAppTheme(createStyles);
  const [step, setStep] = useState(0);
  const { completeOnboarding } = useOnboarding();
  const router = useRouter();

  const isLast = step === STEPS.length - 1;

  const handleNext = async () => {
    if (isLast) {
      await completeOnboarding();
      router.replace("/(tabs)");
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      {/* Skip */}
      {!isLast && (
        <Pressable style={styles.skipButton} onPress={handleSkip}>
          <ThemedText style={styles.skipText}>Saltar</ThemedText>
        </Pressable>
      )}

      {/* Contenido */}
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          {STEPS[step].title}
        </ThemedText>
        <ThemedText style={styles.subtitle}>{STEPS[step].subtitle}</ThemedText>
      </View>

      {/* Footer: dots + botón */}
      <View style={styles.footer}>
        <View style={styles.dots}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === step && styles.dotActive]}
            />
          ))}
        </View>

        <Pressable style={styles.button} onPress={handleNext}>
          <ThemedText style={styles.buttonText}>
            {isLast ? "Empezar" : "Siguiente"}
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
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 40,
    },
    skipButton: {
      alignSelf: "flex-end",
    },
    skipText: {
      color: themeColors.general.textSecondary,
      fontSize: 14,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      gap: 16,
    },
    title: {
      color: themeColors.onboarding.titleText,
    },
    subtitle: {
      color: themeColors.onboarding.subtitleText,
      fontSize: 16,
      lineHeight: 24,
    },
    footer: {
      gap: 24,
    },
    dots: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: themeColors.onboarding.progressBarBackground,
    },
    dotActive: {
      width: 24,
      backgroundColor: themeColors.button.buttonBackground,
    },
    button: {
      backgroundColor: themeColors.button.buttonBackground,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
    },
    buttonText: {
      color: themeColors.general.background,
      fontWeight: "600",
      fontSize: 16,
    },
  });
