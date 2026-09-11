import { useQuery } from '@tanstack/react-query';

import { getAirQuality, getCurrentUV, getCurrentWeather, getForecast, searchCities } from '@/services/service.clima';
import { CoordinatesParams, WeatherParams } from '@/types/clima.type';

// Si queremos que al abrir la app se recargue el clima actualizado,
// estas consultas deben estar siempre en estado stale en el primer mount.
const STALE_TIME = 0;

export const useCurrentWeather = (params: WeatherParams, enabled = true) => {
  return useQuery({
    queryKey: ['weather', params],
    queryFn: () => getCurrentWeather(params),
    enabled,
    staleTime: STALE_TIME,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
};

export const useForecast = (params: WeatherParams, enabled = true) => {
  return useQuery({
    queryKey: ['forecast', params],
    queryFn: () => getForecast(params),
    enabled,
    staleTime: STALE_TIME,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
};

export const useCurrentUV = (params: CoordinatesParams, enabled = true) => {
  return useQuery({
    queryKey: ['uv', params],
    queryFn: () => getCurrentUV(params),
    enabled,
    staleTime: STALE_TIME,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
};

export const useAirQuality = (params: CoordinatesParams, enabled = true) => {
  return useQuery({
    queryKey: ['air-quality', params],
    queryFn: () => getAirQuality(params),
    enabled,
    staleTime: STALE_TIME,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
};

export const useCitySearch = (query: string) => {
  const normalizedQuery = query.trim();

  return useQuery({
    queryKey: ['city-search', normalizedQuery],
    queryFn: () => searchCities(normalizedQuery),
    enabled: normalizedQuery.length >= 2,
    staleTime: 1000 * 60 * 30,
  });
};
