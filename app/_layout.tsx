import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from 'expo-router/react-navigation';
import * as SplashScreenExpo from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import CustomSplashScreen from '@/components/ui/SplashScreen';
import { fontConfig } from '@/constants/fontConfig';
import { useOnboarding } from '@/hooks/use-onboarding';
import { getCurrentWeather, getForecast } from '@/services/service.clima';
import { useCityStore } from '@/store/city-store';
import { useColorScheme } from '@/theme/hooks/useColorScheme';
import { useThemeColors } from '@/theme/hooks/useThemeColors';
import { WeatherParams } from '@/types/clima.type';

// Mantiene una única caché de consultas durante toda la vida de la aplicación.
const queryClient = new QueryClient();

// Conserva el splash nativo visible hasta que las fuentes y el estado persistido estén listos.
SplashScreenExpo.preventAutoHideAsync();
// Suaviza la transición del splash nativo hacia la primera vista de React Native.
SplashScreenExpo.setOptions({ duration: 300, fade: true });

// Coordina la preparación inicial, el tema y las rutas principales de la aplicación.
export default function RootLayout() {
  // Carga las fuentes antes de renderizar contenido para evitar cambios visuales posteriores.
  const [fontsLoaded] = useFonts(fontConfig);
  // Obtiene el tema del sistema y los colores correspondientes de la aplicación.
  const colorScheme = useColorScheme();
  const themeColors = useThemeColors();
  // Lee si el onboarding terminó y espera a que su estado persistido se restaure.
  const { completed: completado } = useOnboarding();
  // Recupera la ciudad activa y confirma que AsyncStorage ya fue leído.
  const { city, activeLat, activeLon, hasHydrated: cityHydrated } = useCityStore();
  // Registra cuándo termina la animación Lottie del splash personalizado.
  const [splashDone, setSplashDone] = useState(false);

  // Adapta React Navigation al tema claro u oscuro de la aplicación.
  const baseTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const navigationTheme: Theme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: themeColors.general.background,
      card: themeColors.general.background,
    },
  };

  // Sincroniza el fondo nativo del sistema para evitar destellos al cambiar de pantalla.
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(themeColors.general.background);
  }, [themeColors.general.background]);

  // Precarga en paralelo el clima actual y el pronóstico de la ciudad activa.
  useEffect(() => {
    // Espera a conocer la ciudad persistida para no consultar una ubicación incorrecta.
    if (!cityHydrated) return;

    // Prefiere coordenadas exactas; usa el nombre de la ciudad como alternativa.
    const weatherParams: WeatherParams =
      activeLat !== null && activeLon !== null ? { lat: activeLat, lon: activeLon } : { q: city };

    // Guarda ambas respuestas en React Query para acelerar la apertura de Inicio.
    void Promise.all([
      queryClient.prefetchQuery({
        queryKey: ['weather', weatherParams],
        // Solicita las condiciones meteorológicas actuales.
        queryFn: () => getCurrentWeather(weatherParams),
      }),
      queryClient.prefetchQuery({
        queryKey: ['forecast', weatherParams],
        // Solicita el pronóstico de los próximos días.
        queryFn: () => getForecast(weatherParams),
      }),
    ]);
  }, [activeLat, activeLon, city, cityHydrated]);

  // Oculta el splash nativo cuando las fuentes y el estado del onboarding están listos.
  useEffect(() => {
    if (fontsLoaded && completado !== null) {
      SplashScreenExpo.hide();
    }
  }, [fontsLoaded, completado]);

  if (!fontsLoaded || completado === null) return null;

  // Muestra Lottie una vez; su callback habilita el navegador principal.
  if (!splashDone) {
    return <CustomSplashScreen onFinish={() => setSplashDone(true)} />;
  }

  return (
    // Permite que todas las pantallas compartan la caché de datos meteorológicos.
    <QueryClientProvider client={queryClient}>
      {/* Comparte colores y apariencia con todos los navegadores. */}
      <ThemeProvider value={navigationTheme}>
        <Stack
          screenOptions={{
            animation: 'none',
            contentStyle: { backgroundColor: themeColors.general.background },
          }}
        >
          {/* Habilita la aplicación principal únicamente después del onboarding. */}
          <Stack.Protected guard={completado}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack.Protected>
          {/* Habilita el onboarding únicamente mientras esté pendiente. */}
          <Stack.Protected guard={!completado}>
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          </Stack.Protected>
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
