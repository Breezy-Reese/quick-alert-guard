import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number | null;
  icon: LucideIcon;
  description?: string;
  trend?: { value: number; label: string };
  variant?: "default" | "emergency" | "warning" | "success" | "info";
  isLoading?: boolean;
}

const variantStyles = {
  default: "bg-card",
  emergency: "bg-emergency/10 border-emergency/20",
  warning: "bg-warning/10 border-warning/20",
  success: "bg-success/10 border-success/20",
  info: "bg-info/10 border-info/20",
};

const iconVariantStyles = {
  default: "text-primary",
  emergency: "text-emergency",
  warning: "text-warning",
  success: "text-success",
  info: "text-info",
};

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, description, variant = "default", isLoading }) => {
  return (
    <Card className={cn("transition-all hover:shadow-md", variantStyles[variant])}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={cn("h-4 w-4", iconVariantStyles[variant])} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-8 w-20 animate-pulse rounded bg-muted" />
        ) : (
          <div className="text-2xl font-bold text-foreground">{value ?? "—"}</div>
        )}
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
