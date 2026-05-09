// ─── Parámetros de búsqueda ────────────────────────────────────────────────
// Puedes buscar por coordenadas (GPS) o por nombre de ciudad.
// TypeScript te obliga a elegir uno de los dos, nunca los dos a la vez.
export type WeatherParams = { lat: number; lon: number } | { q: string };

// ─── Respuesta: clima actual (/weather) ────────────────────────────────────
export interface ClimaAPI {
  coord: Coord;
  weather: Weather[];
  base: string;
  main: Main;
  visibility: number;
  wind: Wind;
  clouds: Clouds;
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

// ─── Respuesta: pronóstico 5 días (/forecast) ─────────────────────────────
export interface ForecastAPI {
  cod: string;
  message: number;
  cnt: number; // cantidad de registros en la lista
  list: ForecastItem[];
  city: ForecastCity;
}

export interface ForecastItem {
  dt: number; // timestamp Unix del bloque horario
  main: Main;
  weather: Weather[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number; // probabilidad de precipitación (0–1)
  sys: { pod: 'd' | 'n' }; // 'd' = día, 'n' = noche
  dt_txt: string; // fecha legible "2024-06-16 12:00:00"
}

export interface ForecastCity {
  id: number;
  name: string;
  coord: Coord;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

// ─── Tipos compartidos ─────────────────────────────────────────────────────
export interface Clouds {
  all: number;
}

export interface Coord {
  lon: number;
  lat: number;
}

export interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number; // opcional: no todas las estaciones lo reportan
  grnd_level?: number; // opcional: no todas las estaciones lo reportan
}

export interface Sys {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Wind {
  speed: number;
  deg: number;
}
