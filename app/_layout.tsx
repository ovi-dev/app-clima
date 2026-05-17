import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import 'react-native-reanimated';

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

  if (!fontsLoaded || completado === null) return null;

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
