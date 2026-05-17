// import { PropsWithChildren, useState } from "react";
// import { StyleSheet, TouchableOpacity } from "react-native";

// import { ThemedText } from "@/components/themed-text";
// import { ThemedView } from "@/components/themed-view";
// import { IconSymbol } from "@/components/ui/icon-symbol";
// import { Colors } from "@/constants/theme";
// import { useColorScheme } from "@/theme/hooks/useColorScheme";

// export function Collapsible({
//   children,
//   title,
// }: PropsWithChildren & { title: string }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const theme = useColorScheme() ?? "light";

//   return (
//     <ThemedView>
//       <TouchableOpacity
//         style={styles.heading}
//         onPress={() => setIsOpen((value) => !value)}
//         activeOpacity={0.8}
//       >
//         <IconSymbol
//           name="chevron.right"
//           size={18}
//           weight="medium"
//           color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
//           style={{ transform: [{ rotate: isOpen ? "90deg" : "0deg" }] }}
//         />

//         <ThemedText type="defaultSemiBold">{title}</ThemedText>
//       </TouchableOpacity>
//       {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
//     </ThemedView>
//   );
// }

// const styles = StyleSheet.create({
//   heading: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   content: {
//     marginTop: 6,
//     marginLeft: 24,
//   },
// });

/**
 * Collapsible
 *
 * Sección plegable con un título y una flecha giratoria como indicador.
 * Al presionar el encabezado, el contenido se expande o colapsa.
 * Usa el tema activo para el color del ícono.
 *
 * @prop title    - Texto del encabezado clickeable.
 * @prop children - Contenido que se muestra u oculta.
 *
 * @example
 * <Collapsible title="Ver más detalles">
 *   <ThemedText>Aquí va el contenido oculto.</ThemedText>
 * </Collapsible>
 */
