"use client"

import { useState, useCallback } from "react"
import { AppError } from "@/lib/error-handling/error-types"
import { logException } from "@/lib/error-handling/error-logger"

interface ErrorState {
  hasError: boolean
  message: string
  code?: string
  details?: Record<string, any>
}

interface ErrorHandlerOptions {
  logErrors?: boolean
  component?: string
}

/**
 * Hook for handling errors in React components
 */
export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const { logErrors = true, component } = options
  const [error, setError] = useState<ErrorState>({
    hasError: false,
    message: "",
  })

  /**
   * Handle an error and update the error state
   */
  const handleError = useCallback(
    (err: unknown, customMessage?: string) => {
      let errorMessage = customMessage || "An unexpected error occurred"
      let errorCode: string | undefined
      let errorDetails: Record<string, any> | undefined

      if (err instanceof AppError) {
        errorMessage = err.message
        errorCode = err.code
        errorDetails = err.context

        if (logErrors) {
          logException(err, component)
        }
      } else if (err instanceof Error) {
        errorMessage = err.message

        if (logErrors) {
          logException(err, component)
        }
      } else if (typeof err === "string") {
        errorMessage = err

        if (logErrors) {
          logException(new Error(err), component)
        }
      } else {
        if (logErrors) {
          logException(new Error(errorMessage), component)
        }
      }

      setError({
        hasError: true,
        message: errorMessage,
        code: errorCode,
        details: errorDetails,
      })

      return errorMessage
    },
    [logErrors, component],
  )

  /**
   * Clear the current error
   */
  const clearError = useCallback(() => {
    setError({
      hasError: false,
      message: "",
    })
  }, [])

  /**
   * Wrap an async function with error handling
   */
  const withErrorHandling = useCallback(
    <T extends any[], R>(fn: (...args: T) => Promise<R>, customMessage?: string) => {
      return async (...args: T): Promise<R | undefined> => {
        try {
          clearError()
          return await fn(...args)
        } catch (err) {
          handleError(err, customMessage)
          return undefined
        }
      }
    },
    [handleError, clearError],
  )

  return {
    error,
    handleError,
    clearError,
    withErrorHandling,
  }
}
