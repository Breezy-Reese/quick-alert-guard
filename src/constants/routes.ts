export const ROUTES = {
  // Public
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // Driver
  DRIVER_DASHBOARD: "/driver",
  DRIVER_EMERGENCY: "/driver/emergency",
  DRIVER_CONTACTS: "/driver/contacts",
  DRIVER_ACTIVE_TRIP: "/driver/trip",
  DRIVER_TRIP_HISTORY: "/driver/trips",
  DRIVER_PROFILE: "/driver/profile",
  DRIVER_SETTINGS: "/driver/settings",
  DRIVER_VEHICLE: "/driver/vehicle",

  // Hospital
  HOSPITAL_DASHBOARD: "/hospital",
  HOSPITAL_INCIDENTS: "/hospital/incidents",
  HOSPITAL_INCIDENT_DETAILS: "/hospital/incidents/:id",
  HOSPITAL_AMBULANCES: "/hospital/ambulances",
  HOSPITAL_RESPONDERS: "/hospital/responders",
  HOSPITAL_ANALYTICS: "/hospital/analytics",
  HOSPITAL_SETTINGS: "/hospital/settings",

  // Admin
  ADMIN_DASHBOARD: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_SYSTEM_HEALTH: "/admin/system",
  ADMIN_LOGS: "/admin/logs",
  ADMIN_REPORTS: "/admin/reports",

  // Emergency
  EMERGENCY_ALERT: "/emergency/:id",
} as const;
