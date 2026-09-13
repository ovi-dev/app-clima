import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Animated, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DailyForecast } from '@/components/weather/DailyForecast';
import { AirQualityWidget, DetailGrid, PollenWidget, RunSuggestionWidget } from '@/components/weather/DetailWidgets';
import { HourlyForecast } from '@/components/weather/HourlyForecast';
import { WeatherHero } from '@/components/weather/WeatherHero';
import { useAirQuality, useCurrentUV, useCurrentWeather, useForecast } from '@/hooks/use-weather';
import { useCityStore } from '@/store/city-store';
import { WeatherParams } from '@/types/clima.type';

export default function HomeScreen() {
  const router = useRouter();
  const { city, activeLat, activeLon, hasHydrated } = useCityStore();
  const [scrollY] = useState(() => new Animated.Value(0));
  const weatherParams: WeatherParams =
    activeLat !== null && activeLon !== null ? { lat: activeLat, lon: activeLon } : { q: city };

  const {
    data: currentData,
    isLoading: loadingCurrent,
    isError: currentError,
    refetch: refetchCurrent,
  } = useCurrentWeather(weatherParams, hasHydrated);
  const {
    data: forecastData,
    isLoading: loadingForecast,
    isError: forecastError,
    refetch: refetchForecast,
  } = useForecast(weatherParams, hasHydrated);
  const {
    data: uvData,
    isLoading: loadingUV,
    refetch: refetchUV,
  } = useCurrentUV(
    currentData ? { lat: currentData.coord.lat, lon: currentData.coord.lon } : { lat: 0, lon: 0 },
    Boolean(currentData),
  );
  const {
    data: airQualityData,
    isLoading: loadingAirQuality,
    refetch: refetchAirQuality,
  } = useAirQuality(
    currentData ? { lat: currentData.coord.lat, lon: currentData.coord.lon } : { lat: 0, lon: 0 },
    Boolean(currentData),
  );

  const isRefetching = loadingCurrent || loadingForecast || loadingUV || loadingAirQuality;

  const onRefresh = useCallback(() => {
    refetchCurrent();
    refetchForecast();
    refetchUV();
    refetchAirQuality();
  }, [refetchCurrent, refetchForecast, refetchUV, refetchAirQuality]);

  const headerOpacity = scrollY.interpolate({ inputRange: [0, 80], outputRange: [0, 1], extrapolate: 'clamp' });

  if (!hasHydrated || loadingCurrent || loadingForecast) {
    return (
      <LinearGradient colors={['#0F172A', '#020617']} style={styles.gradient}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#7DD3FC" />
          <Text style={styles.loadingText}>Actualizando el pronóstico...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (currentError || forecastError || !currentData || !forecastData) {
    return (
      <LinearGradient colors={['#0F172A', '#020617']} style={styles.gradient}>
        <View style={styles.centered}>
          <Ionicons name="cloud-offline-outline" size={44} color="rgba(255,255,255,0.55)" />
          <Text style={styles.errorTitle}>No pudimos cargar el clima</Text>
          <Text style={styles.errorText}>Comprueba tu conexión o selecciona otra ciudad.</Text>
          <View style={styles.errorActions}>
            <Pressable onPress={() => router.navigate('/explore')} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Cambiar ciudad</Text>
            </Pressable>
            <Pressable onPress={onRefresh} style={styles.retryButton}>
              <Ionicons name="refresh" size={17} color="#07101E" />
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    );
  }

  const uvValue = uvData?.value ?? 0;
  const uvLabel =
    uvValue <= 2
      ? 'Riesgo bajo'
      : uvValue <= 5
        ? 'Riesgo moderado'
        : uvValue <= 7
          ? 'Riesgo alto'
          : uvValue <= 10
            ? 'Riesgo muy alto'
            : 'Riesgo extremo';
  const aqiValue = airQualityData?.list[0]?.main.aqi ?? 0;
  const windDirection = (() => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
    const index = Math.round((currentData.wind.deg % 360) / 45) % directions.length;
    return directions[index];
  })();

  return (
    <LinearGradient colors={['#07101E', '#0A1526', '#020617']} locations={[0, 0.4, 1]} style={styles.gradient}>
      {/* ── Sticky Header ── */}
      <Animated.View style={[styles.stickyHeader, { opacity: headerOpacity }]}>
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.stickyContent}>
          <Ionicons name="location-outline" size={16} color="white" />
          <Text style={styles.stickyCity}>{currentData.name}</Text>
        </View>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} tintColor="rgba(255,255,255,0.6)" />
        }
      >
        <WeatherHero
          city={currentData.name}
          country={currentData.sys.country}
          temp={currentData.main.temp}
          condition={
            currentData.weather[0]?.description.charAt(0).toUpperCase() + currentData.weather[0]?.description.slice(1)
          }
          tempMax={currentData.main.temp_max}
          tempMin={currentData.main.temp_min}
          feelsLike={currentData.main.feels_like}
          summaryText={`Cielo mayormente despejado. Mínima de ${Math.round(currentData.main.temp_min)} C.`}
          onCityPress={() => router.navigate('/explore')}
        />

        <HourlyForecast data={forecastData.list} />

        <DailyForecast data={forecastData.list} />

        <RunSuggestionWidget />

        <AirQualityWidget aqi={aqiValue} />

        <PollenWidget />

        <DetailGrid
          uvLabel={uvLabel}
          uvValue={uvValue.toFixed(1)}
          humidity={`${currentData.main.humidity}%`}
          windSpeed={currentData.wind.speed.toFixed(1)}
          windDirection={windDirection}
          dewPoint="6°"
          pressure={`${currentData.main.pressure} mb`}
          visibility={`${(currentData.visibility / 1000).toFixed(2)} km`}
        />

        <SafeAreaView edges={['bottom']} style={{ height: 40 }} />
      </Animated.ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
  },
  errorTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  errorText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    textAlign: 'center',
  },
  errorActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  secondaryButton: {
    paddingHorizontal: 16,
    height: 44,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  secondaryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  retryButton: {
    height: 44,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#7DD3FC',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#07101E',
    fontWeight: '700',
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    height: 100, // Adjusted to match typical iPhone notch/dynamic island
    paddingTop: 50, // Avoid overlapping notch
    paddingHorizontal: 24,
  },
  stickyContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  stickyCity: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
