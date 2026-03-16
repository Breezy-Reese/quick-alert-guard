import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, ChangePasswordPayload } from '@/services/authService';
import { userService, UpdateProfilePayload, EmergencyContact, MedicalInfo, PaginationParams } from '@/services/userService';
import { incidentService, CreateIncidentPayload } from '@/services/incidentService';
import { ambulanceService, CreateAmbulancePayload, UpdateAmbulancePayload, AmbulanceStatus } from '@/services/ambulanceService';
import { hospitalService, HospitalCapacity, HospitalLocation, DispatchPayload, AnalyticsPeriod } from '@/services/hospitalService';
import { adminService, AdminPaginationParams, AuditLogParams, IncidentFilterParams, CreateExportPayload, UpdateUserPayload } from '@/services/adminService';

/* ============================================================
   QUERY KEYS
============================================================ */

export const QK = {
  // Auth
  me: ['auth', 'me'],

  // User
  profile: (id?: string) => ['users', 'profile', id ?? 'me'],
  emergencyContacts: ['users', 'emergency-contacts'],
  medicalInfo: ['users', 'medical-info'],
  tripScores: ['users', 'trip-scores'],
  avgTripScore: ['users', 'trip-scores', 'avg'],
  preferences: ['users', 'preferences'],
  drivers: (p?: PaginationParams) => ['users', 'drivers', p],
  hospitals: (p?: PaginationParams) => ['users', 'hospitals', p],
  responders: (p?: PaginationParams) => ['users', 'responders', p],

  // Incidents
  activeIncidents: ['incidents', 'active'],
  incidentStats: ['incidents', 'stats'],
  incident: (id: string) => ['incidents', id],
  userIncidents: (userId: string) => ['incidents', 'user', userId],

  // Ambulances
  ambulances: ['ambulances'],
  ambulance: (id: string) => ['ambulances', id],

  // Hospital
  hospitalDashboard: ['hospital', 'dashboard'],
  hospitalStats: ['hospital', 'stats'],
  hospitalIncidents: (p?: object) => ['hospital', 'incidents', p],
  hospitalResponders: ['hospital', 'responders'],
  hospitalAnalytics: (period?: string) => ['hospital', 'analytics', period],

  // Admin
  adminDashboard: ['admin', 'dashboard'],
  adminUsers: (p?: AdminPaginationParams) => ['admin', 'users', p],
  adminUser: (id: string) => ['admin', 'users', id],
  adminIncidents: (p?: IncidentFilterParams) => ['admin', 'incidents', p],
  auditLog: (p?: AuditLogParams) => ['admin', 'audit-log', p],
  exportJobs: (p?: AdminPaginationParams) => ['admin', 'exports', p],
  exportJob: (id: string) => ['admin', 'exports', id],
  systemHealth: ['admin', 'system', 'health'],
  systemReports: ['admin', 'reports'],
} as const;

/* ============================================================
   AUTH HOOKS
============================================================ */

export const useMe = () =>
  useQuery({ queryKey: QK.me, queryFn: authService.getMe, staleTime: 5 * 60 * 1000 });

export const useChangePassword = () =>
  useMutation({ mutationFn: (p: ChangePasswordPayload) => authService.changePassword(p) });

export const useResendVerification = () =>
  useMutation({ mutationFn: authService.resendVerification });

/* ============================================================
   USER HOOKS
============================================================ */

export const useUserProfile = (userId?: string) =>
  useQuery({ queryKey: QK.profile(userId), queryFn: () => userService.getProfile(userId) });

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: UpdateProfilePayload) => userService.updateProfile(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.profile() }),
  });
};

export const useEmergencyContacts = () =>
  useQuery({ queryKey: QK.emergencyContacts, queryFn: userService.getEmergencyContacts });

export const useAddEmergencyContact = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: EmergencyContact) => userService.addEmergencyContact(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.emergencyContacts }),
  });
};

export const useUpdateEmergencyContact = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ contactId, payload }: { contactId: string; payload: EmergencyContact }) =>
      userService.updateEmergencyContact(contactId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.emergencyContacts }),
  });
};

