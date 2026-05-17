import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useForecast } from '@/hooks/use-weather';
import { useCityStore } from '@/store/city-store';
import { ForecastItem } from '@/types/clima.type';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Constants ─────────────────────────────────────────────────────────────

const BG_GRADIENT = ['#020617', '#0F172A', '#1E1B4B', '#0F172A'] as const;
const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const GLASS_BG = 'rgba(255,255,255,0.07)';
const GLASS_BORDER = 'rgba(255,255,255,0.11)';

// ─── Helpers ───────────────────────────────────────────────────────────────

function groupByDay(list: ForecastItem[]): ForecastItem[] {
  const byDay = new Map<string, ForecastItem>();
  for (const item of list) {
    const day = item.dt_txt.slice(0, 10);
    if (!byDay.has(day) || item.dt_txt.includes('12:00:00')) byDay.set(day, item);
  }
  return Array.from(byDay.values()).slice(0, 5);
}

function getDayLabel(dt_txt: string, index: number): string {
  if (index === 0) return 'Hoy';
  const date = new Date(dt_txt.replace(' ', 'T') + 'Z');
  return WEEKDAYS[date.getUTCDay()];
}

function getEmoji(conditionId: number, icon: string): string {
  const isNight = icon.endsWith('n');
  if (conditionId >= 200 && conditionId < 300) return '⛈️';
  if (conditionId >= 300 && conditionId < 400) return '🌦️';
  if (conditionId >= 500 && conditionId < 600) return '🌧️';
  if (conditionId >= 600 && conditionId < 700) return '❄️';
  if (conditionId >= 700 && conditionId < 800) return '🌫️';
  if (conditionId === 800) return isNight ? '🌙' : '☀️';
  return '⛅';
}

function getTempBarWidth(tempMin: number, tempMax: number, absMin: number, absMax: number): number {
  const range = absMax - absMin || 1;
  const barStart = ((tempMin - absMin) / range) * 100;
  const barWidth = ((tempMax - tempMin) / range) * 100;
  return Math.max(barWidth, 8);
}

function getTempColor(temp: number): string {
  if (temp >= 35) return '#FF5F15';
  if (temp >= 25) return '#FCD34D';
  if (temp >= 10) return '#60A5FA';
  return '#BAE6FD';
}

// ─── Screen ────────────────────────────────────────────────────────────────

