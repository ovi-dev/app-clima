import { ThemedColorsPalette } from "../types/themedColorsPalette";
import { BaseColors } from "./baseColors";

export const AppThemeColors: ThemedColorsPalette = {
  light: {
    baseColors: BaseColors,
    general: {
      text: BaseColors.slate900,
      textSecondary: BaseColors.slate600,
      title: BaseColors.slate900,
      background: BaseColors.white,
      error: BaseColors.red,
    },
    button: {
      buttonBackground: BaseColors.green,
    },
    textInput: {
      text: BaseColors.slate800,
      background: BaseColors.slate50,
      border: BaseColors.slate200,
    },
    dropdown: {
      selectedOptionBackground: BaseColors.white,
      border: BaseColors.slate300,
      focusedBorder: BaseColors.slate500,
      disabledBackground: BaseColors.slate100,
      disabledBorder: BaseColors.slate200,
    },
    splash: {
      background: BaseColors.white,
      content: BaseColors.defaultCityTintDark,
      backgroundIcon: `${BaseColors.defaultCityTintDark}20`,
    },
    onboarding: {
      titleText: BaseColors.slate900,
      subtitleText: BaseColors.slate600,
      progressBarBackground: BaseColors.slate200,
    },
  },

  /// Dark theme colors============================================================================================
  dark: {
    baseColors: BaseColors,
    general: {
      text: BaseColors.white,
      textSecondary: BaseColors.slate300,
      title: BaseColors.white,
      background: BaseColors.nightNavy,
      error: BaseColors.red,
    },
    button: {
      buttonBackground: BaseColors.green,
    },
    textInput: {
      text: BaseColors.white,
      background: BaseColors.slate800,
      border: BaseColors.slate600,
    },
    dropdown: {
      selectedOptionBackground: BaseColors.slate700,
      border: BaseColors.slate400,
      focusedBorder: BaseColors.slate200,
      disabledBackground: BaseColors.slate800,
      disabledBorder: BaseColors.slate600,
    },
    splash: {
      background: BaseColors.nightNavy,
      content: BaseColors.cloudWhite,
      backgroundIcon: `${BaseColors.cloudWhite}19`,
    },
    onboarding: {
      titleText: BaseColors.white,
      subtitleText: BaseColors.slate300,
      progressBarBackground: BaseColors.slate800,
    },
  },
};
