import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  // La API key y las unidades se adjuntan a TODOS los requests automáticamente.
  // Así no tienes que repetirlos en cada llamada al servicio.
  params: {
    appid: process.env.EXPO_PUBLIC_WEATHER_API_KEY,
    units: 'metric', // Celsius. Cambia a 'imperial' para Fahrenheit
    lang: 'es', // Respuestas en español
  },
});

// INTERCEPTOR DE RESPUESTA: si el servidor responde con error (4xx, 5xx),
// extraemos el mensaje legible antes de que llegue al componente.
api.interceptors.response.use(
  response => response,
  (error: AxiosError<{ message?: string }>) => {
    const serverMessage = error.response?.data?.message;
    const friendlyMessage = serverMessage ?? error.message ?? 'Error de red desconocido';
    return Promise.reject(new Error(friendlyMessage));
  },
);

export default api;
