import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// DEV: pon `true` para forzar onboarding siempre (útil durante desarrollo)
//      pon `false` para usar el comportamiento real (solo se muestra una vez)
export const DEV_FORCE_ONBOARDING = __DEV__ && true;

interface OnboardingState {
  completed: boolean;
  _hydrated: boolean;
  completeOnboarding: () => void;
  setHydrated: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      completed: false,
      _hydrated: false,
      completeOnboarding: () => set({ completed: true }),
      setHydrated: () => set({ _hydrated: true }),
    }),
    {
      name: "onboarding-store",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
