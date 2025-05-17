"use client"

import { useState, useCallback } from "react"
import { logError } from "@/lib/error-handling/error-logger"

interface ErrorState {
  hasError: boolean
  message: string
  details?: any
  timestamp?: Date
}

interface ErrorHandlerOptions {
  component?: string
  onError?: (error: Error, message: string) => void
}

export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const [error, setError] = useState<ErrorState>({
    hasError: false,
    message: "",
  })

  const handleError = useCallback(
    (err: Error | string, userMessage?: string) => {
      const errorObj = typeof err === "string" ? new Error(err) : err
      const displayMessage = userMessage || errorObj.message || "An unexpected error occurred"

      // Log the error
      logError(
        displayMessage,
        {
          originalError: errorObj,
          stack: errorObj.stack,
        },
        options.component || "App",
      )

      // Update error state
      setError({
        hasError: true,
        message: displayMessage,
        details: errorObj,
        timestamp: new Date(),
      })

      // Call optional onError callback
      if (options.onError) {
        options.onError(errorObj, displayMessage)
      }

      return errorObj
    },
    [options],
  )

  const clearError = useCallback(() => {
    setError({
      hasError: false,
      message: "",
    })
  }, [])

  return {
    error,
    handleError,
    clearError,
  }
}
