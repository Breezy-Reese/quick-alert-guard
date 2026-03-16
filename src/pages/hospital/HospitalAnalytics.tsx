import React, { useEffect, useState } from "react";
import { analyticsService } from "@/services/api/analytics.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyState from "@/components/common/EmptyState";
import { BarChart3, TrendingUp, Clock } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line
} from "recharts";

const HospitalAnalytics: React.FC = () => {
  const [responseData, setResponseData] = useState<any[]>([]);
  const [trendsData, setTrendsData]     = useState<any[]>([]);
  const [isLoading, setIsLoading]       = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [resTime, trends] = await Promise.all([
          analyticsService.getResponseTimes(),
          analyticsService.getIncidentTrends(),
        ]);

        const analyticsData  = resTime.data?.data;
        const trendsPayload  = trends.data?.data;

        // Map summary object → bar chart array
        if (analyticsData?.summary) {
          const { avgResponseTime, totalIncidents, resolvedIncidents, criticalIncidents } =
            analyticsData.summary;
          setResponseData([
            { name: "Avg Response (min)", time: avgResponseTime   ?? 0 },
            { name: "Total Incidents",    time: totalIncidents    ?? 0 },
            { name: "Resolved",           time: resolvedIncidents ?? 0 },
            { name: "Critical",           time: criticalIncidents ?? 0 },
          ]);
        }

        // incidentsByDay: [{ date, count }] → line chart expects { date, incidents }
        if (Array.isArray(trendsPayload?.incidentsByDay) && trendsPayload.incidentsByDay.length > 0) {
          setTrendsData(
            trendsPayload.incidentsByDay.map((d: any) => ({
              date:      d.date,
              incidents: d.count ?? 0,
            }))
          );
        }
      } catch (e) {
        console.error("Analytics load error:", e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">Response times and incident trends</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Response Times Bar Chart */}
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
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="time" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState
                icon={BarChart3}
                title="No data"
                description="Response time data will appear here once incidents are recorded."
              />
            )}
          </CardContent>
        </Card>

        {/* Incident Trends Line Chart */}
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
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="incidents"
                    stroke="hsl(var(--chart-4))"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState
                icon={TrendingUp}
                title="No data"
                description="Incident trend data will appear here once incidents are recorded."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HospitalAnalytics;
