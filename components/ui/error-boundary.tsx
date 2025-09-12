"use client"

import { Component, type ReactNode } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "./button"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4 max-w-md">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <Button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

export function ErrorMessage({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
      <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
      <p className="text-red-700 dark:text-red-300 mb-3">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="gap-2 bg-transparent">
          <RefreshCw className="w-4 h-4" />
          Retry
        </Button>
      )}
    </div>
  )
}
