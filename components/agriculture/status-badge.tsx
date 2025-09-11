import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "healthy" | "warning" | "critical" | "offline"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function StatusBadge({ status, size = "md", className }: StatusBadgeProps) {
  const statusConfig = {
    healthy: {
      label: "Healthy",
      className: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20",
    },
    warning: {
      label: "Warning",
      className:
        "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    },
    critical: {
      label: "Critical",
      className: "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20",
    },
    offline: {
      label: "Offline",
      className: "bg-muted text-muted-foreground border-border hover:bg-muted/80",
    },
  }

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  }

  const config = statusConfig[status]

  return (
    <Badge
      variant="outline"
      className={cn("transition-colors font-medium", config.className, sizeClasses[size], className)}
    >
      <div
        className={cn(
          "w-2 h-2 rounded-full mr-1.5",
          status === "healthy" && "bg-primary",
          status === "warning" && "bg-yellow-500",
          status === "critical" && "bg-destructive",
          status === "offline" && "bg-muted-foreground",
        )}
      />
      {config.label}
    </Badge>
  )
}
