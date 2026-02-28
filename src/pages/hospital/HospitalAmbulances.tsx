import React, { useEffect, useState } from "react";
import { hospitalService } from "@/services/api/hospital.service";
import type { Ambulance } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AmbulanceStatusBadge } from "@/components/common/StatusBadges";
import EmptyState from "@/components/common/EmptyState";
import { Ambulance as AmbulanceIcon } from "lucide-react";

const HospitalAmbulances: React.FC = () => {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await hospitalService.getAmbulances();
        setAmbulances(res.data.data);
      } catch {} finally { setIsLoading(false); }
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ambulance Management</h1>
        <p className="text-sm text-muted-foreground">Track and manage your fleet</p>
      </div>
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-6">{[1,2,3].map(i => <div key={i} className="h-12 animate-pulse rounded bg-muted" />)}</div>
          ) : ambulances.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle #</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Crew</TableHead>
                  <TableHead>Assigned Incident</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ambulances.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.vehicleNumber}</TableCell>
                    <TableCell><AmbulanceStatusBadge status={a.status} /></TableCell>
                    <TableCell>{a.crew.join(", ") || "—"}</TableCell>
                    <TableCell>{a.assignedIncidentId?.slice(0, 8) || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState icon={AmbulanceIcon} title="No ambulances" description="Ambulance data will appear here when backend is connected." />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HospitalAmbulances;
