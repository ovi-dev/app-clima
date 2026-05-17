import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { SavedCity } from '@/types/clima.type';

interface CityState {
  city: string;
  activeLat: number | null;
  activeLon: number | null;
  savedCities: SavedCity[];
  setCity: (city: string, lat?: number, lon?: number) => void;
  addSavedCity: (city: SavedCity) => void;
  removeSavedCity: (id: string) => void;
  isSaved: (id: string) => boolean;
}

export const useCityStore = create<CityState>()(
  persist(
    (set, get) => ({
      city: 'Madrid',
      activeLat: null,
      activeLon: null,
      savedCities: [],

      setCity: (city, lat, lon) =>
        set({ city, activeLat: lat ?? null, activeLon: lon ?? null }),

      addSavedCity: (newCity) =>
        set((state) => {
          if (state.savedCities.some((c) => c.id === newCity.id)) return state;
          return { savedCities: [...state.savedCities, newCity] };
        }),

      removeSavedCity: (id) =>
        set((state) => ({
          savedCities: state.savedCities.filter((c) => c.id !== id),
        })),

      isSaved: (id) => get().savedCities.some((c) => c.id === id),
    }),
    {
      // Nombre nuevo → Zustand ignora el store viejo y empieza limpio
      name: 'city-store-v2',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
