export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  REFRESH_TOKEN: '/auth/refresh-token',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  CHANGE_PASSWORD: '/auth/change-password',
  VERIFY_EMAIL: '/auth/verify-email',
  RESEND_VERIFICATION: '/auth/resend-verification',

  // Users
  PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  EMERGENCY_CONTACTS: '/users/emergency-contacts',
  MEDICAL_INFO: '/users/medical-info',
  PREFERENCES: '/users/preferences',
  TRIP_SCORES: '/users/trip-scores',
  DRIVERS: '/users/drivers',
  HOSPITALS: '/users/hospitals',
  RESPONDERS: '/users/responders',

  // Driver
  DRIVER_STATS: '/driver/stats',
  DRIVER_VEHICLE: '/driver/vehicle',
  DRIVER_CONTACTS: '/driver/contacts',
  DRIVER_CONTACT_BY_ID: (id: string) => `/driver/contacts/${id}`,
  TRIPS: '/driver/trips',
  TRIP_ACTIVE: '/driver/trips/active',
  TRIP_START: '/driver/trips/start',
  TRIP_END: (id: string) => `/driver/trips/${id}/end`,

  // Incidents
  INCIDENTS: '/incidents',
  ACTIVE_INCIDENTS: '/incidents/active',
  INCIDENT_STATS: '/incidents/stats',

  // Ambulances
  AMBULANCES: '/ambulances',

  // Hospital
  HOSPITAL_DASHBOARD: '/hospitals/dashboard',
  HOSPITAL_CAPACITY: '/hospitals/capacity',
  HOSPITAL_INCIDENTS: '/hospitals/incidents',
  HOSPITAL_RESPONDERS: '/hospitals/responders',
  HOSPITAL_DISPATCH: '/hospitals/dispatch',
  HOSPITAL_ANALYTICS: '/hospitals/analytics',
  HOSPITAL_STATS: '/hospitals/stats',
  HOSPITAL_LOCATION: '/hospitals/location',
  HOSPITALS_NEARBY: '/hospitals/nearby',

  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_INCIDENTS: '/admin/incidents',
  ADMIN_AUDIT_LOG: '/admin/audit-log',
  ADMIN_EXPORTS: '/admin/exports',
  ADMIN_SYSTEM_HEALTH: '/admin/system/health',
  ADMIN_REPORTS: '/admin/reports',
} as const;