export default function ForecastScreen() {
  const { city } = useCityStore();
  const { data, isLoading, isError, error, refetch } = useForecast({ q: city });

  const days = data ? groupByDay(data.list) : [];
  const cityName = data?.city.name ?? city;
  const country = data?.city.country ?? '';

  // Global temp range for the bar chart
  const allTemps = days.flatMap(d => [d.main.temp_min, d.main.temp_max]);
  const absMin = Math.min(...allTemps);
  const absMax = Math.max(...allTemps);

  return (
    <LinearGradient colors={BG_GRADIENT} locations={[0, 0.3, 0.65, 1]} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Pronóstico</Text>
            <View style={styles.headerCityRow}>
              <Ionicons name="location" size={12} color="#818CF8" />
              <Text style={styles.headerSubtitle}>
                {cityName}{country ? `, ${country}` : ''}
              </Text>
            </View>
          </View>

          <Pressable onPress={() => refetch()} style={styles.iconBtn} hitSlop={10}>
            <BlurView intensity={40} tint="dark" style={styles.iconBtnBlur}>
              <Ionicons name="refresh" size={18} color="rgba(255,255,255,0.85)" />
            </BlurView>
          </Pressable>
        </View>

        {/* ── Loading ── */}
        {isLoading && (
          <View style={styles.centered}>
            <View style={styles.loadingRing}>
              <ActivityIndicator size="large" color="white" />
            </View>
            <Text style={styles.loadingText}>Cargando pronóstico...</Text>
          </View>
        )}

        {/* ── Error ── */}
        {isError && !isLoading && (
          <View style={styles.centered}>
            <Text style={styles.bigEmoji}>😕</Text>
            <Text style={styles.errorTitle}>Sin datos</Text>
            <Text style={styles.errorText}>{(error as Error)?.message ?? 'No se pudo cargar'}</Text>
            <Pressable onPress={() => refetch()} style={styles.retryBtn}>
              <Text style={styles.retryText}>Reintentar</Text>
            </Pressable>
          </View>
        )}

        {/* ── Forecast List ── */}
        {!isLoading && !isError && days.length > 0 && (
          <FlatList
            data={days}
            keyExtractor={item => item.dt_txt}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <Text style={styles.listSectionLabel}>PRÓXIMOS 5 DÍAS</Text>
            }
            renderItem={({ item, index }) => (
              <ForecastCard
                item={item}
                index={index}
                absMin={absMin}
                absMax={absMax}
              />
            )}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── ForecastCard ──────────────────────────────────────────────────────────

function ForecastCard({
  item,
  index,
  absMin,
  absMax,
}: {
  item: ForecastItem;
  index: number;
  absMin: number;
  absMax: number;
}) {
  const cond = item.weather[0];
  const emoji = getEmoji(cond.id, cond.icon);
  const label = getDayLabel(item.dt_txt, index);
  const desc = cond.description.charAt(0).toUpperCase() + cond.description.slice(1);
  const pop = Math.round(item.pop * 100);
  const barWidth = getTempBarWidth(item.main.temp_min, item.main.temp_max, absMin, absMax);
  const barColor = getTempColor((item.main.temp_max + item.main.temp_min) / 2);

  return (
    <View style={styles.card}>
      <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />

      {/* Left: Day + description */}
      <View style={styles.cardLeft}>
        <Text style={[styles.cardDay, index === 0 && styles.cardDayHighlight]}>{label}</Text>
        <Text style={styles.cardDesc} numberOfLines={1}>{desc}</Text>
        {pop > 0 && (
          <View style={styles.popRow}>
            <Ionicons name="rainy" size={10} color="#60A5FA" />
            <Text style={styles.popText}>{pop}%</Text>
          </View>
        )}
      </View>

      {/* Center: Emoji */}
      <Text style={styles.cardEmoji}>{emoji}</Text>

      {/* Right: Temps + bar */}
      <View style={styles.cardRight}>
        <View style={styles.tempRow}>
          <Text style={styles.tempMax}>↑ {Math.round(item.main.temp_max)}°</Text>
          <Text style={styles.tempMin}>↓ {Math.round(item.main.temp_min)}°</Text>
        </View>
        {/* Mini temperature bar */}
        <View style={styles.tempTrack}>
          <View style={[styles.tempBar, { width: `${barWidth}%`, backgroundColor: barColor }]} />
        </View>
      </View>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 12,
  },
  headerLeft: { flex: 1, gap: 4 },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    letterSpacing: -0.5,
  },
  headerCityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '500',
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

  // States
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 40,
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
  bigEmoji: { fontSize: 52 },
  loadingText: { color: 'rgba(255,255,255,0.5)', fontSize: 14, letterSpacing: 0.3 },
  errorTitle: { color: 'white', fontSize: 20, fontWeight: '700' },
  errorText: { color: 'rgba(255,255,255,0.5)', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  retryBtn: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: GLASS_BG,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
  },
  retryText: { color: 'white', fontSize: 15, fontWeight: '600' },

  // List
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 56,
    paddingTop: 8,
    gap: 10,
  },
  listSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 2,
  },

  // Card
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GLASS_BG,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    paddingVertical: 18,
    paddingHorizontal: 20,
    overflow: 'hidden',
    gap: 10,
  },
  cardLeft: { flex: 1, gap: 4 },
  cardDay: { fontSize: 16, fontWeight: '600', color: 'rgba(255,255,255,0.85)' },
  cardDayHighlight: { color: 'white' },
  cardDesc: { fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: '400' },
  popRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  popText: { fontSize: 11, color: '#60A5FA', fontWeight: '600' },

  cardEmoji: { fontSize: 36 },

  // Temps
  cardRight: { alignItems: 'flex-end', gap: 8, minWidth: 90 },
  tempRow: { flexDirection: 'row', gap: 10, alignItems: 'baseline' },
  tempMax: { fontSize: 16, fontWeight: '600', color: 'white' },
  tempMin: { fontSize: 13, color: 'rgba(255,255,255,0.4)' },
  tempTrack: {
    width: 90,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  tempBar: {
    height: '100%',
    borderRadius: 2,
    opacity: 0.85,
  },
});
