import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useState } from 'react';
import { Animated, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DailyForecast } from '@/components/weather/DailyForecast';
import { AirQualityWidget, DetailGrid, PollenWidget, RunSuggestionWidget } from '@/components/weather/DetailWidgets';
import { HourlyForecast } from '@/components/weather/HourlyForecast';
import { WeatherHero } from '@/components/weather/WeatherHero';
import { useCurrentWeather, useForecast } from '@/hooks/use-weather';
import { useCityStore } from '@/store/city-store';

export default function HomeScreen() {
  const { city } = useCityStore();
  const [scrollY] = useState(() => new Animated.Value(0));

  const { data: currentData, isLoading: loadingCurrent, refetch: refetchCurrent } = useCurrentWeather({ q: city });
  const { data: forecastData, isLoading: loadingForecast, refetch: refetchForecast } = useForecast({ q: city });

  const isRefetching = loadingCurrent || loadingForecast;

  const onRefresh = useCallback(() => {
    refetchCurrent();
    refetchForecast();
  }, [refetchCurrent, refetchForecast]);

  const headerOpacity = scrollY.interpolate({ inputRange: [0, 80], outputRange: [0, 1], extrapolate: 'clamp' });

  if (!currentData || !forecastData) {
    return (
      <LinearGradient colors={['#0F172A', '#020617']} style={styles.gradient}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Cargando cielo estrellado...</Text>
        </View>
      </LinearGradient>
    );
  }

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
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} tintColor="rgba(255,255,255,0.6)" />}
      >
        <WeatherHero
          city={currentData.name}
          temp={currentData.main.temp}
          condition={currentData.weather[0]?.description.charAt(0).toUpperCase() + currentData.weather[0]?.description.slice(1)}
          tempMax={currentData.main.temp_max}
          tempMin={currentData.main.temp_min}
          feelsLike={currentData.main.feels_like}
          summaryText={`Cielo mayormente despejado. Mínima de ${Math.round(currentData.main.temp_min)} C.`}
        />

        <HourlyForecast data={forecastData.list} />

        <DailyForecast data={forecastData.list} />

        <RunSuggestionWidget />

        <AirQualityWidget />

        <PollenWidget />

        <DetailGrid
          uv="Bajo"
          humidity={`${currentData.main.humidity}%`}
          windSpeed={`${currentData.wind.speed}`}
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
  },
  loadingText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
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