export const useDeleteEmergencyContact = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.deleteEmergencyContact(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.emergencyContacts }),
  });
};

export const useMedicalInfo = () =>
  useQuery({ queryKey: QK.medicalInfo, queryFn: userService.getMedicalInfo });

export const useUpdateMedicalInfo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: MedicalInfo) => userService.updateMedicalInfo(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.medicalInfo }),
  });
};

export const useTripScores = () =>
  useQuery({ queryKey: QK.tripScores, queryFn: userService.getTripScores });

export const useAverageTripScore = () =>
  useQuery({ queryKey: QK.avgTripScore, queryFn: userService.getAverageTripScore });

export const usePreferences = () =>
  useQuery({ queryKey: QK.preferences, queryFn: userService.getPreferences });

export const useSavePreferences = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userService.savePreferences,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.preferences }),
  });
};

export const useAllDrivers = (params?: PaginationParams) =>
  useQuery({ queryKey: QK.drivers(params), queryFn: () => userService.getAllDrivers(params) });

export const useAllHospitals = (params?: PaginationParams) =>
  useQuery({ queryKey: QK.hospitals(params), queryFn: () => userService.getAllHospitals(params) });

export const useAllResponders = (params?: PaginationParams) =>
  useQuery({ queryKey: QK.responders(params), queryFn: () => userService.getAllResponders(params) });

/* ============================================================
   INCIDENT HOOKS
============================================================ */

export const useActiveIncidents = () =>
  useQuery({
    queryKey: QK.activeIncidents,
    queryFn: incidentService.getActiveIncidents,
    refetchInterval: 15_000, // poll every 15s — emergencies are time-sensitive
  });

export const useIncidentStats = () =>
  useQuery({ queryKey: QK.incidentStats, queryFn: incidentService.getIncidentStats });

export const useIncident = (id: string) =>
  useQuery({
    queryKey: QK.incident(id),
    queryFn: () => incidentService.getIncident(id),
    enabled: !!id,
  });

export const useUserIncidents = (userId: string, params?: { page?: number; limit?: number }) =>
  useQuery({
    queryKey: QK.userIncidents(userId),
    queryFn: () => incidentService.getUserIncidents(userId, params),
    enabled: !!userId,
  });

export const useCreateIncident = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: CreateIncidentPayload) => incidentService.createIncident(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.activeIncidents }),
  });
};

export const useAcceptIncident = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => incidentService.acceptIncident(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.activeIncidents }),
  });
};

export const useResolveIncident = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => incidentService.resolveIncident(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.activeIncidents }),
  });
};

export const useCancelIncident = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => incidentService.cancelIncident(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.activeIncidents }),
  });
};

/* ============================================================
   AMBULANCE HOOKS
============================================================ */

export const useAmbulances = () =>
  useQuery({ queryKey: QK.ambulances, queryFn: ambulanceService.getAll });

export const useAmbulance = (id: string) =>
  useQuery({
    queryKey: QK.ambulance(id),
    queryFn: () => ambulanceService.getById(id),
    enabled: !!id,
  });

export const useCreateAmbulance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: CreateAmbulancePayload) => ambulanceService.create(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.ambulances }),
  });
};

export const useUpdateAmbulance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAmbulancePayload }) =>
      ambulanceService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.ambulances }),
  });
};

export const useUpdateAmbulanceStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AmbulanceStatus }) =>
      ambulanceService.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.ambulances }),
  });
};

export const useDeleteAmbulance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ambulanceService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.ambulances }),
  });
};

/* ============================================================
   HOSPITAL HOOKS — for HospitalDashboard, Incidents, Responders, Analytics, Settings
============================================================ */

/** HospitalDashboard */
export const useHospitalDashboard = () =>
  useQuery({ queryKey: QK.hospitalDashboard, queryFn: hospitalService.getDashboard });

/** HospitalDashboard stats cards */
export const useHospitalStats = () =>
  useQuery({ queryKey: QK.hospitalStats, queryFn: hospitalService.getStats });

