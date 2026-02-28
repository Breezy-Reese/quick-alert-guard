import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings, Bell, Save } from "lucide-react";

const HospitalSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Hospital Settings</h1>
        <p className="text-sm text-muted-foreground">Configure hospital profile and notifications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings className="h-4 w-4 text-primary" /> Hospital Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Hospital Name</Label><Input placeholder="General Hospital" /></div>
              <div className="space-y-2"><Label>Address</Label><Input placeholder="123 Main St" /></div>
              <div className="space-y-2"><Label>Contact Phone</Label><Input placeholder="+1 234 567 8900" /></div>
              <div className="space-y-2"><Label>Capacity</Label><Input type="number" placeholder="100" /></div>
            </div>
            <Button className="gap-2"><Save className="h-4 w-4" /> Save</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4 text-primary" /> Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between"><Label>New Incident Alerts</Label><Switch defaultChecked /></div>
          <div className="flex items-center justify-between"><Label>Ambulance Status Changes</Label><Switch defaultChecked /></div>
          <div className="flex items-center justify-between"><Label>System Notifications</Label><Switch /></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HospitalSettings;
