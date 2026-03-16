import React, { useEffect, useState } from "react";
import { adminService } from "@/services/api/admin.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/common/EmptyState";
import { BookOpen, Download, RefreshCw } from "lucide-react";

// Matches backend getSystemReports response
interface SystemReports {
  totalIncidents: number;
  resolvedIncidents: number;
  incidentsByStatus: Record<string, number>;
  incidentsBySeverity: Record<string, number>;
  incidentsByType: Record<string, number>;
  newUsersThisMonth: number;
  incidentsThisMonth: number;
}

const severityColor = (severity: string) => {
  if (severity === "fatal") return "bg-destructive/15 text-destructive border-destructive/30";
  if (severity === "critical") return "bg-orange-500/15 text-orange-500 border-orange-500/30";
  if (severity === "high") return "bg-warning/15 text-warning border-warning/30";
  if (severity === "medium") return "bg-info/15 text-info border-info/30";
  return "bg-muted text-muted-foreground";
};

const AdminReports: React.FC = () => {
  const [reports, setReports] = useState<SystemReports | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      // getSystemReports() already returns data.data — no extra unwrapping
      const result = await adminService.getSystemReports();
      setReports(result);
    } catch (err) {
      console.error("Failed to load reports:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground">System-wide analytics and statistics</p>
        </div>
        <Button variant="outline" onClick={fetchReports} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : reports ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-xs text-muted-foreground">Total Incidents</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{reports.totalIncidents}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-xs text-muted-foreground">Resolved</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-success">{reports.resolvedIncidents}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-xs text-muted-foreground">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{reports.incidentsThisMonth}</p>
                <p className="text-xs text-muted-foreground">incidents</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-xs text-muted-foreground">New Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{reports.newUsersThisMonth}</p>
                <p className="text-xs text-muted-foreground">this month</p>
              </CardContent>
            </Card>
          </div>

          {/* Breakdown Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* By Status */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Incidents by Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(reports.incidentsByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm capitalize text-muted-foreground">{status}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* By Severity */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Incidents by Severity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(reports.incidentsBySeverity).map(([severity, count]) => (
                  <div key={severity} className="flex items-center justify-between">
                    <Badge variant="outline" className={`text-[10px] ${severityColor(severity)}`}>
                      {severity.toUpperCase()}
                    </Badge>
                    <span className="text-sm font-medium text-foreground">{count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* By Type */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Incidents by Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(reports.incidentsByType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm capitalize text-muted-foreground">{type}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No reports available"
          description="Report data will appear here when backend is connected."
        />
      )}
    </div>
  );
};

export default AdminReports;
