import React, { useEffect, useState } from "react";
import { hospitalService } from "@/services/api/hospital.service";
import type { Incident, IncidentStatus, IncidentSeverity } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IncidentStatusBadge, SeverityBadge } from "@/components/common/StatusBadges";
import EmptyState from "@/components/common/EmptyState";
import { Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HospitalIncidents: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const params: any = { page: 1 };
        if (statusFilter !== "all") params.status = statusFilter;
        if (severityFilter !== "all") params.severity = severityFilter;
        const res = await hospitalService.getIncidents(params);
        setIncidents(res.data.data);
      } catch {
        // backend not connected
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [statusFilter, severityFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Incidents</h1>
        <p className="text-sm text-muted-foreground">Manage and respond to incidents</p>
      </div>

      <div className="flex gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="detected">Detected</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="dispatched">Dispatched</SelectItem>
            <SelectItem value="en_route">En Route</SelectItem>
            <SelectItem value="on_scene">On Scene</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Severity" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-6">
              {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-12 animate-pulse rounded bg-muted" />)}
            </div>
          ) : incidents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Driver</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Detected</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.map((incident) => (
                  <TableRow key={incident.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/hospital/incidents/${incident.id}`)}>
                    <TableCell className="font-medium">{incident.driverName}</TableCell>
                    <TableCell className="text-xs">{incident.location.address || `${incident.location.lat.toFixed(4)}, ${incident.location.lng.toFixed(4)}`}</TableCell>
                    <TableCell><SeverityBadge severity={incident.severity} /></TableCell>
                    <TableCell><IncidentStatusBadge status={incident.status} /></TableCell>
                    <TableCell className="text-xs">{new Date(incident.detectedAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState icon={Activity} title="No incidents found" description="Incidents matching your filters will appear here." />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HospitalIncidents;
