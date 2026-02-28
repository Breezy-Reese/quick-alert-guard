import React, { useEffect, useState } from "react";
import { driverService } from "@/services/api/driver.service";
import type { Trip } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/common/EmptyState";
import { History } from "lucide-react";

const DriverTripHistory: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await driverService.getTrips();
        setTrips(res.data.data);
      } catch {
        setError("Unable to load trip history.");
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  const statusVariant = (status: string) => {
    if (status === "completed") return "bg-success/15 text-success border-success/30";
    if (status === "active") return "bg-info/15 text-info border-info/30";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Trip History</h1>
        <p className="text-sm text-muted-foreground">View your past trips</p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-6">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-12 animate-pulse rounded bg-muted" />)}
            </div>
          ) : trips.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell className="font-medium">{new Date(trip.startTime).toLocaleDateString()}</TableCell>
                    <TableCell>{trip.startLocation?.address || `${trip.startLocation.lat.toFixed(4)}, ${trip.startLocation.lng.toFixed(4)}`}</TableCell>
                    <TableCell>{trip.endLocation?.address || (trip.endLocation ? `${trip.endLocation.lat.toFixed(4)}, ${trip.endLocation.lng.toFixed(4)}` : "—")}</TableCell>
                    <TableCell>{trip.distance ? `${trip.distance.toFixed(1)} km` : "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusVariant(trip.status)}>{trip.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={History}
              title="No trips yet"
              description="Your completed trips will appear here."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverTripHistory;
