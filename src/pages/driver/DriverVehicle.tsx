import React, { useEffect, useState } from "react";
import { driverService } from "@/services/api/driver.service";
import type { Vehicle } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EmptyState from "@/components/common/EmptyState";
import { Car, Save } from "lucide-react";

const DriverVehicle: React.FC = () => {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({ make: "", model: "", year: "", plateNumber: "", color: "" });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await driverService.getVehicle();
        const v = res.data.data;
        setVehicle(v);
        setForm({ make: v.make, model: v.model, year: String(v.year), plateNumber: v.plateNumber, color: v.color });
      } catch {
        // No vehicle yet
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await driverService.updateVehicle({ ...form, year: Number(form.year) } as any);
    } catch {
      // handle error
    }
  };

  if (isLoading) return <div className="h-64 animate-pulse rounded-lg bg-muted" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Vehicle Information</h1>
        <p className="text-sm text-muted-foreground">Manage your vehicle details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Car className="h-4 w-4 text-primary" /> Vehicle Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Make</Label>
                <Input value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} placeholder="Toyota" />
              </div>
              <div className="space-y-2">
                <Label>Model</Label>
                <Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="Camry" />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2024" type="number" />
              </div>
              <div className="space-y-2">
                <Label>Plate Number</Label>
                <Input value={form.plateNumber} onChange={(e) => setForm({ ...form, plateNumber: e.target.value })} placeholder="ABC-1234" />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <Input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="Silver" />
              </div>
            </div>
            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" /> Save Vehicle Info
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverVehicle;
