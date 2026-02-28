import React, { useState, useCallback } from "react";
import { emergencyService } from "@/services/api/emergency.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Phone, X, Shield } from "lucide-react";

const DriverEmergency: React.FC = () => {
  const [isTriggering, setIsTriggering] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [activeAlertId, setActiveAlertId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const countdownRef = React.useRef<NodeJS.Timeout | null>(null);

  const startSOS = useCallback(() => {
    setCountdown(5);
    setError("");

    let count = 5;
    countdownRef.current = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(countdownRef.current!);
        triggerEmergency();
      }
    }, 1000);
  }, []);

  const cancelSOS = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    setCountdown(null);
  }, []);

  const triggerEmergency = async () => {
    setIsTriggering(true);
    setCountdown(null);
    try {
      // Try to get current location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
      }).catch(() => null);

      const location = position
        ? { lat: position.coords.latitude, lng: position.coords.longitude }
        : { lat: 0, lng: 0 };

      const res = await emergencyService.triggerEmergency({ type: "sos", location });
      setActiveAlertId(res.data.data.id);
    } catch {
      setError("Failed to send emergency alert. Backend may not be connected.");
    } finally {
      setIsTriggering(false);
    }
  };

  const cancelEmergency = async () => {
    if (!activeAlertId) return;
    try {
      await emergencyService.cancelEmergency(activeAlertId);
      setActiveAlertId(null);
    } catch {
      setError("Failed to cancel emergency.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Emergency SOS</h1>
        <p className="text-sm text-muted-foreground">Press the button to send an emergency alert</p>
      </div>

      <div className="flex flex-col items-center gap-8 py-8">
        {/* SOS Button */}
        {countdown !== null ? (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-48 w-48 items-center justify-center rounded-full border-4 border-emergency bg-emergency/10">
              <span className="text-6xl font-bold text-emergency">{countdown}</span>
            </div>
            <p className="text-sm text-muted-foreground">Emergency will be triggered in {countdown}s</p>
            <Button variant="outline" onClick={cancelSOS} className="gap-2">
              <X className="h-4 w-4" /> Cancel
            </Button>
          </div>
        ) : activeAlertId ? (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-48 w-48 animate-pulse-emergency items-center justify-center rounded-full bg-emergency">
              <Shield className="h-20 w-20 text-emergency-foreground" />
            </div>
            <p className="text-lg font-semibold text-emergency">Emergency Alert Active</p>
            <p className="text-sm text-muted-foreground">Help is on the way. Stay calm.</p>
            <Button variant="outline" onClick={cancelEmergency} className="gap-2 border-emergency text-emergency hover:bg-emergency/10">
              <X className="h-4 w-4" /> Cancel Emergency
            </Button>
          </div>
        ) : (
          <button
            onClick={startSOS}
            disabled={isTriggering}
            className="group flex h-48 w-48 items-center justify-center rounded-full bg-emergency text-emergency-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 disabled:opacity-50"
          >
            <div className="flex flex-col items-center gap-2">
              <AlertTriangle className="h-16 w-16" />
              <span className="text-lg font-bold">SOS</span>
            </div>
          </button>
        )}

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>

      {/* Quick Info Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-primary" /> Emergency Hotline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-foreground">911</p>
            <p className="text-xs text-muted-foreground">National emergency number</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-warning" /> Safety Tip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground">Stay in your vehicle if possible and turn on hazard lights.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverEmergency;
