# Manual de Fuentes en Expo y React Native

Guia de referencia para instalar, configurar y reutilizar fuentes en proyectos Expo.

## 1. Cuándo usar cada enfoque

Tienes dos formas comunes de usar fuentes en Expo:

- Paquetes de Google Fonts, por ejemplo `@expo-google-fonts/inter`.
- Archivos locales `.ttf` o `.otf` guardados dentro del proyecto.

Usa Google Fonts cuando quieras una integracion rapida y una familia conocida.
Usa fuentes locales cuando necesites branding propio o una tipografia que no venga empaquetada en `@expo-google-fonts`.

## 2. Dónde ver y escoger fuentes

Puedes explorar fuentes aqui:

- Google Fonts: https://fonts.google.com
- Catalogo de paquetes Expo Google Fonts: https://github.com/expo/google-fonts
- npm: busca paquetes como `@expo-google-fonts/inter`, `@expo-google-fonts/poppins` o `@expo-google-fonts/manrope`

Para escoger bien una fuente, revisa estas preguntas:

1. ¿Se lee bien en tamaños pequeños?
2. ¿Tiene varios pesos utiles como `400`, `500`, `600` y `700`?
3. ¿Encaja con el tono de la app?
4. ¿Necesitas una sola familia o una combinacion para titulos y texto?

Regla practica:

- Texto base: usa una sans-serif legible.
- Titulos: puedes usar la misma familia en un peso mas fuerte o una segunda familia con mas personalidad.
- No cargues pesos que no vas a usar.

## 3. Instalación con Google Fonts

Ejemplo con Inter:

```bash
npx expo install expo-font
npm install @expo-google-fonts/inter
```

Ejemplo con Poppins:

```bash
npx expo install expo-font
npm install @expo-google-fonts/poppins
```

`expo-font` carga las fuentes en tiempo de ejecucion.
El paquete `@expo-google-fonts/...` expone las variantes listas para usar.

## 4. Instalación con fuentes locales

Guarda los archivos en una carpeta como esta:

```text
assets/
  fonts/
    Sora-Regular.ttf
    Sora-SemiBold.ttf
    Sora-Bold.ttf
```

No necesitas instalar un paquete de npm para la fuente, solo `expo-font`:

```bash
npx expo install expo-font
```

## 5. Configuración global en Expo Router

En este proyecto, el mejor punto de carga es [app/\_layout.tsx](../app/_layout.tsx), porque es el layout raiz.

### Ejemplo con Google Fonts

```tsx
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    // tu layout
  );
}
```

### Ejemplo con fuentes locales

```tsx
import { useFonts } from "expo-font";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SoraRegular: require("../assets/fonts/Sora-Regular.ttf"),
    SoraSemiBold: require("../assets/fonts/Sora-SemiBold.ttf"),
    SoraBold: require("../assets/fonts/Sora-Bold.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    // tu layout
  );
}
```

## 6. Cómo aplicar la fuente a nivel global

En React Native no existe una configuracion CSS global como en web. La forma mas limpia es centralizar la tipografia en componentes base o en el sistema de tema.

En este proyecto, el sitio natural para eso es [components/themed-text.tsx](../components/themed-text.tsx).

Ejemplo:

```tsx
const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Inter_400Regular",
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Inter_600SemiBold",
  },
  title: {
    fontSize: 32,
    lineHeight: 36,
    fontFamily: "Inter_700Bold",
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: "Inter_600SemiBold",
  },
});
```

Asi cualquier pantalla que use `ThemedText` hereda la tipografia sin repetir `fontFamily` en todos lados.

## 7. Cómo aplicar la fuente en un componente puntual

Si quieres usar una fuente concreta en un componente, puedes hacerlo directamente con `fontFamily`.

```tsx
import { Text } from "react-native";

export function HeroTitle() {
  return (
    <Text
      style={{
        fontFamily: "Inter_700Bold",
        fontSize: 34,
        lineHeight: 40,
      }}
    >
      Clima de hoy
    </Text>
  );
}
```

Esto es util para casos especiales, pero no deberia ser tu estrategia principal.

## 8. Cómo combinar varias familias

