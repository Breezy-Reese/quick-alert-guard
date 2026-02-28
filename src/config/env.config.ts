export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || "http://localhost:3001",
  GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  APP_NAME: "Smart Accident Detection",
  APP_VERSION: "1.0.0",
} as const;
