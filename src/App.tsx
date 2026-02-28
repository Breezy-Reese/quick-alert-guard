import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ROUTES } from "@/constants/routes";

// Layout
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Public pages
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import NotFound from "@/pages/NotFound";

// Driver pages
import DriverDashboard from "@/pages/driver/DriverDashboard";
import DriverEmergency from "@/pages/driver/DriverEmergency";
import DriverContacts from "@/pages/driver/DriverContacts";
import DriverActiveTrip from "@/pages/driver/DriverActiveTrip";
import DriverTripHistory from "@/pages/driver/DriverTripHistory";
import DriverProfile from "@/pages/driver/DriverProfile";
import DriverVehicle from "@/pages/driver/DriverVehicle";
import DriverSettings from "@/pages/driver/DriverSettings";

// Hospital pages
import HospitalDashboard from "@/pages/hospital/HospitalDashboard";
import HospitalIncidents from "@/pages/hospital/HospitalIncidents";
import HospitalIncidentDetails from "@/pages/hospital/HospitalIncidentDetails";
import HospitalAmbulances from "@/pages/hospital/HospitalAmbulances";
import HospitalResponders from "@/pages/hospital/HospitalResponders";
import HospitalAnalytics from "@/pages/hospital/HospitalAnalytics";
import HospitalSettings from "@/pages/hospital/HospitalSettings";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminSystemHealth from "@/pages/admin/AdminSystemHealth";
import AdminLogs from "@/pages/admin/AdminLogs";
import AdminReports from "@/pages/admin/AdminReports";

// Emergency
import EmergencyAlertScreen from "@/pages/emergency/EmergencyAlertScreen";

const queryClient = new QueryClient();

// Redirects authenticated users to their dashboard
const AuthRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  if (isAuthenticated && user) {
    const dashboardMap = {
      driver: ROUTES.DRIVER_DASHBOARD,
      hospital: ROUTES.HOSPITAL_DASHBOARD,
      admin: ROUTES.ADMIN_DASHBOARD,
    };
    return <Navigate to={dashboardMap[user.role]} replace />;
  }
  return <HomePage />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path={ROUTES.HOME} element={<AuthRedirect />} />
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
              <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
              <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />

              {/* Driver Routes */}
              <Route element={<ProtectedRoute allowedRoles={["driver"]}><DashboardLayout /></ProtectedRoute>}>
                <Route path={ROUTES.DRIVER_DASHBOARD} element={<DriverDashboard />} />
                <Route path={ROUTES.DRIVER_EMERGENCY} element={<DriverEmergency />} />
                <Route path={ROUTES.DRIVER_CONTACTS} element={<DriverContacts />} />
                <Route path={ROUTES.DRIVER_ACTIVE_TRIP} element={<DriverActiveTrip />} />
                <Route path={ROUTES.DRIVER_TRIP_HISTORY} element={<DriverTripHistory />} />
                <Route path={ROUTES.DRIVER_PROFILE} element={<DriverProfile />} />
                <Route path={ROUTES.DRIVER_VEHICLE} element={<DriverVehicle />} />
                <Route path={ROUTES.DRIVER_SETTINGS} element={<DriverSettings />} />
              </Route>

              {/* Hospital Routes */}
              <Route element={<ProtectedRoute allowedRoles={["hospital"]}><DashboardLayout /></ProtectedRoute>}>
                <Route path={ROUTES.HOSPITAL_DASHBOARD} element={<HospitalDashboard />} />
                <Route path={ROUTES.HOSPITAL_INCIDENTS} element={<HospitalIncidents />} />
                <Route path={ROUTES.HOSPITAL_INCIDENT_DETAILS} element={<HospitalIncidentDetails />} />
                <Route path={ROUTES.HOSPITAL_AMBULANCES} element={<HospitalAmbulances />} />
                <Route path={ROUTES.HOSPITAL_RESPONDERS} element={<HospitalResponders />} />
                <Route path={ROUTES.HOSPITAL_ANALYTICS} element={<HospitalAnalytics />} />
                <Route path={ROUTES.HOSPITAL_SETTINGS} element={<HospitalSettings />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={["admin"]}><DashboardLayout /></ProtectedRoute>}>
                <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
                <Route path={ROUTES.ADMIN_USERS} element={<AdminUsers />} />
                <Route path={ROUTES.ADMIN_SYSTEM_HEALTH} element={<AdminSystemHealth />} />
                <Route path={ROUTES.ADMIN_LOGS} element={<AdminLogs />} />
                <Route path={ROUTES.ADMIN_REPORTS} element={<AdminReports />} />
              </Route>

              {/* Emergency (accessible to authenticated users) */}
              <Route path={ROUTES.EMERGENCY_ALERT} element={<ProtectedRoute><EmergencyAlertScreen /></ProtectedRoute>} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
