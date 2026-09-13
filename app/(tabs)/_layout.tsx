import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { BaseColors } from '@/theme/constants/baseColors';
import { useColorScheme } from '@/theme/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const bottomOffset = Math.max(insets.bottom, 8);
  const tabBarWidth = 120;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarActiveTintColor: isDark ? BaseColors.skyBlueLight : BaseColors.skyBlueDark,
        tabBarInactiveTintColor: isDark ? BaseColors.slate400 : BaseColors.slate500,
        tabBarActiveBackgroundColor: isDark ? 'rgba(56, 189, 248, 0.22)' : 'rgba(2, 132, 199, 0.16)',
        tabBarStyle: {
          position: 'absolute',
          left: (width - tabBarWidth) / 2,
          width: tabBarWidth,
          bottom: bottomOffset,
          height: 48,
          backgroundColor: BaseColors.transparent,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarItemStyle: {
          height: 48,
          marginHorizontal: 6,
          backgroundColor: isDark ? 'rgba(11, 15, 25, 0.94)' : 'rgba(255, 255, 255, 0.94)',
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(15, 23, 42, 0.10)',
          borderRadius: 24,
          overflow: 'hidden',
          shadowColor: BaseColors.black,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.3 : 0.14,
          shadowRadius: 8,
          elevation: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hoy',
          tabBarAccessibilityLabel: 'Ver el clima de hoy',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'partly-sunny' : 'partly-sunny-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Ciudades',
          tabBarAccessibilityLabel: 'Buscar y gestionar ciudades',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'location' : 'location-outline'} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
