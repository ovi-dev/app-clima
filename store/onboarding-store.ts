import AsyncStorage from '@react-native-async-storage/async-storage'; // Storage persistente en el dispositivo
import { create } from 'zustand'; // Función para crear el store de Zustand
import { createJSONStorage, persist } from 'zustand/middleware'; // Middleware para persistir el store en AsyncStorage

// DEV: pon `true` para forzar onboarding siempre (útil durante desarrollo)
//      pon `false` para usar el comportamiento real (solo se muestra una vez)
// __DEV__ es una variable global de React Native que es true solo en modo desarrollo
export const DEV_FORCE_ONBOARDING = __DEV__ && true;

// Tipado del store: define qué datos y acciones contiene
interface EstadoOnboarding {
  completado: boolean; // Si el usuario ya completó el onboarding
  rehidratado: boolean; // Si el store ya cargó los datos desde AsyncStorage
  completarOnboarding: () => void; // Acción para marcar el onboarding como completado
  establecerRehidratado: () => void; // Acción interna para marcar que la rehidratación terminó
}

// Crea el store con persistencia en AsyncStorage
export const useOnboardingStore = create<EstadoOnboarding>()(
  persist(
    set => ({
      completado: false, // Estado inicial: onboarding no completado
      rehidratado: false, // Estado inicial: store no rehidratado todavía
      completarOnboarding: () => set({ completado: true }), // Marca el onboarding como completado
      establecerRehidratado: () => set({ rehidratado: true }), // Marca que AsyncStorage ya fue leído
    }),
    {
      name: 'onboarding-store', // Clave con la que se guarda en AsyncStorage
      storage: createJSONStorage(() => AsyncStorage), // Usa AsyncStorage como motor de persistencia
      onRehydrateStorage: () => estado => {
        // Callback que se ejecuta cuando Zustand termina de cargar los datos del storage
        estado?.establecerRehidratado(); // Notifica que la rehidratación completó
      },
    },
  ),
);
