import { useQuery } from '@tanstack/react-query';

import { getCurrentWeather, getForecast } from '@/services/service.clima';
import { WeatherParams } from '@/types/clima.type';

// Los datos se consideran frescos durante 10 minutos para no abusar de la API
const STALE_TIME = 1000 * 60 * 10;

export const useCurrentWeather = (params: WeatherParams) => {
  return useQuery({
    queryKey: ['weather', params],
    queryFn: () => getCurrentWeather(params),
    staleTime: STALE_TIME,
  });
};

export const useForecast = (params: WeatherParams) => {
  return useQuery({
    queryKey: ['forecast', params],
    queryFn: () => getForecast(params),
    staleTime: STALE_TIME,
  });
};
