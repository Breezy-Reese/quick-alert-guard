import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/common/EmptyState";
import { BookOpen, Download } from "lucide-react";

const AdminReports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground">Generate and export system reports</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Incident Summary", desc: "Overview of all incidents and outcomes" },
          { title: "Response Performance", desc: "Response times and efficiency metrics" },
          { title: "User Activity", desc: "User engagement and activity patterns" },
          { title: "System Uptime", desc: "Service availability and downtime logs" },
          { title: "Driver Safety", desc: "Driver safety scores and trip analytics" },
          { title: "Hospital Performance", desc: "Hospital response and capacity metrics" },
        ].map((report) => (
          <Card key={report.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{report.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-xs text-muted-foreground">{report.desc}</p>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-3 w-3" /> Export
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminReports;
