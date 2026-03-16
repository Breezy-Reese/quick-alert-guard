import React, { useEffect, useState } from "react";
import { adminService } from "@/services/api/admin.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, RefreshCw, Database, Clock, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

// Backend returns: { status, timestamp, uptime, memory, database, environment, version }
interface SystemHealth {
  status: string;
  timestamp: string;
  uptime: number;
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  database: string;
  environment: string;
  version: string;
}

const formatBytes = (bytes: number) => {
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(1)} MB`;
};

const formatUptime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
};

const AdminSystemHealth: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHealth = async () => {
    setIsLoading(true);
    try {
      // getSystemHealth() already returns data.data — no extra unwrapping
      const result = await adminService.getSystemHealth();
      setHealth(result);
    } catch (err) {
      console.error("Failed to load system health:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchHealth(); }, []);

  const dbStatusColor = health?.database === "connected" ? "bg-success" : "bg-destructive";
  const serverStatusColor = health?.status === "healthy" ? "bg-success" : "bg-warning";

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
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : health ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Server Status */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Server className="h-4 w-4 text-primary" /> Server
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`h-3 w-3 rounded-full ${serverStatusColor}`} />
                  <span className="text-sm font-medium capitalize text-foreground">
                    {health.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Env: {health.environment}
                </p>
                <p className="text-xs text-muted-foreground">
                  v{health.version}
                </p>
              </CardContent>
            </Card>

            {/* Database */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Database className="h-4 w-4 text-primary" /> Database
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`h-3 w-3 rounded-full ${dbStatusColor}`} />
                  <span className="text-sm font-medium capitalize text-foreground">
                    {health.database}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">MongoDB</p>
              </CardContent>
            </Card>

            {/* Uptime */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-primary" /> Uptime
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold text-foreground">
                  {formatUptime(health.uptime)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Since {new Date(health.timestamp).toLocaleString()}
                </p>
              </CardContent>
            </Card>

            {/* Memory */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Cpu className="h-4 w-4 text-primary" /> Memory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium text-foreground">
                  {formatBytes(health.memory.heapUsed)} used
                </p>
                <p className="text-xs text-muted-foreground">
                  of {formatBytes(health.memory.heapTotal)} heap
                </p>
                <p className="text-xs text-muted-foreground">
                  RSS: {formatBytes(health.memory.rss)}
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          Unable to fetch system health. Backend not connected.
        </p>
      )}
    </div>
  );
};

export default AdminSystemHealth;
