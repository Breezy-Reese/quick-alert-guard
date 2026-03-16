import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { driverService } from "@/services/api/driver.service";
import type { DriverStats } from "@/types";
import StatsCard from "@/components/common/StatsCard";
import EmptyState from "@/components/common/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, AlertTriangle, Navigation, Activity, Clock } from "lucide-react";

const DriverDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DriverStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await driverService.getStats();
        setStats(res.data.data);
      } catch {
        setError("Unable to load dashboard data. Your backend may not be connected yet.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome, {user?.name || "Driver"}</h1>
        <p className="text-sm text-muted-foreground">Your driving overview and safety status</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Trips"
          value={stats?.totalTrips ?? null}
          icon={Navigation}
          isLoading={isLoading}
        />
        <StatsCard
          title="Total Incidents"
          value={stats?.totalIncidents ?? null}
          icon={AlertTriangle}
          variant="warning"
          isLoading={isLoading}
        />
        <StatsCard
          title="Active Trip"
          value={stats?.activeTrip ? "In Progress" : "None"}
          icon={MapPin}
          variant={stats?.activeTrip ? "info" : "default"}
          isLoading={isLoading}
        />
        <StatsCard
  title="Safety Score"
  value={stats?.safetyScore ?? null}
  icon={Activity}
  variant="success"
  description={stats?.safetyScore ? `Score: ${stats.safetyScore}/100` : "Connected to backend"}
  isLoading={isLoading}
/>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm text-muted-foreground">{error}</p>
          ) : isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded bg-muted" />
              ))}
            </div>
          ) : stats?.recentActivity && stats.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {stats.recentActivity.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.description}</p>
                    <p className="text-xs text-muted-foreground">{item.type}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Activity}
              title="No recent activity"
              description="Your recent trips and events will appear here once your backend is connected."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverDashboard;
