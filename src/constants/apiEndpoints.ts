export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  REFRESH_TOKEN: "/auth/refresh",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  ME: "/auth/me",

  // Users
  USERS: "/users",
  USER_BY_ID: (id: string) => `/users/${id}`,
  USER_ROLE: (id: string) => `/users/${id}/role`,

  // Driver
  DRIVER_PROFILE: "/driver/profile",
  DRIVER_STATS: "/driver/stats",
  DRIVER_VEHICLE: "/driver/vehicle",
  DRIVER_CONTACTS: "/driver/emergency-contacts",
  DRIVER_CONTACT_BY_ID: (id: string) => `/driver/emergency-contacts/${id}`,

  // Trips
  TRIPS: "/trips",
  TRIP_BY_ID: (id: string) => `/trips/${id}`,
  TRIP_ACTIVE: "/trips/active",
  TRIP_START: "/trips/start",
  TRIP_END: (id: string) => `/trips/${id}/end`,

  // Emergency
  EMERGENCY_TRIGGER: "/emergency/trigger",
  EMERGENCY_CANCEL: (id: string) => `/emergency/${id}/cancel`,
  EMERGENCY_ALERTS: "/emergency/alerts",
  EMERGENCY_ALERT_BY_ID: (id: string) => `/emergency/alerts/${id}`,

  // Incidents
  INCIDENTS: "/incidents",
  INCIDENT_BY_ID: (id: string) => `/incidents/${id}`,
  INCIDENT_ASSIGN: (id: string) => `/incidents/${id}/assign`,
  INCIDENT_RESOLVE: (id: string) => `/incidents/${id}/resolve`,

  // Hospital
  HOSPITAL_PROFILE: "/hospital/profile",
  HOSPITAL_STATS: "/hospital/stats",

  // Ambulances
  AMBULANCES: "/ambulances",
  AMBULANCE_BY_ID: (id: string) => `/ambulances/${id}`,
  AMBULANCE_DISPATCH: (id: string) => `/ambulances/${id}/dispatch`,
  AMBULANCE_STATUS: (id: string) => `/ambulances/${id}/status`,

  // Responders
  RESPONDERS: "/responders",
  RESPONDER_BY_ID: (id: string) => `/responders/${id}`,
  RESPONDER_ASSIGN: (id: string) => `/responders/${id}/assign`,

  // Analytics
  ANALYTICS_RESPONSE_TIMES: "/analytics/response-times",
  ANALYTICS_INCIDENT_TRENDS: "/analytics/incident-trends",
  ANALYTICS_PERFORMANCE: "/analytics/performance",

  // Admin
  ADMIN_STATS: "/admin/stats",
  ADMIN_SYSTEM_HEALTH: "/admin/system-health",
  ADMIN_LOGS: "/admin/logs",
  ADMIN_REPORTS: "/admin/reports",

  // Location
  LOCATION_UPDATE: "/location/update",
} as const;
