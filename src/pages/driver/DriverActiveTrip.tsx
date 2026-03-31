import React, { useEffect, useState } from "react";
import { driverService } from "@/services/api/driver.service";
import type { Trip } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/common/EmptyState";
import { MapPin, Play, Square, RefreshCw } from "lucide-react";

const DriverActiveTrip: React.FC = () => {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchActiveTrip();
  }, []);

  const fetchActiveTrip = async () => {
    setIsLoading(true);
    try {
      const res = await driverService.getActiveTrip();
      setTrip(res.data.data ?? null);
      setError("");
    } catch {
      setTrip(null);
      setError("Unable to load active trip.");
    } finally {
      setIsLoading(false);
    }
  };

  const startTrip = async () => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
      }).catch(() => null);

      const location = position
        ? { lat: position.coords.latitude, lng: position.coords.longitude }
        : { lat: 0, lng: 0 };

      const res = await driverService.startTrip(location);

      const newTrip = res.data.data;
      if (!newTrip?.id) {
        setError("Failed to start trip: no trip ID returned.");
        return;
      }

      setTrip(newTrip);
      setError("");
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to start trip.";
      setError(message);
    }
  };

  const endTrip = async () => {
    if (!trip?.id) {
      setError("No active trip found. Try refreshing.");
      return;
    }
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
      }).catch(() => null);

      const location = position
        ? { lat: position.coords.latitude, lng: position.coords.longitude }
        : { lat: 0, lng: 0 };

      await driverService.endTrip(trip.id, location);
      setTrip(null);
      setError("");
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to end trip.";
      setError(message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Active Trip</h1>
          <p className="text-sm text-muted-foreground">Track your current journey</p>
        </div>
        <Button onClick={fetchActiveTrip} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {isLoading ? (
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      ) : trip ? (
        <div className="space-y-4">
          {/* Map placeholder */}
          <Card>
            <CardContent className="flex h-64 items-center justify-center bg-muted/50">
              <div className="text-center">
                <MapPin className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Map will display here when Google Maps API key is configured
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Trip Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium text-info">{trip.status}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Started</span>
                <span className="font-medium text-foreground">{new Date(trip.startTime).toLocaleTimeString()}</span>
              </div>
              {trip.distance && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Distance</span>
                  <span className="font-medium text-foreground">{trip.distance.toFixed(1)} km</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Button onClick={endTrip} variant="destructive" className="w-full gap-2">
            <Square className="h-4 w-4" /> End Trip
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <EmptyState
            icon={MapPin}
            title="No active trip"
            description="Start a new trip to enable safety monitoring and location tracking."
            action={
              <Button onClick={startTrip} className="gap-2">
                <Play className="h-4 w-4" /> Start Trip
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
};

export default DriverActiveTrip;
