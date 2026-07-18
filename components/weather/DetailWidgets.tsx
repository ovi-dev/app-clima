import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { WidgetCard } from './WidgetCard';

// ─── RUN SUGGESTION WIDGET ──────────────────────────────────────────────────
export function RunSuggestionWidget() {
  return (
    <WidgetCard style={styles.card}>
      <View style={styles.runHeader}>
        <Text style={styles.widgetTitle}>Correr</Text>
      </View>
      <View style={styles.runContent}>
        <View style={styles.runLeft}>
          <Ionicons name="walk" size={48} color="white" />
          <Text style={styles.runStatus}>Buena</Text>
          <Text style={styles.runDesc}>Buen tiempo para correr ahora mismo</Text>
        </View>
        <View style={styles.runRight}>
          <RunHour time="23:00" status="Buena" color="#84cc16" />
          <RunHour time="0:00" status="Buena" color="#84cc16" />
          <RunHour time="1:00" status="Buena" color="#84cc16" />
        </View>
      </View>
    </WidgetCard>
  );
}

function RunHour({ time, status, color }: { time: string; status: string; color: string }) {
  return (
    <View style={styles.runHour}>
      <Text style={styles.runTimeText}>{time}</Text>
      <Ionicons name="happy" size={24} color={color} />
      <Text style={styles.runStatusText}>{status}</Text>
    </View>
  );
}

// ─── AIR QUALITY & POLLEN ─────────────────────────────────────────────────
export function AirQualityWidget({ aqi = 1 }: { aqi?: number }) {
  const quality = aqi <= 1 ? 'Bueno' : aqi <= 2 ? 'Moderado' : aqi <= 3 ? 'Malo' : aqi <= 4 ? 'Muy malo' : 'Peligroso';
  const progressStyle: ViewStyle = { width: `${Math.min(aqi * 25, 100)}%` };

  return (
    <WidgetCard style={styles.card}>
      <View style={styles.icaHeader}>
        <Text style={styles.widgetTitle}>ICA</Text>
        <View style={styles.icaStatusPill}>
          <Text style={styles.icaStatusText}>{quality}</Text>
        </View>
      </View>

      <View style={styles.icaValueRow}>
        <Text style={styles.icaValue}>{aqi}</Text>
        <Text style={styles.icaDescription}>Calidad del aire</Text>
      </View>

      <View style={styles.icaBarContainer}>
        <View style={[styles.icaBarFill, progressStyle]} />
      </View>
    </WidgetCard>
  );
}

export function PollenWidget() {
  return (
    <WidgetCard style={styles.card}>
      <Text style={styles.widgetTitle}>Polen</Text>
      <View style={styles.pollenContent}>
        <PollenItem name="Árbol" status="Ninguno" color="#94a3b8" />
        <PollenItem name="Hierba" status="Alto" color="#ef4444" />
        <PollenItem name="Ambrosía" status="Ninguno" color="#94a3b8" />
      </View>
    </WidgetCard>
  );
}

function PollenItem({ name, status, color }: { name: string; status: string; color: string }) {
  return (
    <View style={styles.pollenItem}>
      <Ionicons name="leaf" size={32} color={color} />
      <Text style={styles.pollenName}>{name}</Text>
      <Text style={styles.pollenStatus}>{status}</Text>
    </View>
  );
}

// ─── DETAIL GRID ───────────────────────────────────────────────────────────
interface DetailProps {
  uvLabel: string;
  uvValue: string;
  humidity: string;
  windSpeed: string;
  windDirection?: string;
  dewPoint: string;
  pressure: string;
  visibility: string;
}

