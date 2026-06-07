import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ForecastItem } from '@/types/clima.type';
import { WidgetCard } from './WidgetCard';

interface DailyForecastProps {
  data: ForecastItem[];
}

export function DailyForecast({ data }: DailyForecastProps) {
  // Aggregate data by day
  const dailyMap = new Map<string, { min: number; max: number; pop: number; iconDay: string; iconNight: string }>();

  data.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

    const isNight = item.sys.pod === 'n';

    if (!dailyMap.has(dayKey)) {
      dailyMap.set(dayKey, {
        min: item.main.temp_min,
        max: item.main.temp_max,
        pop: item.pop,
        iconDay: isNight ? '' : item.weather[0].icon,
        iconNight: isNight ? item.weather[0].icon : '',
      });
    } else {
      const existing = dailyMap.get(dayKey)!;
      existing.min = Math.min(existing.min, item.main.temp_min);
      existing.max = Math.max(existing.max, item.main.temp_max);
      existing.pop = Math.max(existing.pop, item.pop);
      if (!isNight && !existing.iconDay) existing.iconDay = item.weather[0].icon;
      if (isNight && !existing.iconNight) existing.iconNight = item.weather[0].icon;
      dailyMap.set(dayKey, existing);
    }
  });

  const dailyList = Array.from(dailyMap.entries()).slice(0, 7);

  const getDayName = (dateStr: string, index: number) => {
    if (index === 0) return 'Hoy';
    if (index === 1) return 'Mañana';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { weekday: 'short' }).toLowerCase();
  };

  const getIconName = (iconCode: string, fallback: string) => {
    if (!iconCode) return fallback;
    if (iconCode.includes('01')) return iconCode.includes('n') ? 'moon' : 'sunny';
    if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) return 'partly-sunny';
    if (iconCode.includes('09') || iconCode.includes('10')) return 'rainy';
    if (iconCode.includes('11')) return 'thunderstorm';
    if (iconCode.includes('13')) return 'snow';
    return 'cloud';
  };

  return (
    <WidgetCard style={styles.card}>
      <View style={styles.list}>
        {dailyList.map(([dateStr, info], index) => (
          <View key={dateStr} style={styles.row}>
            <Text style={styles.dayText}>{getDayName(dateStr, index)}</Text>
            
            <View style={styles.rainContainer}>
              <Ionicons name="water" size={10} color="#93c5fd" />
              <Text style={styles.rainText}>{Math.round(info.pop * 100)}%</Text>
            </View>

            <View style={styles.iconsContainer}>
              <Ionicons name={getIconName(info.iconDay, 'sunny') as any} size={20} color="#fcd34d" />
              <Ionicons name={getIconName(info.iconNight, 'moon') as any} size={20} color="#cbd5e1" />
            </View>

            <View style={styles.tempContainer}>
              <Text style={styles.tempMax}>{Math.round(info.max)}°</Text>
              <Text style={styles.tempMin}>{Math.round(info.min)}°</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Previsión de 15 días {'>'}</Text>
      </View>
    </WidgetCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingBottom: 0,
  },
  list: {
    gap: 16,
    paddingVertical: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayText: {
    flex: 2,
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  rainContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  rainText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '600',
  },
  iconsContainer: {
    flex: 1.5,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  tempContainer: {
    flex: 1.5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  tempMax: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  tempMin: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    marginTop: 12,
    alignItems: 'flex-end',
  },
  footerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '500',
  },
});
