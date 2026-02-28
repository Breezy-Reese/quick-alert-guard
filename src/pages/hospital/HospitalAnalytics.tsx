import React, { useEffect, useState } from "react";
import { analyticsService } from "@/services/api/analytics.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyState from "@/components/common/EmptyState";
import { BarChart3, TrendingUp, Clock, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const HospitalAnalytics: React.FC = () => {
  const [responseData, setResponseData] = useState<any[]>([]);
  const [trendsData, setTrendsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [resTime, trends] = await Promise.all([
          analyticsService.getResponseTimes(),
          analyticsService.getIncidentTrends(),
        ]);
        setResponseData(resTime.data.data || []);
        setTrendsData(trends.data.data || []);
      } catch {
        // backend not connected
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">Response times and incident trends</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-primary" /> Response Times
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-64 animate-pulse rounded bg-muted" />
            ) : responseData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={responseData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="time" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState icon={BarChart3} title="No data" description="Response time data will appear here when backend is connected." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" /> Incident Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-64 animate-pulse rounded bg-muted" />
            ) : trendsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Line type="monotone" dataKey="incidents" stroke="hsl(var(--chart-4))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState icon={TrendingUp} title="No data" description="Incident trend data will appear here when backend is connected." />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HospitalAnalytics;
