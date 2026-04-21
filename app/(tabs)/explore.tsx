import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useForm } from "react-hook-form";
import { Button, StyleSheet, Switch, View } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { FormField } from "@/components/ui/form-field";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { TextInputField } from "@/components/ui/text-input-field";
import { Fonts } from "@/constants/theme";
import {
  emailValidation,
  numberValidation,
  passwordValidation,
  textValidation,
} from "@/validations/formValidations";

type DemoForm = {
  email: string;
  password: string;
  descripcion: string;
  edad: string;
  notificaciones: boolean;
  terminos: boolean;
};

export default function TabTwoScreen() {
  const { control, handleSubmit } = useForm<DemoForm>({
    defaultValues: {
      email: "",
      password: "",
      descripcion: "",
      edad: "",
      notificaciones: false,
      terminos: false,
    },
  });

  const onSubmit = (data: DemoForm) => {
    console.log("Formulario enviado:", data);
    alert(`Formulario enviado:\n${JSON.stringify(data, null, 2)}`);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts?.rounded }}>
          FormField
        </ThemedText>
      </ThemedView>

      <TextInputField
        control={control}
        name="email"
        label="1. Input de texto básico"
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon={<MaterialIcons name="mail-outline" size={18} color="#888" />}
        rules={emailValidation}
      />

      <TextInputField
        control={control}
        name="password"
        label="2. Input contraseña (secureTextEntry)"
        placeholder="Contraseña"
        secureTextEntry
        leftIcon={<MaterialIcons name="lock-outline" size={18} color="#888" />}
        rightIcon={
          <MaterialIcons name="visibility-off" size={18} color="#888" />
        }
        rules={passwordValidation}
      />

      <TextInputField
        control={control}
        name="descripcion"
        label="3. Textarea multilínea"
        placeholder="Escribe una descripción..."
        multiline
        numberOfLines={4}
        rules={textValidation}
      />

      <TextInputField
        control={control}
        name="edad"
        label="4. Input numérico"
        placeholder="Edad"
        keyboardType="numeric"
        leftIcon={
          <MaterialIcons name="person-outline" size={18} color="#888" />
        }
        rules={numberValidation}
      />

      <ThemedView style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          5. Switch / Toggle
        </ThemedText>
        <FormField
          control={control}
          name="notificaciones"
          render={({ value, onChange }) => (
            <View style={styles.row}>
              <ThemedText>Activar notificaciones</ThemedText>
              <Switch value={value} onValueChange={onChange} />
            </View>
          )}
        />
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          6. Checkbox personalizado
        </ThemedText>
        <FormField
          control={control}
          name="terminos"
          rules={{
            validate: (v) => v === true || "Debes aceptar los términos",
          }}
          render={({ value, onChange, error }) => (
            <View>
              <View style={styles.row}>
                <View
                  style={[styles.checkbox, value && styles.checkboxChecked]}
                  onTouchEnd={() => onChange(!value)}
                />
                <ThemedText>Acepto los términos y condiciones</ThemedText>
              </View>
              {error && (
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              )}
            </View>
          )}
        />
      </ThemedView>
      <Button title="Enviar" onPress={handleSubmit(onSubmit)} />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  section: {
    gap: 6,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: "#11181C",
    backgroundColor: "#fff",
  },
  textarea: {
    height: 90,
    textAlignVertical: "top",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#0a7ea4",
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: "#0a7ea4",
  },
});
