import React, { useEffect, useState } from "react";
import { hospitalService } from "@/services/api/hospital.service";
import type { Responder } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/common/EmptyState";
import { Users } from "lucide-react";

const HospitalResponders: React.FC = () => {
  const [responders, setResponders] = useState<Responder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await hospitalService.getResponders();
        setResponders(res.data.data);
      } catch {} finally { setIsLoading(false); }
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Responders</h1>
        <p className="text-sm text-muted-foreground">Manage your response team</p>
      </div>
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-6">{[1,2,3].map(i => <div key={i} className="h-12 animate-pulse rounded bg-muted" />)}</div>
          ) : responders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {responders.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>{r.role}</TableCell>
                    <TableCell>{r.phone}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={r.isAvailable ? "bg-success/15 text-success border-success/30" : "bg-muted text-muted-foreground"}>
                        {r.isAvailable ? "Available" : "Busy"}
                      </Badge>
                    </TableCell>
                    <TableCell>{r.assignedIncidentId?.slice(0, 8) || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState icon={Users} title="No responders" description="Responder data will appear here when backend is connected." />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HospitalResponders;
