"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, AlertTriangle, Info, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertNotificationProps {
  id: string
  type: "info" | "warning" | "error" | "success"
  title: string
  message: string
  timestamp?: Date
  fieldName?: string
  autoClose?: boolean
  autoCloseDelay?: number
  onClose?: (id: string) => void
  className?: string
}

export function AlertNotification({
  id,
  type,
  title,
  message,
  timestamp,
  fieldName,
  autoClose = false,
  autoCloseDelay = 5000,
  onClose,
  className,
}: AlertNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)

    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose()
      }, autoCloseDelay)

      return () => clearTimeout(timer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoClose, autoCloseDelay])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      setIsVisible(false)
      onClose?.(id)
    }, 200)
  }

  const typeConfig = {
    info: {
      icon: Info,
      className: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    },
    warning: {
      icon: AlertTriangle,
      className:
        "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    },
    error: {
      icon: AlertCircle,
      className: "border-destructive/20 bg-destructive/5 text-destructive",
    },
    success: {
      icon: CheckCircle,
      className: "border-primary/20 bg-primary/5 text-primary",
    },
  }

  const config = typeConfig[type]
  const Icon = config.icon

  if (!isVisible) return null

  return (
    <Alert
      className={cn(
        "transition-all duration-200 transform",
        isAnimating ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
        config.className,
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm">{title}</h4>
            {fieldName && (
              <Badge variant="outline" className="text-xs">
                {fieldName}
              </Badge>
            )}
          </div>
          <AlertDescription className="text-sm">{message}</AlertDescription>
          {timestamp && <p className="text-xs text-muted-foreground mt-1">{timestamp.toLocaleTimeString()}</p>}
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={handleClose}>
          <X className="h-3 w-3" />
        </Button>
      </div>
    </Alert>
  )
}

// Notification container component
interface NotificationContainerProps {
  notifications: AlertNotificationProps[]
  onRemove: (id: string) => void
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left"
  className?: string
}

export function NotificationContainer({
  notifications,
  onRemove,
  position = "top-right",
  className,
}: NotificationContainerProps) {
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  }

  return (
    <div className={cn("fixed z-50 flex flex-col gap-2 w-80 max-w-sm", positionClasses[position], className)}>
      {notifications.map((notification) => (
        <AlertNotification key={notification.id} {...notification} onClose={onRemove} />
      ))}
    </div>
  )
}
