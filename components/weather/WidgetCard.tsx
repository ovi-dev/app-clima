import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';

interface WidgetCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
}

export function WidgetCard({ children, style, intensity = 20 }: WidgetCardProps) {
  return (
    <View style={[styles.container, style]}>
      <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)', // Subtle fallback if blur isn't enough
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  content: {
    padding: 16,
  },
});
