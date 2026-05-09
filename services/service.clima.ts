import { ClimaAPI, ForecastAPI, WeatherParams } from '@/types/clima.type';
import api from './axios';

// Las rutas de la API centralizadas: si cambian, solo tocas aquí.
const endpoints = {
  currentWeather: '/weather',
  forecast: '/forecast',
} as const;

/**
 * Obtiene el clima actual.
 * Uso con coordenadas: getCurrentWeather({ lat: 40.4, lon: -3.7 })
 * Uso con ciudad:      getCurrentWeather({ q: 'Madrid' })
 */
export const getCurrentWeather = async (params: WeatherParams): Promise<ClimaAPI> => {
  const { data } = await api.get<ClimaAPI>(endpoints.currentWeather, { params });
  return data;
};

/**
 * Obtiene el pronóstico de 5 días (bloques de 3 horas).
 * Uso con coordenadas: getForecast({ lat: 40.4, lon: -3.7 })
 * Uso con ciudad:      getForecast({ q: 'Madrid' })
 */
export const getForecast = async (params: WeatherParams): Promise<ForecastAPI> => {
  const { data } = await api.get<ForecastAPI>(endpoints.forecast, { params });
  return data;
};
