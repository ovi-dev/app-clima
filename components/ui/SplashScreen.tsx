import LottieView from 'lottie-react-native';
import { StyleSheet, View } from 'react-native';

import { useThemeColors } from '@/theme/hooks/useThemeColors';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const themeColors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: themeColors.splash.background }]}>
      <LottieView
        source={require('@/assets/Lottie/loading.json')}
        onAnimationFinish={() => onFinish()}
        resizeMode="cover"
        autoPlay
        loop={false}
        style={styles.lottie}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 200,
    height: 200,
  },
});
