import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCurrentWeather } from '@/hooks/use-weather';
import { useCityStore } from '@/store/city-store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Helpers ───────────────────────────────────────────────────────────────

type Gradient = readonly [string, string, ...string[]];

interface WeatherTheme {
  emoji: string;
  gradient: Gradient;
  accentColor: string;
  label: string;
}

function getWeatherTheme(conditionId: number, isNight: boolean): WeatherTheme {
  if (conditionId >= 200 && conditionId < 300)
    return { emoji: '⛈️', gradient: ['#0F172A', '#1E1B4B', '#312E81', '#1E1B4B'], accentColor: '#818CF8', label: 'Tormenta' };
  if (conditionId >= 300 && conditionId < 400)
    return { emoji: '🌦️', gradient: ['#1E293B', '#0F172A', '#1E293B', '#0F172A'], accentColor: '#60A5FA', label: 'Llovizna' };
  if (conditionId >= 500 && conditionId < 600)
    return { emoji: '🌧️', gradient: ['#1E3A8A', '#172554', '#0A0F1C', '#172554'], accentColor: '#93C5FD', label: 'Lluvia' };
  if (conditionId >= 600 && conditionId < 700)
    return { emoji: '❄️', gradient: ['#0C4A6E', '#0369A1', '#0284C7', '#0369A1'], accentColor: '#BAE6FD', label: 'Nieve' };
  if (conditionId >= 700 && conditionId < 800)
    return { emoji: '🌫️', gradient: ['#1E293B', '#334155', '#475569', '#334155'], accentColor: '#94A3B8', label: 'Niebla' };
  if (conditionId === 800) {
    if (isNight)
      return { emoji: '🌙', gradient: ['#020617', '#0F172A', '#1E1B4B', '#0F172A'], accentColor: '#C084FC', label: 'Despejado' };
    return { emoji: '☀️', gradient: ['#0EA5E9', '#2563EB', '#1D4ED8', '#2563EB'], accentColor: '#FCD34D', label: 'Soleado' };
  }
  return { emoji: '⛅', gradient: ['#1E40AF', '#1D4ED8', '#1E3A8A', '#1D4ED8'], accentColor: '#93C5FD', label: 'Nublado' };
}

