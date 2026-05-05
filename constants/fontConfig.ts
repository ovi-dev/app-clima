export const fontConfig = {
  // Overpass
  "Overpass-Black": require("../assets/fonts/Overpass-Black.ttf"),
  "Overpass-BlackItalic": require("../assets/fonts/Overpass-BlackItalic.ttf"),
  "Overpass-Bold": require("../assets/fonts/Overpass-Bold.ttf"),
  "Overpass-BoldItalic": require("../assets/fonts/Overpass-BoldItalic.ttf"),
  "Overpass-ExtraBold": require("../assets/fonts/Overpass-ExtraBold.ttf"),
  "Overpass-ExtraBoldItalic": require("../assets/fonts/Overpass-ExtraBoldItalic.ttf"),
  "Overpass-ExtraLight": require("../assets/fonts/Overpass-ExtraLight.ttf"),
  "Overpass-ExtraLightItalic": require("../assets/fonts/Overpass-ExtraLightItalic.ttf"),
  "Overpass-Italic": require("../assets/fonts/Overpass-Italic.ttf"),
  "Overpass-Light": require("../assets/fonts/Overpass-Light.ttf"),
  "Overpass-LightItalic": require("../assets/fonts/Overpass-LightItalic.ttf"),
  "Overpass-Medium": require("../assets/fonts/Overpass-Medium.ttf"),
  "Overpass-MediumItalic": require("../assets/fonts/Overpass-MediumItalic.ttf"),
  "Overpass-Regular": require("../assets/fonts/Overpass-Regular.ttf"),
  "Overpass-SemiBold": require("../assets/fonts/Overpass-SemiBold.ttf"),
  "Overpass-SemiBoldItalic": require("../assets/fonts/Overpass-SemiBoldItalic.ttf"),
  "Overpass-Thin": require("../assets/fonts/Overpass-Thin.ttf"),
  "Overpass-ThinItalic": require("../assets/fonts/Overpass-ThinItalic.ttf"),
} as const;

export const Fonts = {
  // Overpass
  OverpassBlack: "Overpass-Black",
  OverpassBlackItalic: "Overpass-BlackItalic",
  OverpassBold: "Overpass-Bold",
  OverpassBoldItalic: "Overpass-BoldItalic",
  OverpassExtraBold: "Overpass-ExtraBold",
  OverpassExtraBoldItalic: "Overpass-ExtraBoldItalic",
  OverpassExtraLight: "Overpass-ExtraLight",
  OverpassExtraLightItalic: "Overpass-ExtraLightItalic",
  OverpassItalic: "Overpass-Italic",
  OverpassLight: "Overpass-Light",
  OverpassLightItalic: "Overpass-LightItalic",
  OverpassMedium: "Overpass-Medium",
  OverpassMediumItalic: "Overpass-MediumItalic",
  OverpassRegular: "Overpass-Regular",
  OverpassSemiBold: "Overpass-SemiBold",
  OverpassSemiBoldItalic: "Overpass-SemiBoldItalic",
  OverpassThin: "Overpass-Thin",
  OverpassThinItalic: "Overpass-ThinItalic",
} as const;

export type FontName = (typeof Fonts)[keyof typeof Fonts];
