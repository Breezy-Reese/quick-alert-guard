import axiosInstance from "@/config/axios.config";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type { ApiResponse, DriverStats, EmergencyContact, Trip, Vehicle, PaginatedResponse } from "@/types";

export const driverService = {
  getStats: () =>
    axiosInstance.get<ApiResponse<DriverStats>>(API_ENDPOINTS.DRIVER_STATS),

  // Vehicle
  getVehicle: () =>
    axiosInstance.get<ApiResponse<Vehicle>>(API_ENDPOINTS.DRIVER_VEHICLE),

  updateVehicle: (data: Partial<Vehicle>) =>
    axiosInstance.put<ApiResponse<Vehicle>>(API_ENDPOINTS.DRIVER_VEHICLE, data),

  // Emergency Contacts
  getContacts: () =>
    axiosInstance.get<ApiResponse<EmergencyContact[]>>(API_ENDPOINTS.DRIVER_CONTACTS),

  addContact: (data: Omit<EmergencyContact, "id">) =>
    axiosInstance.post<ApiResponse<EmergencyContact>>(API_ENDPOINTS.DRIVER_CONTACTS, data),

  updateContact: (id: string, data: Partial<EmergencyContact>) =>
    axiosInstance.put<ApiResponse<EmergencyContact>>(API_ENDPOINTS.DRIVER_CONTACT_BY_ID(id), data),

  deleteContact: (id: string) =>
    axiosInstance.delete(API_ENDPOINTS.DRIVER_CONTACT_BY_ID(id)),

  // Trips
  getTrips: (params?: { page?: number; status?: string }) =>
    axiosInstance.get<PaginatedResponse<Trip>>(API_ENDPOINTS.TRIPS, { params }),

  getActiveTrip: () =>
    axiosInstance.get<ApiResponse<Trip | null>>(API_ENDPOINTS.TRIP_ACTIVE, {
      params: { _t: Date.now() },
      headers: { "Cache-Control": "no-cache" },
    }),

  startTrip: (startLocation: { lat: number; lng: number }) =>
    axiosInstance.post<ApiResponse<Trip>>(API_ENDPOINTS.TRIP_START, { startLocation }),

  endTrip: (id: string, endLocation: { lat: number; lng: number }) =>
    axiosInstance.put<ApiResponse<Trip>>(API_ENDPOINTS.TRIP_END(id), { endLocation }),
  //             ^^^ PUT not POST — matches the backend route
};