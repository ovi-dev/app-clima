import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const ONBOARDING_KEY = "onboarding_completed";

// DEV: pon `true` para forzar onboarding siempre (útil durante desarrollo)
//      pon `false` para usar el comportamiento real (solo se muestra una vez)
const DEV_FORCE_ONBOARDING = true;

export function useOnboarding() {
  const [completed, setCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    if (__DEV__ && DEV_FORCE_ONBOARDING) {
      setCompleted(false);
      return;
    }
    AsyncStorage.getItem(ONBOARDING_KEY).then((value) => {
      setCompleted(value === "true");
    });
  }, []);

  const completeOnboarding = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    setCompleted(true);
  };

  return { completed, completeOnboarding };
}
