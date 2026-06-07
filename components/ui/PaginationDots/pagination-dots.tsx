import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';

const DOT_SIZE = 10;
const ACTIVE_WIDTH = 28;

type Props = {
  total: number;
  progress: SharedValue<number>;
  color: string;
  onPress?: (index: number) => void;
};

function Dot({
  index,
  progress,
  color,
  onPress,
}: {
  index: number;
  progress: SharedValue<number>;
  color: string;
  onPress?: () => void;
}) {
  const animStyle = useAnimatedStyle(() => {
    const ratio = Math.max(0, 1 - Math.abs(progress.value - index));
    return {
      width: interpolate(ratio, [0, 1], [DOT_SIZE, ACTIVE_WIDTH]),
      opacity: interpolate(ratio, [0, 1], [0.35, 1]),
    };
  });

  return (
    <Pressable onPress={onPress} hitSlop={10} disabled={!onPress}>
      <Animated.View style={[styles.dot, { backgroundColor: color }, animStyle]} />
    </Pressable>
  );
}

export function PaginationDots({ total, progress, color, onPress }: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <Dot
          key={index}
          index={index}
          progress={progress}
          color={color}
          onPress={onPress ? () => onPress(index) : undefined}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: DOT_SIZE,
  },
  dot: {
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
});
