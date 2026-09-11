import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { SavedCity } from '@/types/clima.type';

interface CityState {
  city: string;
  activeLat: number | null;
  activeLon: number | null;
  savedCities: SavedCity[];
  hasHydrated: boolean;
  selectCity: (city: SavedCity) => void;
  addSavedCity: (city: SavedCity) => void;
  removeSavedCity: (id: string) => void;
  isSaved: (id: string) => boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useCityStore = create<CityState>()(
  persist(
    (set, get) => ({
      city: 'Madrid',
      activeLat: null,
      activeLon: null,
      savedCities: [],
      hasHydrated: false,

      selectCity: selectedCity =>
        set({ city: selectedCity.name, activeLat: selectedCity.lat, activeLon: selectedCity.lon }),

      addSavedCity: newCity =>
        set(state => {
          if (state.savedCities.some(c => c.id === newCity.id)) return state;
          return { savedCities: [...state.savedCities, newCity] };
        }),

      removeSavedCity: id =>
        set(state => ({
          savedCities: state.savedCities.filter(c => c.id !== id),
        })),

      isSaved: id => get().savedCities.some(c => c.id === id),
      setHasHydrated: hasHydrated => set({ hasHydrated }),
    }),
    {
      name: 'city-store-v2',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ city, activeLat, activeLon, savedCities }) => ({
        city,
        activeLat,
        activeLon,
        savedCities,
      }),
      onRehydrateStorage: () => state => state?.setHasHydrated(true),
    },
  ),
);
