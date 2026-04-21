import { ReactNode } from "react";
import { Control, FieldValues, Path, RegisterOptions } from "react-hook-form";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { FormField } from "@/components/ui/form-field";

type TextInputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  rules?: RegisterOptions<T, Path<T>>;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
} & Pick<
  TextInputProps,
  | "placeholder"
  | "secureTextEntry"
  | "keyboardType"
  | "autoCapitalize"
  | "multiline"
  | "numberOfLines"
>;

export function TextInputField<T extends FieldValues>({
  control,
  name,
  label,
  rules,
  leftIcon,
  rightIcon,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  multiline,
  numberOfLines,
}: TextInputFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      rules={rules}
      render={({ value, onChange, onBlur, error }) => (
        <ThemedView style={styles.section}>
          {label && (
            <ThemedText type="defaultSemiBold" style={styles.label}>
              {label}
            </ThemedText>
          )}
          <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
            {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
            <TextInput
              value={String(value ?? "")}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              multiline={multiline}
              numberOfLines={numberOfLines}
              style={[
                styles.input,
                multiline && styles.textarea,
                leftIcon ? styles.inputWithLeftIcon : null,
                rightIcon ? styles.inputWithRightIcon : null,
              ]}
            />
            {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
          </View>
          {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
        </ThemedView>
      )}
    />
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 4,
  },
  label: {
    marginBottom: 2,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: "#11181C",
  },
  inputWithLeftIcon: {
    paddingLeft: 4,
  },
  inputWithRightIcon: {
    paddingRight: 4,
  },
  iconLeft: {
    paddingLeft: 10,
  },
  iconRight: {
    paddingRight: 10,
  },
  inputError: {
    borderColor: "red",
  },
  textarea: {
    height: 90,
    textAlignVertical: "top",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
  },
});
