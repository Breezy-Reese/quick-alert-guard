import React from "react";
import { Badge } from "@/components/ui/badge";
import type { IncidentStatus, IncidentSeverity, AmbulanceStatus } from "@/types";
import { cn } from "@/lib/utils";

// Covers both frontend enum values (en_route) and backend hyphenated values (en-route)
const incidentStatusConfig: Record<string, { label: string; className: string }> = {
  detected:    { label: "Detected",    className: "bg-warning/15 text-warning border-warning/30" },
  confirmed:   { label: "Confirmed",   className: "bg-emergency/15 text-emergency border-emergency/30" },
  dispatched:  { label: "Dispatched",  className: "bg-info/15 text-info border-info/30" },
  en_route:    { label: "En Route",    className: "bg-info/15 text-info border-info/30" },
  "en-route":  { label: "En Route",    className: "bg-info/15 text-info border-info/30" },
  on_scene:    { label: "On Scene",    className: "bg-primary/15 text-primary border-primary/30" },
  "on-scene":  { label: "On Scene",    className: "bg-primary/15 text-primary border-primary/30" },
  arrived:     { label: "Arrived",     className: "bg-primary/15 text-primary border-primary/30" },
  treating:    { label: "Treating",    className: "bg-primary/15 text-primary border-primary/30" },
  resolved:    { label: "Resolved",    className: "bg-success/15 text-success border-success/30" },
  false_alarm: { label: "False Alarm", className: "bg-muted text-muted-foreground border-border" },
  cancelled:   { label: "Cancelled",   className: "bg-muted text-muted-foreground border-border" },
};

const severityConfig: Record<string, { label: string; className: string }> = {
  low:      { label: "Low",      className: "bg-success/15 text-success border-success/30" },
  medium:   { label: "Medium",   className: "bg-warning/15 text-warning border-warning/30" },
  high:     { label: "High",     className: "bg-emergency/15 text-emergency border-emergency/30" },
  critical: { label: "Critical", className: "bg-emergency text-emergency-foreground border-emergency" },
  fatal:    { label: "Fatal",    className: "bg-emergency text-emergency-foreground border-emergency" },
};

const ambulanceStatusConfig: Record<string, { label: string; className: string }> = {
  available:      { label: "Available",      className: "bg-success/15 text-success border-success/30" },
  dispatched:     { label: "Dispatched",     className: "bg-info/15 text-info border-info/30" },
  en_route:       { label: "En Route",       className: "bg-info/15 text-info border-info/30" },
  "en-route":     { label: "En Route",       className: "bg-info/15 text-info border-info/30" },
  on_scene:       { label: "On Scene",       className: "bg-primary/15 text-primary border-primary/30" },
  "on-scene":     { label: "On Scene",       className: "bg-primary/15 text-primary border-primary/30" },
  returning:      { label: "Returning",      className: "bg-warning/15 text-warning border-warning/30" },
  out_of_service: { label: "Out of Service", className: "bg-muted text-muted-foreground border-border" },
};

const fallback = { label: "Unknown", className: "bg-muted text-muted-foreground border-border" };

export const IncidentStatusBadge: React.FC<{ status: IncidentStatus | string }> = ({ status }) => {
  const config = incidentStatusConfig[status] ?? fallback;
  return <Badge variant="outline" className={cn("text-xs", config.className)}>{config.label}</Badge>;
};

export const SeverityBadge: React.FC<{ severity: IncidentSeverity | string }> = ({ severity }) => {
  const config = severityConfig[severity] ?? fallback;
  return <Badge variant="outline" className={cn("text-xs", config.className)}>{config.label}</Badge>;
};

export const AmbulanceStatusBadge: React.FC<{ status: AmbulanceStatus | string }> = ({ status }) => {
  const config = ambulanceStatusConfig[status] ?? fallback;
  return <Badge variant="outline" className={cn("text-xs", config.className)}>{config.label}</Badge>;
};
