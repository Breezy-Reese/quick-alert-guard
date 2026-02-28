import React, { useEffect, useState } from "react";
import { hospitalService } from "@/services/api/hospital.service";
import type { HospitalStats, Incident } from "@/types";
import StatsCard from "@/components/common/StatsCard";
import EmptyState from "@/components/common/EmptyState";
import { IncidentStatusBadge, SeverityBadge } from "@/components/common/StatusBadges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Ambulance, Clock, Users, AlertTriangle } from "lucide-react";

const HospitalDashboard: React.FC = () => {
  const [stats, setStats] = useState<HospitalStats | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const [statsRes, incidentsRes] = await Promise.all([
          hospitalService.getStats(),
          hospitalService.getIncidents({ page: 1 }),
        ]);
        setStats(statsRes.data.data);
        setIncidents(incidentsRes.data.data);
      } catch {
        setError("Unable to load dashboard. Backend may not be connected.");
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Hospital Dashboard</h1>
        <p className="text-sm text-muted-foreground">Emergency response overview</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Active Incidents" value={stats?.activeIncidents ?? null} icon={Activity} variant="emergency" isLoading={isLoading} />
        <StatsCard title="Pending Responses" value={stats?.pendingResponses ?? null} icon={Clock} variant="warning" isLoading={isLoading} />
        <StatsCard title="Available Ambulances" value={stats?.availableAmbulances ?? null} icon={Ambulance} variant="success" isLoading={isLoading} />
        <StatsCard title="Avg Response Time" value={stats?.avgResponseTime ? `${stats.avgResponseTime}m` : null} icon={Clock} variant="info" isLoading={isLoading} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-4 w-4 text-emergency" /> Live Incident Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm text-muted-foreground">{error}</p>
          ) : isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded bg-muted" />)}
            </div>
          ) : incidents.length > 0 ? (
            <div className="space-y-3">
              {incidents.slice(0, 5).map((incident) => (
                <div key={incident.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{incident.driverName}</p>
                    <p className="text-xs text-muted-foreground">{incident.location.address || `${incident.location.lat.toFixed(4)}, ${incident.location.lng.toFixed(4)}`}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={incident.severity} />
                    <IncidentStatusBadge status={incident.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Activity} title="No active incidents" description="Incoming incidents will appear here in real-time." />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HospitalDashboard;
