import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ForecastItem } from '@/types/clima.type';
import { WidgetCard } from './WidgetCard';

interface HourlyForecastProps {
  data: ForecastItem[];
}

export function HourlyForecast({ data }: HourlyForecastProps) {
  // Taking the next 8 items (24 hours since they are 3-hour blocks in free API)
  const hourlyData = data.slice(0, 8);

  const getIconName = (iconCode: string) => {
    // Simple mapper for openweather icons to ionicons
    if (iconCode.includes('01')) return iconCode.includes('n') ? 'moon' : 'sunny';
    if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) return 'partly-sunny';
    if (iconCode.includes('09') || iconCode.includes('10')) return 'rainy';
    if (iconCode.includes('11')) return 'thunderstorm';
    if (iconCode.includes('13')) return 'snow';
    return 'cloud';
  };

  return (
    <WidgetCard style={styles.card}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {hourlyData.map((item, index) => {
          const date = new Date(item.dt * 1000);
          const hours = date.getHours();
          const timeLabel = index === 0 ? 'Ahora' : `${hours}:00`;
          const isNight = item.sys.pod === 'n';

          return (
            <View key={item.dt} style={styles.itemContainer}>
              <Text style={styles.timeText}>{timeLabel}</Text>
              <Ionicons
                name={getIconName(item.weather[0].icon) as any}
                size={24}
                color={isNight ? '#cbd5e1' : '#fcd34d'}
                style={styles.icon}
              />
              <Text style={styles.tempText}>{Math.round(item.main.temp)}°</Text>

              {/* Faux Chart point */}
              <View style={styles.chartLineContainer}>
                {index > 0 && <View style={styles.lineLeft} />}
                {index < hourlyData.length - 1 && <View style={styles.lineRight} />}
                <View style={styles.chartDot} />
              </View>

              <View style={styles.rainContainer}>
                <Ionicons name="water" size={10} color="#93c5fd" />
                <Text style={styles.rainText}>{Math.round(item.pop * 100)}%</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Previsión de 48 horas {'>'}</Text>
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
  scrollContent: {
    paddingVertical: 12,
    gap: 16,
  },
  itemContainer: {
    alignItems: 'center',
    width: 50,
  },
  timeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  icon: {
    marginBottom: 8,
  },
  tempText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  chartLineContainer: {
    height: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  chartDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
    zIndex: 1,
  },
  lineLeft: {
    position: 'absolute',
    left: -25,
    right: 25,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  lineRight: {
    position: 'absolute',
    left: 25,
    right: -25,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  rainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rainText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    fontWeight: '600',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    alignItems: 'flex-end',
  },
  footerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '500',
  },
});
