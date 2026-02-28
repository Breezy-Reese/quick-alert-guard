import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { emergencyService } from "@/services/api/emergency.service";
import type { EmergencyAlert } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, MapPin, Phone, User, Clock } from "lucide-react";

const EmergencyAlertScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [alert, setAlert] = useState<EmergencyAlert | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        const res = await emergencyService.getAlertById(id);
        setAlert(res.data.data);
      } catch {} finally { setIsLoading(false); }
    };
    fetch();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Emergency Banner */}
        <div className="rounded-lg bg-emergency p-6 text-center text-emergency-foreground">
          <Shield className="mx-auto mb-2 h-12 w-12" />
          <h1 className="text-2xl font-bold">Emergency Alert</h1>
          <p className="text-sm opacity-80">{alert ? `Alert #${alert.id.slice(0, 8)}` : "Alert details unavailable"}</p>
        </div>

        {alert ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm"><User className="h-4 w-4 text-primary" /> Driver</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="font-medium">{alert.driverInfo.name}</p>
                  <p className="text-muted-foreground">{alert.driverInfo.phone}</p>
                  {alert.driverInfo.vehiclePlate && <p className="text-muted-foreground">Plate: {alert.driverInfo.vehiclePlate}</p>}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-primary" /> Location</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="font-medium">{alert.location.address || "Unknown address"}</p>
                  <p className="text-muted-foreground">{alert.location.lat.toFixed(6)}, {alert.location.lng.toFixed(6)}</p>
                </CardContent>
              </Card>
            </div>

            {/* Map placeholder */}
            <Card>
              <CardContent className="flex h-64 items-center justify-center bg-muted/50">
                <div className="text-center">
                  <MapPin className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Live responder tracking map</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm"><Clock className="h-4 w-4 text-primary" /> Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium capitalize">{alert.type}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="font-medium capitalize">{alert.status}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-medium">{new Date(alert.timestamp).toLocaleString()}</span></div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Alert data unavailable. Backend may not be connected.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EmergencyAlertScreen;