Puedes combinar una familia para texto y otra para titulos.

Ejemplo:

- Cuerpo: `Inter_400Regular`
- Destacados: `Inter_600SemiBold`
- Titulos: `Poppins_700Bold`

Configuracion:

```tsx
import { Inter_400Regular, Inter_600SemiBold } from "@expo-google-fonts/inter";
import { Poppins_700Bold } from "@expo-google-fonts/poppins";
import { useFonts } from "expo-font";

const [fontsLoaded] = useFonts({
  Inter_400Regular,
  Inter_600SemiBold,
  Poppins_700Bold,
});
```

Despues, asignas cada familia en tus estilos.

## 9. Cómo saber qué variantes importar

Cada paquete exporta nombres concretos. Por ejemplo, Inter suele exponer variantes como:

- `Inter_100Thin`
- `Inter_400Regular`
- `Inter_500Medium`
- `Inter_600SemiBold`
- `Inter_700Bold`
- `Inter_900Black`

No importes todas por defecto. Importa solo las que uses.

Recomendacion inicial:

- `400` para texto base
- `600` para enfasis
- `700` para titulos

## 10. Cómo cambiar de fuente en otro proyecto

El proceso suele ser siempre el mismo:

1. Elige una familia.
2. Instala `expo-font` si hace falta.
3. Instala el paquete `@expo-google-fonts/...` o añade archivos locales.
4. Carga las variantes en el layout raiz o punto de entrada.
5. Centraliza `fontFamily` en un componente base o tokens de tema.
6. Usa esa abstraccion en toda la app.

## 11. Ejemplo de estructura reusable

Una estructura muy practica para proyectos nuevos es esta:

```text
assets/
  fonts/
theme/
  constants/
    typography.ts
components/
  ui/
    AppText.tsx
app/
  _layout.tsx
```

Ejemplo de `typography.ts`:

```ts
export const FontFamilies = {
  body: "Inter_400Regular",
  bodySemiBold: "Inter_600SemiBold",
  heading: "Inter_700Bold",
} as const;
```

Ejemplo de uso:

```tsx
import { Text, TextProps } from "react-native";
import { FontFamilies } from "@/theme/constants/typography";

type AppTextProps = TextProps & {
  variant?: "body" | "bodySemiBold" | "heading";
};

export function AppText({ variant = "body", style, ...props }: AppTextProps) {
  const fontFamily = FontFamilies[variant];

  return <Text {...props} style={[{ fontFamily }, style]} />;
}
```

## 12. Errores comunes

- Cargar la fuente pero seguir usando `fontWeight` en vez de `fontFamily`.
- Importar demasiadas variantes y aumentar peso innecesario.
- Intentar usar la fuente antes de que `useFonts` termine.
- Repetir `fontFamily` manualmente en cada pantalla.
- Mezclar muchas familias sin una jerarquia clara.

## 13. Comandos utiles

Instalar Inter:

```bash
npx expo install expo-font
npm install @expo-google-fonts/inter
```

Instalar Poppins:

```bash
npx expo install expo-font
npm install @expo-google-fonts/poppins
```

Arrancar el proyecto:

```bash
npx expo start
```

## 14. Recomendación práctica para empezar

Si quieres una base segura para casi cualquier app:

1. Empieza con Inter, Manrope o Poppins.
2. Usa solo tres pesos: `400`, `600`, `700`.
3. Carga las fuentes en [app/\_layout.tsx](../app/_layout.tsx).
4. Centraliza la tipografia en [components/themed-text.tsx](../components/themed-text.tsx) o en un archivo de tokens.
5. Ajusta despues la personalidad visual cuando la jerarquia del producto ya este clara.

## 15. Resumen rapido

- Para instalar: `npx expo install expo-font` y luego `npm install @expo-google-fonts/nombre`.
- Para configurar: carga las fuentes con `useFonts` en el layout raiz.
- Para aplicar globalmente: usa un componente base como `ThemedText`.
- Para aplicar localmente: usa `fontFamily` en un componente concreto.
- Para cambiar de familia: sustituyes paquete, imports y nombres de `fontFamily`.
