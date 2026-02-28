import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { hospitalService } from "@/services/api/hospital.service";
import type { Incident } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IncidentStatusBadge, SeverityBadge } from "@/components/common/StatusBadges";
import { Button } from "@/components/ui/button";
import { MapPin, User, Clock, CheckCircle } from "lucide-react";

const HospitalIncidentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        const res = await hospitalService.getIncidentById(id);
        setIncident(res.data.data);
      } catch {
        // not found
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (isLoading) return <div className="h-64 animate-pulse rounded-lg bg-muted" />;

  if (!incident) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">Incident not found. Backend may not be connected.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Incident #{incident.id.slice(0, 8)}</h1>
          <div className="mt-1 flex gap-2">
            <SeverityBadge severity={incident.severity} />
            <IncidentStatusBadge status={incident.status} />
          </div>
        </div>
        {incident.status !== "resolved" && (
          <Button className="gap-2" onClick={() => hospitalService.resolveIncident(incident.id)}>
            <CheckCircle className="h-4 w-4" /> Resolve
          </Button>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4 text-primary" /> Driver Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-medium">{incident.driverName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Driver ID</span><span className="font-medium">{incident.driverId.slice(0, 8)}</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4 text-primary" /> Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Address</span><span className="font-medium">{incident.location.address || "N/A"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Coordinates</span><span className="font-medium">{incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)}</span></div>
          </CardContent>
        </Card>
      </div>

      {/* Map placeholder */}
      <Card>
        <CardContent className="flex h-64 items-center justify-center bg-muted/50">
          <div className="text-center">
            <MapPin className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Map will display here when Google Maps API key is configured</p>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4 text-primary" /> Event Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          {incident.timeline.length > 0 ? (
            <div className="space-y-4">
              {incident.timeline.map((event, i) => (
                <div key={event.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    {i < incident.timeline.length - 1 && <div className="flex-1 w-px bg-border" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-foreground">{event.description}</p>
                    <p className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No timeline events available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HospitalIncidentDetails;
