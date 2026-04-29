import {
  DEV_FORCE_ONBOARDING,
  useOnboardingStore,
} from "@/store/onboarding-store";

export function useOnboarding() {
  const completed = useOnboardingStore((s) => s.completed);
  const _hydrated = useOnboardingStore((s) => s._hydrated);
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);

  if (!_hydrated) return { completed: null, completeOnboarding };
  if (DEV_FORCE_ONBOARDING) return { completed: false, completeOnboarding };
  return { completed, completeOnboarding };
}
