// Base application error
export class AppError extends Error {
  code: string
  context: Record<string, any>
  timestamp: number
  component?: string

  constructor(message: string, code: string, context: Record<string, any> = {}, component?: string) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.context = context
    this.timestamp = Date.now()
    this.component = component

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

// Network related errors
export class NetworkError extends AppError {
  constructor(message: string, context: Record<string, any> = {}, component?: string) {
    super(message, "NETWORK_ERROR", context, component)
  }
}

// API related errors
export class ApiError extends AppError {
  status?: number

  constructor(message: string, status?: number, context: Record<string, any> = {}, component?: string) {
    super(message, "API_ERROR", context, component)
    this.status = status
  }
}

// Data validation errors
export class ValidationError extends AppError {
  field?: string

  constructor(message: string, field?: string, context: Record<string, any> = {}, component?: string) {
    super(message, "VALIDATION_ERROR", context, component)
    this.field = field
  }
}

// Define log levels
export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  CRITICAL = "critical",
}
