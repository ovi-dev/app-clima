import { ThemedColorsPalette } from "../types/themedColorsPalette";
import { BaseColors } from "./baseColors";

export const AppThemeColors: ThemedColorsPalette = {
  light: {
    baseColors: BaseColors,
    general: {
      text: BaseColors.slate900,
      textSecondary: BaseColors.slate500,
      title: BaseColors.slate950,
      background: BaseColors.offWhite,
      error: BaseColors.red,
    },
    button: {
      buttonBackground: BaseColors.skyBlueDark,
    },
    textInput: {
      text: BaseColors.slate900,
      background: BaseColors.white,
      border: BaseColors.slate200,
    },
    dropdown: {
      selectedOptionBackground: BaseColors.slate100,
      border: BaseColors.slate200,
      focusedBorder: BaseColors.skyBlue,
      disabledBackground: BaseColors.slate50,
      disabledBorder: BaseColors.slate200,
    },
    splash: {
      background: BaseColors.offWhite,
      content: BaseColors.skyBlueDark,
      backgroundIcon: `${BaseColors.skyBlueLight}40`,
    },
    onboarding: {
      titleText: BaseColors.slate950,
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
      buttonBackground: BaseColors.skyBlue,
    },
    textInput: {
      text: BaseColors.white,
      background: BaseColors.obsidian,
      border: BaseColors.slate700,
    },
    dropdown: {
      selectedOptionBackground: BaseColors.deepSpace,
      border: BaseColors.slate700,
      focusedBorder: BaseColors.neonCyan,
      disabledBackground: BaseColors.slate800,
      disabledBorder: BaseColors.slate700,
    },
    splash: {
      background: BaseColors.nightNavy,
      content: BaseColors.white,
      backgroundIcon: `${BaseColors.white}10`,
    },
    onboarding: {
      titleText: BaseColors.white,
      subtitleText: BaseColors.slate400,
      progressBarBackground: BaseColors.slate800,
    },
  },
};