/** HospitalIncidents page */
export const useHospitalIncidents = (params?: { page?: number; limit?: number; status?: string }) =>
  useQuery({
    queryKey: QK.hospitalIncidents(params),
    queryFn: () => hospitalService.getIncidents(params),
  });

/** HospitalResponders page */
export const useHospitalResponders = () =>
  useQuery({ queryKey: QK.hospitalResponders, queryFn: hospitalService.getAvailableResponders });

/** HospitalAnalytics page */
export const useHospitalAnalytics = (period?: AnalyticsPeriod) =>
  useQuery({
    queryKey: QK.hospitalAnalytics(period),
    queryFn: () => hospitalService.getAnalytics(period),
  });

/** HospitalSettings — update capacity */
export const useUpdateHospitalCapacity = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: HospitalCapacity) => hospitalService.updateCapacity(p),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.hospitalDashboard });
      qc.invalidateQueries({ queryKey: QK.hospitalStats });
    },
  });
};

/** HospitalSettings — update location */
export const useUpdateHospitalLocation = () =>
  useMutation({ mutationFn: (p: HospitalLocation) => hospitalService.updateLocation(p) });

/** Dispatch responder from HospitalIncidentDetails */
export const useDispatchResponder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: DispatchPayload) => hospitalService.dispatchResponder(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.hospitalResponders }),
  });
};

/** DriverEmergency — find nearest hospital */
export const useNearbyHospitals = (params?: { lat: number; lng: number; radius?: number }) =>
  useQuery({
    queryKey: ['hospitals', 'nearby', params],
    queryFn: () => hospitalService.getNearby(params!),
    enabled: !!params?.lat && !!params?.lng,
  });

/* ============================================================
   ADMIN HOOKS — for AdminDashboard, Users, SystemHealth, Logs, Reports
============================================================ */

/** AdminDashboard */
export const useAdminDashboard = () =>
  useQuery({ queryKey: QK.adminDashboard, queryFn: adminService.getDashboardStats });

/** AdminUsers page */
export const useAdminUsers = (params?: AdminPaginationParams) =>
  useQuery({
    queryKey: QK.adminUsers(params),
    queryFn: () => adminService.getAllUsers(params),
  });

export const useAdminUser = (id: string) =>
  useQuery({
    queryKey: QK.adminUser(id),
    queryFn: () => adminService.getUserById(id),
    enabled: !!id,
  });

export const useUpdateAdminUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      adminService.updateUser(id, payload),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: QK.adminUsers() });
      qc.invalidateQueries({ queryKey: QK.adminUser(id) });
    },
  });
};

export const useToggleUserStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.toggleUserStatus(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.adminUsers() }),
  });
};

export const useDeleteAdminUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.adminUsers() }),
  });
};

/** AdminLogs page */
export const useAuditLog = (params?: AuditLogParams) =>
  useQuery({
    queryKey: QK.auditLog(params),
    queryFn: () => adminService.getAuditLog(params),
  });

/** AdminReports page — export jobs */
export const useExportJobs = (params?: AdminPaginationParams) =>
  useQuery({
    queryKey: QK.exportJobs(params),
    queryFn: () => adminService.getExportJobs(params),
  });

export const useCreateExportJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: CreateExportPayload) => adminService.createExportJob(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.exportJobs() }),
  });
};

export const useDownloadExport = () =>
  useMutation({
    mutationFn: async (id: string) => {
      const blob = await adminService.downloadExport(id);
      // Auto-trigger browser download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export-${id}`;
      a.click();
      URL.revokeObjectURL(url);
    },
  });

/** AdminSystemHealth page */
export const useSystemHealth = () =>
  useQuery({
    queryKey: QK.systemHealth,
    queryFn: adminService.getSystemHealth,
    refetchInterval: 30_000, // refresh every 30s
  });

/** AdminReports page */
export const useSystemReports = () =>
  useQuery({ queryKey: QK.systemReports, queryFn: adminService.getSystemReports });

/** Admin incidents (for AdminReports) */
export const useAdminIncidents = (params?: IncidentFilterParams) =>
  useQuery({
    queryKey: QK.adminIncidents(params),
    queryFn: () => adminService.getAllIncidents(params),
  });