export function DetailGrid({
  uvLabel,
  uvValue,
  humidity,
  windSpeed,
  windDirection = 'N',
  dewPoint,
  pressure,
  visibility,
}: DetailProps) {
  const uvPercentage = Math.min((Number(uvValue) / 11) * 100, 100);
  const uvFillStyle: ViewStyle = { width: `${uvPercentage}%` };

  return (
    <View style={styles.detailGrid}>
      <DetailTile title="Índice UV" icon="sunny">
        <Text style={styles.detailTextSmall}>{uvLabel}</Text>
        <Text style={styles.detailValueLarge}>{uvValue}</Text>
        <View style={styles.uvBar}>
          <View style={[styles.uvBarFill, uvFillStyle]} />
        </View>
      </DetailTile>

      <DetailTile title="Humedad" icon="water">
        <Text style={styles.detailTextSmall}>Similar a ayer</Text>
        <Text style={styles.detailValueLarge}>{humidity}</Text>
      </DetailTile>

      <DetailTile title="Viento" icon="navigate">
        <Text style={styles.detailTextSmall}>Hay una ligera brisa</Text>
        <View style={styles.windDisplay}>
          <View style={styles.windBadge}>
            <Ionicons name="compass-outline" size={18} color="rgba(255,255,255,0.8)" />
            <Text style={styles.windDirection}>{windDirection}</Text>
          </View>
          <View style={styles.compassCenter}>
            <Text style={styles.compassValue}>{windSpeed}</Text>
            <Text style={styles.compassUnit}>km/h</Text>
          </View>
        </View>
      </DetailTile>

      <DetailTile title="Punto de rocío" icon="thermometer">
        <Text style={styles.detailTextSmall}>El aire está muy seco</Text>
        <Text style={styles.detailValueLarge}>{dewPoint}</Text>
      </DetailTile>

      <DetailTile title="Presión" icon="speedometer">
        <Text style={styles.detailTextSmall}>Está aumentando rápidamente.</Text>
        <Text style={styles.detailValueMedium}>{pressure}</Text>
      </DetailTile>

      <DetailTile title="Visibilidad" icon="eye">
        <Text style={styles.detailTextSmall}>Visibilidad ilimitada</Text>
        <Text style={styles.detailValueLarge}>{visibility}</Text>
      </DetailTile>
    </View>
  );
}

function DetailTile({ title, icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <WidgetCard style={styles.detailTile}>
      <View style={styles.detailHeader}>
        <Ionicons name={icon} size={14} color="rgba(255,255,255,0.7)" />
        <Text style={styles.detailTitle}>{title}</Text>
      </View>
      <View style={styles.detailContent}>{children}</View>
    </WidgetCard>
  );
}

// ─── STYLES ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  widgetTitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  // Run Suggestion
  runHeader: { marginBottom: 8 },
  runContent: { flexDirection: 'row', justifyContent: 'space-between' },
  runLeft: { flex: 1 },
  runStatus: { color: 'white', fontSize: 18, fontWeight: '600', marginVertical: 4 },
  runDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  runRight: { flexDirection: 'row', gap: 16 },
  runHour: { alignItems: 'center', gap: 4 },
  runTimeText: { color: 'white', fontSize: 12 },
  runStatusText: { color: 'white', fontSize: 12 },

  // Air Quality
  icaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  icaStatusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(163, 230, 53, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(163, 230, 53, 0.35)',
  },
  icaStatusText: {
    color: '#d9f99d',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  icaValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  icaValue: { color: 'white', fontSize: 32, fontWeight: '700', lineHeight: 34 },
  icaDescription: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  icaScale: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600', marginBottom: 4 },
  icaBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  icaBarFill: {
    height: '100%',
    backgroundColor: '#a3e635',
    borderRadius: 999,
  },

  // Pollen
  pollenContent: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 8 },
  pollenItem: { alignItems: 'center', gap: 4 },
  pollenName: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  pollenStatus: { color: 'white', fontSize: 16, fontWeight: '600' },

  // Detail Grid
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 16,
  },
  detailTile: {
    width: '47%',
    minHeight: 180,
    marginHorizontal: 0,
    marginBottom: 0,
  },
  detailHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  detailTitle: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '500' },
  detailContent: { flex: 1, justifyContent: 'flex-start' },
  detailTextSmall: { color: 'white', fontSize: 13, lineHeight: 18 },
  detailValueLarge: { color: 'white', fontSize: 28, fontWeight: '500', marginTop: 12 },
  detailValueMedium: { color: 'white', fontSize: 22, fontWeight: '600', marginTop: 16 },
  uvBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    marginTop: 'auto',
    overflow: 'hidden',
  },
  uvBarFill: {
    height: '100%',
    backgroundColor: '#fbbf24',
    borderRadius: 3,
  },
  windDisplay: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 12,
  },
  windBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  windDirection: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  compassCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 2,
    borderColor: 'rgba(124, 58, 237, 0.45)',
    backgroundColor: 'rgba(124, 58, 237, 0.12)',
  },
  compassValue: { color: 'white', fontSize: 24, fontWeight: '700' },
  compassUnit: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 },
});
