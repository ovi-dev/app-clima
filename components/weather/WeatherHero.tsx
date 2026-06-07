import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface WeatherHeroProps {
  city: string;
  country?: string;
  temp: number;
  condition: string;
  tempMax: number;
  tempMin: number;
  feelsLike: number;
  summaryText: string;
}

export function WeatherHero({
  city,
  country,
  temp,
  condition,
  tempMax,
  tempMin,
  feelsLike,
  summaryText,
}: WeatherHeroProps) {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('@/assets/images/starry_night_hero.png')}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(10,15,30,0.8)', '#07101E']}
          style={StyleSheet.absoluteFill}
          locations={[0.4, 0.8, 1]}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="white" />
          <Text style={styles.cityText}>{city}</Text>
        </View>

        <Text style={styles.tempText}>{Math.round(temp)}°</Text>
        <Text style={styles.conditionText}>{condition}</Text>

        <Text style={styles.rangeText}>
          ↑ {Math.round(tempMax)}° / ↓ {Math.round(tempMin)}°
        </Text>
        <Text style={styles.feelsLikeText}>Sensación térmica {Math.round(feelsLike)}°</Text>

        {/* Separator / Spacer to push summary down if needed, but in the screenshot summary is right above the hourly widget */}
        <View style={styles.spacer} />

        <Text style={styles.summaryText}>{summaryText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 480, // High enough to show the beautiful illustration
    width: '100%',
    position: 'relative',
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: -50, // Let the background bleed a bit into the next sections
  },
  content: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  cityText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  tempText: {
    color: 'white',
    fontSize: 96,
    fontWeight: '300',
    lineHeight: 100,
    letterSpacing: -3,
    marginBottom: 4,
  },
  conditionText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 16,
  },
  rangeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 4,
  },
  feelsLikeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  spacer: {
    flex: 1,
  },
  summaryText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    fontWeight: '500',
  },
});
