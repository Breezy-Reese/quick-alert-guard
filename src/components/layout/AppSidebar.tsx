import React from "react";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard, AlertTriangle, Phone, MapPin, History, User, Settings, Car,
  Activity, List, Ambulance, Users, BarChart3, Heart,
  Shield, Server, FileText, BookOpen,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes";
import type { UserRole } from "@/types";

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const driverNav: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: ROUTES.DRIVER_DASHBOARD, icon: LayoutDashboard },
      { title: "Active Trip", url: ROUTES.DRIVER_ACTIVE_TRIP, icon: MapPin },
    ],
  },
  {
    label: "Emergency",
    items: [
      { title: "SOS", url: ROUTES.DRIVER_EMERGENCY, icon: AlertTriangle },
      { title: "Contacts", url: ROUTES.DRIVER_CONTACTS, icon: Phone },
    ],
  },
  {
    label: "History",
    items: [
      { title: "Trips", url: ROUTES.DRIVER_TRIP_HISTORY, icon: History },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Profile", url: ROUTES.DRIVER_PROFILE, icon: User },
      { title: "Vehicle", url: ROUTES.DRIVER_VEHICLE, icon: Car },
      { title: "Settings", url: ROUTES.DRIVER_SETTINGS, icon: Settings },
    ],
  },
];

const hospitalNav: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: ROUTES.HOSPITAL_DASHBOARD, icon: LayoutDashboard },
      { title: "Incidents", url: ROUTES.HOSPITAL_INCIDENTS, icon: Activity },
    ],
  },
  {
    label: "Resources",
    items: [
      { title: "Ambulances", url: ROUTES.HOSPITAL_AMBULANCES, icon: Ambulance },
      { title: "Responders", url: ROUTES.HOSPITAL_RESPONDERS, icon: Users },
    ],
  },
  {
    label: "Analytics",
    items: [
      { title: "Analytics", url: ROUTES.HOSPITAL_ANALYTICS, icon: BarChart3 },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Settings", url: ROUTES.HOSPITAL_SETTINGS, icon: Settings },
    ],
  },
];

const adminNav: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
    ],
  },
  {
    label: "Management",
    items: [
      { title: "Users", url: ROUTES.ADMIN_USERS, icon: Users },
      { title: "System Health", url: ROUTES.ADMIN_SYSTEM_HEALTH, icon: Server },
      { title: "Logs", url: ROUTES.ADMIN_LOGS, icon: FileText },
      { title: "Reports", url: ROUTES.ADMIN_REPORTS, icon: BookOpen },
    ],
  },
];

const navByRole: Record<UserRole, NavGroup[]> = {
  driver: driverNav,
  hospital: hospitalNav,
  admin: adminNav,
};

const roleLabel: Record<UserRole, string> = {
  driver: "Driver Portal",
  hospital: "Hospital Portal",
  admin: "Admin Portal",
};

export const AppSidebar: React.FC = () => {
  const { user } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  if (!user) return null;

  const groups = navByRole[user.role] || [];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
            <Shield className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-sidebar-foreground">SAD System</span>
              <span className="text-[10px] text-sidebar-foreground/60">{roleLabel[user.role]}</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                      tooltip={item.title}
                    >
                      <NavLink
                        to={item.url}
                        end
                        className="hover:bg-sidebar-accent/50"
                        activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent">
              <User className="h-4 w-4 text-sidebar-accent-foreground" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-xs font-medium text-sidebar-foreground">{user.name}</span>
              <span className="truncate text-[10px] text-sidebar-foreground/60">{user.email}</span>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};
