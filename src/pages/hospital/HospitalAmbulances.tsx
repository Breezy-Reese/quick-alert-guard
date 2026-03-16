import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AmbulanceStatusBadge } from "@/components/common/StatusBadges";
import EmptyState from "@/components/common/EmptyState";
import { Ambulance as AmbulanceIcon } from "lucide-react";

const HospitalAmbulances: React.FC = () => {
  const [ambulances, setAmbulances] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/ambulances");
        // backend returns { success, data: { ambulances: [] } }
        setAmbulances(data?.data?.ambulances ?? data?.data ?? []);
      } catch (e) {
        console.error("Ambulances load error:", e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
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
            <div className="space-y-3 p-6">
              {[1, 2, 3].map((i) => <div key={i} className="h-12 animate-pulse rounded bg-muted" />)}
            </div>
          ) : ambulances.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plate</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Make</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Driver</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ambulances.map((a) => (
                  <TableRow key={a._id}>
                    <TableCell className="font-medium">{a.plateNumber}</TableCell>
                    <TableCell>{a.ambulanceModel}</TableCell>
                    <TableCell>{a.make}</TableCell>
                    <TableCell>{a.year}</TableCell>
                    <TableCell><AmbulanceStatusBadge status={a.status} /></TableCell>
                    <TableCell>{a.driverId?.name ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState icon={AmbulanceIcon} title="No ambulances" description="Ambulance data will appear here when available." />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HospitalAmbulances;