function formatLocalTime(unixTimestamp: number, timezoneOffset: number): string {
  const date = new Date((unixTimestamp + timezoneOffset) * 1000);
  const h = date.getUTCHours().toString().padStart(2, '0');
  const m = date.getUTCMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

function getUVIndex(humidity: number, clouds: number): string {
  const score = 100 - humidity * 0.4 - clouds * 0.6;
  if (score > 75) return 'Alto';
  if (score > 50) return 'Moderado';
  return 'Bajo';
}

// ─── Screen ────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const { city, setCity } = useCityStore();
  const [input, setInput] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const searchAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  const { data, isLoading, isError, error, refetch, isRefetching } = useCurrentWeather({ q: city });

  const conditionId = data?.weather[0]?.id ?? 800;
  const icon = data?.weather[0]?.icon ?? '01d';
  const isNight = icon.endsWith('n');
  const theme = getWeatherTheme(conditionId, isNight);

  const toggleSearch = () => {
    const toValue = showSearch ? 0 : 1;
    setShowSearch(!showSearch);
    Animated.spring(searchAnim, { toValue, useNativeDriver: false, tension: 80, friction: 10 }).start();
  };

  const handleSearch = () => {
    const trimmed = input.trim();
    if (trimmed) {
      setCity(trimmed);
      setInput('');
      toggleSearch();
    }
  };

  const onRefresh = useCallback(() => { refetch(); }, [refetch]);

  const headerOpacity = scrollY.interpolate({ inputRange: [0, 80], outputRange: [0, 1], extrapolate: 'clamp' });

  return (
    <LinearGradient colors={theme.gradient} locations={[0, 0.35, 0.7, 1]} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>

        {/* ── Sticky mini-header on scroll ── */}
        <Animated.View style={[styles.stickyHeader, { opacity: headerOpacity }]}>
          <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
          <Text style={styles.stickyCity}>{data?.name ?? city}</Text>
          {data && (
            <Text style={styles.stickyTemp}>{Math.round(data.main.temp)}°</Text>
          )}
        </Animated.View>

        {/* ── Main Header ── */}
        <View style={styles.header}>
          <Pressable onPress={toggleSearch} style={styles.iconBtn} hitSlop={10}>
            <BlurView intensity={40} tint="dark" style={styles.iconBtnBlur}>
              <Ionicons name={showSearch ? 'close' : 'search'} size={19} color="rgba(255,255,255,0.9)" />
            </BlurView>
          </Pressable>

          <View style={styles.headerMeta}>
            <Ionicons name="location" size={12} color={theme.accentColor} />
            <Text style={styles.headerCity} numberOfLines={1}>{data?.name ?? city}</Text>
            {data?.sys?.country ? <Text style={[styles.headerCountry]}>, {data.sys.country}</Text> : null}
          </View>

          <Pressable onPress={() => refetch()} style={styles.iconBtn} hitSlop={10}>
            <BlurView intensity={40} tint="dark" style={styles.iconBtnBlur}>
              <Ionicons name="refresh" size={19} color="rgba(255,255,255,0.9)" />
            </BlurView>
          </Pressable>
        </View>

        {/* ── Search Bar ── */}
        {showSearch && (
          <Animated.View style={styles.searchWrapper}>
            <BlurView intensity={50} tint="dark" style={styles.searchBlur}>
              <Ionicons name="search" size={16} color="rgba(255,255,255,0.5)" />
              <TextInput
                style={styles.searchInput}
                value={input}
                onChangeText={setInput}
                placeholder="Buscar ciudad..."
                placeholderTextColor="rgba(255,255,255,0.35)"
                returnKeyType="search"
                onSubmitEditing={handleSearch}
                autoFocus
              />
              {input.length > 0 && (
                <Pressable onPress={handleSearch} hitSlop={8}>
                  <View style={[styles.searchSubmitBtn, { backgroundColor: theme.accentColor }]}>
                    <Ionicons name="arrow-forward" size={14} color="#000" />
                  </View>
                </Pressable>
              )}
            </BlurView>
          </Animated.View>
        )}

        <Animated.ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} tintColor="rgba(255,255,255,0.6)" />
          }
        >
          {/* ── Loading ── */}
          {isLoading && (
            <View style={styles.centered}>
              <View style={styles.loadingRing}>
                <ActivityIndicator size="large" color="white" />
              </View>
              <Text style={styles.loadingText}>Obteniendo el clima...</Text>
            </View>
          )}

          {/* ── Error ── */}
          {isError && !isLoading && (
            <View style={styles.centered}>
              <Text style={styles.bigEmoji}>😕</Text>
              <Text style={styles.errorTitle}>Sin conexión</Text>
              <Text style={styles.errorText}>{(error as Error)?.message ?? 'No se pudo cargar el clima'}</Text>
              <Pressable onPress={() => refetch()} style={styles.retryBtn}>
                <Text style={styles.retryText}>Reintentar</Text>
              </Pressable>
            </View>
          )}

          {/* ── Weather Data ── */}
          {data && !isLoading && (
            <>
              {/* Hero Temperature Block */}
              <View style={styles.heroBlock}>
                <Text style={styles.heroEmoji}>{theme.emoji}</Text>
                <Text style={styles.heroTemp}>{Math.round(data.main.temp)}°</Text>
                <View style={[styles.conditionBadge, { backgroundColor: `${theme.accentColor}20`, borderColor: `${theme.accentColor}40` }]}>
                  <Text style={[styles.conditionText, { color: theme.accentColor }]}>
                    {data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1)}
                  </Text>
                </View>
                <Text style={styles.heroRange}>
                  ↑ {Math.round(data.main.temp_max)}°  ·  ↓ {Math.round(data.main.temp_min)}°
                </Text>
                <Text style={styles.heroFeels}>
                  Sensación: {Math.round(data.main.feels_like)}°C
                </Text>
              </View>

              {/* ── Quick Stats Row ── */}
              <View style={styles.statsGrid}>
                <StatPill icon="water" value={`${data.main.humidity}%`} label="Humedad" accentColor={theme.accentColor} />
                <StatPill icon="navigate" value={`${data.wind.speed} m/s`} label="Viento" accentColor={theme.accentColor} />
                <StatPill icon="eye" value={`${(data.visibility / 1000).toFixed(0)} km`} label="Visibilidad" accentColor={theme.accentColor} />
              </View>

              {/* ── Detail Cards ── */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>DETALLES</Text>
                <View style={styles.detailGrid}>
                  <DetailTile
                    icon="thermometer"
                    label="Sensación"
                    value={`${Math.round(data.main.feels_like)}°C`}
                    accentColor={theme.accentColor}
                  />
                  <DetailTile
                    icon="speedometer"
                    label="Presión"
                    value={`${data.main.pressure} hPa`}
                    accentColor={theme.accentColor}
                  />
                  <DetailTile
                    icon="cloud"
                    label="Nubosidad"
                    value={`${data.clouds?.all ?? 0}%`}
                    accentColor={theme.accentColor}
                  />
                  <DetailTile
                    icon="sunny"
                    label="Índice UV"
                    value={getUVIndex(data.main.humidity, data.clouds?.all ?? 50)}
                    accentColor={theme.accentColor}
                  />
                </View>
              </View>

              {/* ── Sun Card ── */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>SOL</Text>
                <View style={styles.sunCard}>
                  <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
                  <SunRow
                    icon="sunny-outline"
                    label="Amanecer"
                    value={formatLocalTime(data.sys.sunrise, data.timezone)}
                    accentColor="#FCD34D"
                  />
                  <View style={styles.sunDivider} />
                  <SunRow
                    icon="moon-outline"
                    label="Atardecer"
                    value={formatLocalTime(data.sys.sunset, data.timezone)}
                    accentColor="#C084FC"
                  />
                </View>
              </View>
            </>
          )}
        </Animated.ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function StatPill({ icon, value, label, accentColor }: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  value: string;
  label: string;
  accentColor: string;
}) {
  return (
    <View style={styles.statPill}>
      <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={[styles.statIconWrap, { backgroundColor: `${accentColor}22` }]}>
        <Ionicons name={icon} size={16} color={accentColor} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function DetailTile({ icon, label, value, accentColor }: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  accentColor: string;
}) {
  return (
    <View style={styles.detailTile}>
      <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={[styles.detailIconWrap, { backgroundColor: `${accentColor}18` }]}>
        <Ionicons name={icon} size={20} color={accentColor} />
      </View>
      <Text style={styles.detailValue}>{value}</Text>
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
  );
}

function SunRow({ icon, label, value, accentColor }: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  accentColor: string;
}) {
  return (
    <View style={styles.sunRow}>
      <View style={[styles.sunIconWrap, { backgroundColor: `${accentColor}22` }]}>
        <Ionicons name={icon} size={18} color={accentColor} />
      </View>
      <Text style={styles.sunLabel}>{label}</Text>
      <Text style={styles.sunValue}>{value}</Text>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────

const GLASS_BG = 'rgba(255,255,255,0.07)';
const GLASS_BORDER = 'rgba(255,255,255,0.12)';

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { paddingBottom: 56 },

  // Sticky Header
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    overflow: 'hidden',
  },
  stickyCity: { color: 'white', fontSize: 15, fontWeight: '600' },
  stickyTemp: { color: 'white', fontSize: 15, fontWeight: '300' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 4,
    gap: 12,
  },
  headerMeta: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  headerCity: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  headerCountry: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 15,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: GLASS_BORDER,
  },
  iconBtnBlur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Search
  searchWrapper: {
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 8,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    height: 48,
  },
  searchBlur: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 15,
    height: '100%',
  },
  searchSubmitBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Generic states
  centered: {
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
    gap: 16,
  },
  loadingRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: GLASS_BG,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigEmoji: { fontSize: 56 },
  loadingText: { color: 'rgba(255,255,255,0.55)', fontSize: 15, letterSpacing: 0.3 },
  errorTitle: { color: 'white', fontSize: 20, fontWeight: '700' },
  errorText: { color: 'rgba(255,255,255,0.55)', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  retryBtn: {
    marginTop: 4,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: GLASS_BG,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
  },
  retryText: { color: 'white', fontSize: 15, fontWeight: '600', letterSpacing: 0.3 },

  // Hero
  heroBlock: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 32,
  },
  heroEmoji: {
    fontSize: 80,
    marginBottom: 0,
  },
  heroTemp: {
    fontSize: 110,
    fontWeight: '100',
    color: 'white',
    lineHeight: 116,
    letterSpacing: -4,
    includeFontPadding: false,
  },
  conditionBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 6,
  },
  conditionText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  heroRange: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    marginTop: 10,
    letterSpacing: 0.5,
    fontWeight: '400',
  },
  heroFeels: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 12,
    marginTop: 4,
    letterSpacing: 0.3,
  },

  // Stats
  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 10,
    marginBottom: 24,
  },
  statPill: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    backgroundColor: GLASS_BG,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 7,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { color: 'white', fontSize: 14, fontWeight: '600' },
  statLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: 0.3, textTransform: 'uppercase' },

  // Section
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 1.5,
    marginBottom: 10,
    marginLeft: 2,
  },

  // Detail Grid (2x2)
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  detailTile: {
    width: (SCREEN_WIDTH - 50) / 2,
    overflow: 'hidden',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    backgroundColor: GLASS_BG,
    padding: 18,
    gap: 8,
  },
  detailIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailValue: { color: 'white', fontSize: 20, fontWeight: '600', letterSpacing: -0.5 },
  detailLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '500' },

  // Sun Card
  sunCard: {
    overflow: 'hidden',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    backgroundColor: GLASS_BG,
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  sunRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 14,
  },
  sunIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunLabel: { flex: 1, color: 'rgba(255,255,255,0.6)', fontSize: 15, fontWeight: '500' },
  sunValue: { color: 'white', fontSize: 16, fontWeight: '600' },
  sunDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
});
