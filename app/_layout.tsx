import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Redirect, Stack } from 'expo-router';
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from 'expo-router/react-navigation';
import * as SplashScreenExpo from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import CustomSplashScreen from '@/components/ui/SplashScreen';
import { fontConfig } from '@/constants/fontConfig';
import { useOnboarding } from '@/hooks/use-onboarding';
import { useColorScheme } from '@/theme/hooks/useColorScheme';
import { useThemeColors } from '@/theme/hooks/useThemeColors';

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded] = useFonts(fontConfig);
  const colorScheme = useColorScheme();
  const themeColors = useThemeColors();
  const { completed: completado } = useOnboarding();
  const [splashDone, setSplashDone] = useState(false);

  const baseTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
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

  // Ocultar el splash nativo una vez que las fuentes y el onboarding estén listos
  useEffect(() => {
    if (fontsLoaded && completado !== null) {
      SplashScreenExpo.hide();
    }
  }, [fontsLoaded, completado]);

  if (!fontsLoaded || completado === null) return null;

  // Mostrar el splash personalizado (Lottie) hasta que termine la animación
  if (!splashDone) {
    return <CustomSplashScreen onFinish={() => setSplashDone(true)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={navigationTheme}>
        {completado === false && <Redirect href="/onboarding" />}
        <Stack
          screenOptions={{
            animation: 'none',
            contentStyle: { backgroundColor: themeColors.general.background },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
