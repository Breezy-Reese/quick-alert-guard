import React, { useEffect, useState } from "react";
import { adminService } from "@/services/api/admin.service";
import type { SystemHealth } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminSystemHealth: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHealth = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getSystemHealth();
      setHealth(res.data.data);
    } catch {} finally { setIsLoading(false); }
  };

  useEffect(() => { fetchHealth(); }, []);

  const statusColor = (status: string) => {
    if (status === "operational") return "bg-success";
    if (status === "degraded") return "bg-warning";
    if (status === "down") return "bg-destructive";
    return "bg-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Health</h1>
          <p className="text-sm text-muted-foreground">Monitor service statuses</p>
        </div>
        <Button variant="outline" onClick={fetchHealth} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />)}
        </div>
      ) : health ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.values(health).map((service) => (
            <Card key={service.name}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Server className="h-4 w-4 text-primary" /> {service.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`h-3 w-3 rounded-full ${statusColor(service.status)}`} />
                  <span className="text-sm font-medium capitalize text-foreground">{service.status}</span>
                </div>
                {service.latency && <p className="text-xs text-muted-foreground">Latency: {service.latency}ms</p>}
                <p className="text-xs text-muted-foreground">Last checked: {new Date(service.lastChecked).toLocaleTimeString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Unable to fetch system health. Backend not connected.</p>
      )}
    </div>
  );
};

export default AdminSystemHealth;
