import {
  DEV_FORCE_ONBOARDING, // Flag de desarrollo: si es true, siempre muestra el onboarding
  useOnboardingStore, // Store de Zustand con el estado persistido del onboarding
} from '@/store/onboarding-store';

export function useOnboarding() {
  // true si el usuario ya completó el onboarding (persistido en AsyncStorage)
  const completado = useOnboardingStore(store => store.completado);

  // true cuando Zustand terminó de cargar los datos desde AsyncStorage
  const rehidratado = useOnboardingStore(store => store.rehidratado);

  // Función para marcar el onboarding como completado
  const completarOnboarding = useOnboardingStore(store => store.completarOnboarding);

  // Si el store todavía no cargó los datos, devuelve null para evitar
  // mostrar una pantalla incorrecta mientras se lee AsyncStorage
  if (!rehidratado) return { completed: null, completeOnboarding: completarOnboarding };

  // En desarrollo, fuerza que el onboarding siempre se muestre (completed: false)
  if (DEV_FORCE_ONBOARDING) return { completed: false, completeOnboarding: completarOnboarding };

  // En producción, devuelve el valor real: si el usuario completó el onboarding o no
  return { completed: completado, completeOnboarding: completarOnboarding };
}
