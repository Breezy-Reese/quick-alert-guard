export const SOCKET_EVENTS = {
  // Connection
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  ERROR: "error",

  // Emergency
  EMERGENCY_ALERT: "emergency:alert",
  EMERGENCY_ACKNOWLEDGED: "emergency:acknowledged",
  EMERGENCY_RESOLVED: "emergency:resolved",
  EMERGENCY_UPDATE: "emergency:update",

  // Location
  LOCATION_UPDATE: "location:update",
  LOCATION_SUBSCRIBE: "location:subscribe",
  LOCATION_UNSUBSCRIBE: "location:unsubscribe",

  // Incident
  INCIDENT_CREATED: "incident:created",
  INCIDENT_UPDATED: "incident:updated",
  INCIDENT_ASSIGNED: "incident:assigned",
  INCIDENT_RESOLVED: "incident:resolved",

  // Ambulance
  AMBULANCE_DISPATCHED: "ambulance:dispatched",
  AMBULANCE_LOCATION: "ambulance:location",
  AMBULANCE_STATUS_CHANGED: "ambulance:status_changed",

  // System
  SYSTEM_HEALTH: "system:health",
  SYSTEM_LOG: "system:log",
} as const;
