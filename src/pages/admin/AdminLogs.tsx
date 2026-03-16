import React, { useEffect, useState } from "react";
import { adminService } from "@/services/api/admin.service";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/common/EmptyState";
import { FileText, Search } from "lucide-react";

// Matches backend audit log entry shape
interface AuditEntry {
  id: string;
  timestamp: number;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  target?: string;
  ipAddress?: string;
}

const roleColor = (role: string) => {
  if (role === "admin") return "bg-primary/15 text-primary border-primary/30";
  if (role === "hospital") return "bg-success/15 text-success border-success/30";
  if (role === "driver") return "bg-info/15 text-info border-info/30";
  return "bg-muted text-muted-foreground";
};

const AdminLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const params: any = { page: 1, limit: 50 };
        if (roleFilter !== "all") params.actorRole = roleFilter;
        if (search) params.action = search; // backend searches action/actorName/target
        // getAuditLog() already returns data.data — no extra unwrapping
        const result = await adminService.getAuditLog(params);
        setLogs(result ?? []);
      } catch (err) {
        console.error("Failed to load audit logs:", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [roleFilter, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">System Logs</h1>
        <p className="text-sm text-muted-foreground">View and search audit events</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by action, user or target..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="hospital">Hospital</SelectItem>
            <SelectItem value="driver">Driver</SelectItem>
            <SelectItem value="responder">Responder</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-2 p-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-muted" />
              ))}
            </div>
          ) : logs.length > 0 ? (
            <div className="divide-y divide-border">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-4">
                  <Badge
                    variant="outline"
                    className={`mt-0.5 shrink-0 text-[10px] ${roleColor(log.actorRole)}`}
                  >
                    {log.actorRole.toUpperCase()}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{log.action}</p>
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span>By: {log.actorName}</span>
                      {log.target && <span>Target: {log.target}</span>}
                      {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FileText}
              title="No logs found"
              description="Audit log entries will appear here as actions are performed."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogs;
