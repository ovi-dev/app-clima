import { ThemedColorsPalette } from "../types/themedColorsPalette";
import { BaseColors } from "./baseColors";

export const AppThemeColors: ThemedColorsPalette = {
  light: {
    baseColors: BaseColors,
    general: {
      text: BaseColors.blueGrey900,
      textSecondary: BaseColors.blueGrey700,
      title: BaseColors.blueGrey,
      background: BaseColors.white,
      error: BaseColors.red,
    },
    button: {
      buttonBackground:
        process.env.EXPO_PUBLIC_CITY_COLOR_DARK ??
        BaseColors.defaultCityTintDark,
    },
    textInput: {
      text: BaseColors.blueGrey700,
      background: BaseColors.blueGrey50,
      border: BaseColors.blueGrey100,
    },
    dropdown: {
      selectedOptionBackground: BaseColors.white,
      border: BaseColors.blueGrey300,
      focusedBorder: BaseColors.blueGrey600,
      disabledBackground: BaseColors.blueGrey100,
      disabledBorder: BaseColors.blueGrey200,
    },
    splash: {
      background: BaseColors.white,
      content:
        process.env.EXPO_PUBLIC_CITY_COLOR_DARK ??
        BaseColors.defaultCityTintDark,
      backgroundIcon: `${process.env.EXPO_PUBLIC_CITY_COLOR_DARK ?? BaseColors.defaultCityTintDark}20`,
    },
    onboarding: {
      titleText: BaseColors.blueGrey,
      subtitleText: BaseColors.blueGrey700,
      progressBarBackground: BaseColors.blueGrey50,
    },
  },
  dark: {
    baseColors: BaseColors,
    general: {
      text: BaseColors.white,
      textSecondary: BaseColors.blueGrey200,
      title: BaseColors.white,
      background: BaseColors.blueGrey,
      error: BaseColors.red,
    },
    button: {
      buttonBackground:
        process.env.EXPO_PUBLIC_CITY_COLOR ?? BaseColors.defaultCityTint,
    },
    textInput: {
      text: BaseColors.white,
      background: BaseColors.blueGrey800,
      border: BaseColors.blueGrey600,
    },
    dropdown: {
      selectedOptionBackground: BaseColors.blueGrey700,
      border: BaseColors.blueGrey300,
      focusedBorder: BaseColors.blueGrey600,
      disabledBackground: BaseColors.blueGrey100,
      disabledBorder: BaseColors.blueGrey200,
    },
    splash: {
      background: BaseColors.blueGrey,
      content: BaseColors.white,
      backgroundIcon: `${BaseColors.white}19`,
    },
    onboarding: {
      titleText: BaseColors.white,
      subtitleText: BaseColors.blueGrey50,
      progressBarBackground: BaseColors.blueGrey900,
    },
  },
};
