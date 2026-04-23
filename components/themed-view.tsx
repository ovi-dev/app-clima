import { View, type ViewProps } from "react-native";

import { useThemeColors } from "@/theme/hooks/useThemeColors";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const themeColors = useThemeColors();
  const backgroundColor =
    lightColor ?? darkColor ?? themeColors.general.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
