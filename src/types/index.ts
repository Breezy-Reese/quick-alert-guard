// ========== User Types ==========
export type UserRole = "driver" | "hospital" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DriverProfile extends User {
  role: "driver";
  licenseNumber?: string;
  vehicleId?: string;
  vehicle?: Vehicle;
  emergencyContacts: EmergencyContact[];
  isOnTrip: boolean;
}

export interface HospitalProfile extends User {
  role: "hospital";
  hospitalName: string;
  address: string;
  capacity: number;
  specializations: string[];
}

// ========== Vehicle Types ==========
export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  color: string;
  driverId: string;
}

// ========== Location Types ==========
export interface Location {
  lat: number;
  lng: number;
  address?: string;
  timestamp?: string;
}

// ========== Incident Types ==========
export type IncidentStatus =
  | "detected"
  | "confirmed"
  | "dispatched"
  | "en_route"
  | "on_scene"
  | "resolved"
  | "false_alarm";

export type IncidentSeverity = "low" | "medium" | "high" | "critical";

export interface Incident {
  id: string;
  driverId: string;
  driverName: string;
  location: Location;
  status: IncidentStatus;
  severity: IncidentSeverity;
  description?: string;
  detectedAt: string;
  resolvedAt?: string;
  assignedHospitalId?: string;
  assignedAmbulanceId?: string;
  responderId?: string;
  timeline: IncidentEvent[];
}

export interface IncidentEvent {
  id: string;
  incidentId: string;
  type: string;
  description: string;
  timestamp: string;
  userId?: string;
}

// ========== Emergency Types ==========
export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface EmergencyAlert {
  id: string;
  incidentId: string;
  type: "sos" | "auto_detect" | "panic";
  location: Location;
  driverInfo: {
    name: string;
    phone: string;
    vehiclePlate?: string;
  };
  timestamp: string;
  status: "active" | "acknowledged" | "resolved";
}

// ========== Ambulance Types ==========
export type AmbulanceStatus = "available" | "dispatched" | "en_route" | "on_scene" | "returning" | "out_of_service";

export interface Ambulance {
  id: string;
  vehicleNumber: string;
  hospitalId: string;
  status: AmbulanceStatus;
  currentLocation?: Location;
  crew: string[];
  assignedIncidentId?: string;
}

// ========== Trip Types ==========
export type TripStatus = "active" | "completed" | "cancelled";

export interface Trip {
  id: string;
  driverId: string;
  startLocation: Location;
  endLocation?: Location;
  startTime: string;
  endTime?: string;
  status: TripStatus;
  distance?: number;
  route?: Location[];
}

// ========== Responder Types ==========
export interface Responder {
  id: string;
  name: string;
  role: string;
  phone: string;
  hospitalId: string;
  isAvailable: boolean;
  assignedIncidentId?: string;
}

// ========== API Types ==========
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// ========== System Types ==========
export interface SystemHealth {
  api: ServiceStatus;
  database: ServiceStatus;
  socket: ServiceStatus;
  maps: ServiceStatus;
}

export type ServiceStatusType = "operational" | "degraded" | "down" | "unknown";

export interface ServiceStatus {
  name: string;
  status: ServiceStatusType;
  latency?: number;
  lastChecked: string;
}

export interface SystemLog {
  id: string;
  level: "info" | "warn" | "error" | "debug";
  message: string;
  source: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// ========== Stats Types ==========
export interface DriverStats {
  totalTrips: number;
  totalIncidents: number;
  activeTrip: Trip | null;
  recentActivity: ActivityItem[];
}

export interface HospitalStats {
  activeIncidents: number;
  pendingResponses: number;
  availableAmbulances: number;
  totalResponders: number;
  avgResponseTime: number;
}

export interface AdminStats {
  totalUsers: number;
  totalDrivers: number;
  totalHospitals: number;
  totalIncidents: number;
  activeIncidents: number;
  systemHealth: SystemHealth;
}

export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}
