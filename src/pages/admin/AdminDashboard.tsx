import React, { useEffect, useState } from "react";
import { adminService } from "@/services/api/admin.service";
import StatsCard from "@/components/common/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, Building2, Server, Shield } from "lucide-react";

interface SystemService {
  name: string;
  status: "operational" | "degraded" | "down";
  latency?: number;
}

interface AdminStats {
  totalUsers?: number;
  totalDrivers?: number;
  totalHospitals?: number;
  totalResponders?: number;
  totalIncidents?: number;
  activeIncidents?: number;
  resolvedIncidents?: number;
  systemHealth?: Record<string, SystemService>;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [health, setHealth] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsResult, healthResult] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getSystemHealth(),
        ]);
        setStats(statsResult?.stats ?? statsResult);
        setHealth(healthResult);
      } catch (err) {
        console.error("Failed to load admin dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">System-wide overview</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers ?? null}
          icon={Users}
          isLoading={isLoading}
        />
        <StatsCard
          title="Total Drivers"
          value={stats?.totalDrivers ?? null}
          icon={Shield}
          variant="info"
          isLoading={isLoading}
        />
        <StatsCard
          title="Total Hospitals"
          value={stats?.totalHospitals ?? null}
          icon={Building2}
          variant="success"
          isLoading={isLoading}
        />
        <StatsCard
          title="Active Incidents"
          value={stats?.activeIncidents ?? null}
          icon={Activity}
          variant="emergency"
          isLoading={isLoading}
        />
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
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded bg-muted" />
              ))}
            </div>
          ) : health ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {/* Server */}
              <div className="rounded-lg border border-border p-3">
                <p className="text-sm font-medium text-foreground">Server</p>
                <div className="mt-1 flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${health.status === 'healthy' ? 'bg-success' : 'bg-warning'}`} />
                  <span className="text-xs capitalize text-muted-foreground">{health.status}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">v{health.version}</p>
              </div>
              {/* Database */}
              <div className="rounded-lg border border-border p-3">
                <p className="text-sm font-medium text-foreground">Database</p>
                <div className="mt-1 flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${health.database === 'connected' ? 'bg-success' : 'bg-destructive'}`} />
                  <span className="text-xs capitalize text-muted-foreground">{health.database}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">MongoDB</p>
              </div>
              {/* Uptime */}
              <div className="rounded-lg border border-border p-3">
                <p className="text-sm font-medium text-foreground">Uptime</p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  <span className="text-xs text-muted-foreground">
                    {Math.floor(health.uptime / 3600)}h {Math.floor((health.uptime % 3600) / 60)}m
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{health.environment}</p>
              </div>
              {/* Memory */}
              <div className="rounded-lg border border-border p-3">
                <p className="text-sm font-medium text-foreground">Memory</p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-info" />
                  <span className="text-xs text-muted-foreground">
                    {(health.memory?.heapUsed / 1024 / 1024).toFixed(1)} MB
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">heap used</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              System health data unavailable. Backend not connected.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
