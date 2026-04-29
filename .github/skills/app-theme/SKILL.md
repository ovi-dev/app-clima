---
name: app-theme
description: "Sistema de colores y tema oscuro/claro de app-clima. Usar cuando se implemente un nuevo componente, pantalla o elemento de UI que necesite colores, estilos dinámicos, o soporte de dark/light mode. Incluye cómo usar useThemeColors, useWithAppTheme y createStyles."
---

# Sistema de Tema — app-clima

## Hooks disponibles

| Hook                            | Importación                     | Uso                                                                   |
| ------------------------------- | ------------------------------- | --------------------------------------------------------------------- |
| `useWithAppTheme(createStyles)` | `@/theme/hooks/useWithAppTheme` | Genera un `StyleSheet` memoizado con los colores del tema actual      |
| `useThemeColors()`              | `@/theme/hooks/useThemeColors`  | Devuelve todos los colores del tema actual para usarlos inline en JSX |

---

## 1. Estilos en StyleSheet

Definir `createStyles` **fuera del componente** y consumirlo con `useWithAppTheme`:

```tsx
import { StyleSheet } from "react-native";
import { useWithAppTheme } from "@/theme/hooks/useWithAppTheme";
import { ThemeColors } from "@/theme/types/themeColors";

export default function MiComponente() {
  const styles = useWithAppTheme(createStyles);
  // ...
}

// Fuera del componente — se memoiza automáticamente
const createStyles = (themeColors: ThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: themeColors.general.background,
    },
    label: {
      color: themeColors.general.text,
    },
    error: {
      color: themeColors.general.error,
    },
  });
```

## 2. Colores inline en JSX

Cuando se necesita pasar colores directamente a props (no a StyleSheet):

```tsx
import { useThemeColors } from "@/theme/hooks/useThemeColors";

export default function MiComponente() {
  const themeColors = useThemeColors();

  return (
    <Switch
      trackColor={{
        false: themeColors.general.textSecondary,
        true: themeColors.button.buttonBackground,
      }}
      thumbColor={themeColors.general.background}
    />
  );
}
```

## 3. Ambos a la vez

```tsx
export default function MiComponente() {
  const styles = useWithAppTheme(createStyles);
  const themeColors = useThemeColors();
  // estilos desde styles.xxx + colores inline desde themeColors.xxx
}
```

---

## Cómo usar los estilos en JSX

```tsx
// Estilo simple
<View style={styles.container} />

// Array de estilos — los posteriores sobreescriben a los anteriores
<View style={[styles.base, styles.override]} />

// Condicional — usar null cuando no aplica (React Native lo ignora)
<View style={[styles.inputWrapper, error ? styles.inputWrapperError : null]} />

// Varios condicionales
<TextInput style={[styles.input, multiline && styles.textarea, leftIcon ? styles.inputWithLeftIcon : null]} />

// Inline para valores que no dependen del tema (posición, dimensiones)
<View style={{ position: "absolute", bottom: -90 }} />
```
