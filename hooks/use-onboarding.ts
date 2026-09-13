import { useOnboardingStore } from '@/store/onboarding-store';

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

  return { completed: completado, completeOnboarding: completarOnboarding };
}
