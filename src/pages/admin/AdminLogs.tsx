import React, { useEffect, useState } from "react";
import { adminService } from "@/services/api/admin.service";
import type { SystemLog } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/common/EmptyState";
import { FileText, Search } from "lucide-react";

const levelColor = (level: string) => {
  if (level === "error") return "bg-destructive/15 text-destructive border-destructive/30";
  if (level === "warn") return "bg-warning/15 text-warning border-warning/30";
  if (level === "info") return "bg-info/15 text-info border-info/30";
  return "bg-muted text-muted-foreground";
};

const AdminLogs: React.FC = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const params: any = { page: 1 };
        if (levelFilter !== "all") params.level = levelFilter;
        if (search) params.search = search;
        const res = await adminService.getLogs(params);
        setLogs(res.data.data);
      } catch {} finally { setIsLoading(false); }
    };
    fetch();
  }, [levelFilter, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">System Logs</h1>
        <p className="text-sm text-muted-foreground">View and search system events</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search logs..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Level" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warn">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="debug">Debug</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-2 p-6">{[1,2,3,4,5].map(i => <div key={i} className="h-10 animate-pulse rounded bg-muted" />)}</div>
          ) : logs.length > 0 ? (
            <div className="divide-y divide-border">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-4">
                  <Badge variant="outline" className={`mt-0.5 text-[10px] ${levelColor(log.level)}`}>{log.level.toUpperCase()}</Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{log.message}</p>
                    <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
                      <span>{log.source}</span>
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={FileText} title="No logs" description="System logs will appear here when backend is connected." />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogs;
