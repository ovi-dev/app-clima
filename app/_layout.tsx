import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import "react-native-reanimated";

import { useOnboarding } from "@/hooks/use-onboarding";
import { useColorScheme } from "@/theme/hooks/useColorScheme";
import { useThemeColors } from "@/theme/hooks/useThemeColors";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const themeColors = useThemeColors();
  const { completed } = useOnboarding();

  const baseTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  const navigationTheme: Theme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: themeColors.general.background,
      card: themeColors.general.background,
    },
  };

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(themeColors.general.background);
  }, [themeColors.general.background]);

  if (completed === null) return null;

  return (
    <ThemeProvider value={navigationTheme}>
      {completed === false && <Redirect href="/onboarding" />}
      <Stack
        screenOptions={{
          animation: "none",
          contentStyle: { backgroundColor: themeColors.general.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}
