import React, { useEffect, useState } from "react";
import { adminService } from "@/services/api/admin.service";
import type { AdminStats } from "@/types";
import StatsCard from "@/components/common/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, Building2, Server, Shield } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminService.getStats();
        setStats(res.data.data);
      } catch {} finally { setIsLoading(false); }
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">System-wide overview</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Users" value={stats?.totalUsers ?? null} icon={Users} isLoading={isLoading} />
        <StatsCard title="Total Drivers" value={stats?.totalDrivers ?? null} icon={Shield} variant="info" isLoading={isLoading} />
        <StatsCard title="Total Hospitals" value={stats?.totalHospitals ?? null} icon={Building2} variant="success" isLoading={isLoading} />
        <StatsCard title="Active Incidents" value={stats?.activeIncidents ?? null} icon={Activity} variant="emergency" isLoading={isLoading} />
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Server className="h-4 w-4 text-primary" /> System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[1,2,3,4].map(i => <div key={i} className="h-20 animate-pulse rounded bg-muted" />)}
            </div>
          ) : stats?.systemHealth ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {Object.values(stats.systemHealth).map((service) => (
                <div key={service.name} className="rounded-lg border border-border p-3">
                  <p className="text-sm font-medium text-foreground">{service.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${service.status === "operational" ? "bg-success" : service.status === "degraded" ? "bg-warning" : "bg-destructive"}`} />
                    <span className="text-xs capitalize text-muted-foreground">{service.status}</span>
                  </div>
                  {service.latency && <p className="mt-1 text-xs text-muted-foreground">{service.latency}ms</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">System health data unavailable. Backend not connected.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
