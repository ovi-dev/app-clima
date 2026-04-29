import { BaseColors } from "../constants/baseColors";

export interface ThemeColors {
  baseColors: typeof BaseColors;
  general: {
    text: string;
    textSecondary: string;
    title: string;
    background: string;
    error: string;
  };
  button: {
    buttonBackground: string;
  };
  textInput: {
    text: string;
    background: string;
    border: string;
  };
  dropdown: {
    selectedOptionBackground: string;
    border: string;
    focusedBorder: string;
    disabledBackground: string;
    disabledBorder: string;
  };
  splash: {
    background: string;
    content: string;
    backgroundIcon: string;
  };
  onboarding: {
    titleText: string;
    subtitleText: string;
    progressBarBackground: string;
  };
}
