import LottieView from 'lottie-react-native';
import { StyleSheet, View } from 'react-native';

interface SplashScreenProps {
  onFinish?: (isCancelled: boolean) => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('@/assets/Lottie/loading.json')}
        onAnimationFinish={onFinish}
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
    backgroundColor: '#000',
  },
  lottie: {
    width: 200,
    height: 200,
  },
});
