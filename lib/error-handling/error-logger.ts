import { AppError, LogLevel } from "./error-types"

// Interface for log entries
export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: number
  code?: string
  component?: string
  context?: Record<string, any>
  stack?: string
}

// Storage options
export enum LogStorage {
  LOCAL_STORAGE = "localStorage",
  SESSION_STORAGE = "sessionStorage",
  MEMORY = "memory",
  CONSOLE = "console",
}

// Logger configuration
export interface LoggerConfig {
  storageType: LogStorage[]
  maxEntries?: number
  minLevel?: LogLevel
  applicationName?: string
  version?: string
}

// Default configuration
const DEFAULT_CONFIG: LoggerConfig = {
  storageType: [LogStorage.CONSOLE, LogStorage.LOCAL_STORAGE],
  maxEntries: 100,
  minLevel: LogLevel.INFO,
  applicationName: "ProductSearch",
  version: "1.0.0",
}

/**
 * ErrorLogger class for handling error logging across the application
 */
export class ErrorLogger {
  private static instance: ErrorLogger
  private config: LoggerConfig
  private memoryLogs: LogEntry[] = []
  private storageKey = "product-search-error-logs"

  private constructor(config: LoggerConfig = DEFAULT_CONFIG) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.initializeStorage()
  }

  /**
   * Get the singleton instance of ErrorLogger
   */
  public static getInstance(config?: LoggerConfig): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger(config)
    }
    return ErrorLogger.instance
  }

  /**
   * Initialize storage based on configuration
   */
  private initializeStorage(): void {
    if (this.config.storageType.includes(LogStorage.LOCAL_STORAGE) && typeof window !== "undefined") {
      try {
        if (!localStorage.getItem(this.storageKey)) {
          localStorage.setItem(this.storageKey, JSON.stringify([]))
        }
      } catch (e) {
        console.warn("Local storage is not available. Falling back to memory storage.")
        if (!this.config.storageType.includes(LogStorage.MEMORY)) {
          this.config.storageType.push(LogStorage.MEMORY)
        }
      }
    }

    if (this.config.storageType.includes(LogStorage.SESSION_STORAGE) && typeof window !== "undefined") {
      try {
        if (!sessionStorage.getItem(this.storageKey)) {
          sessionStorage.setItem(this.storageKey, JSON.stringify([]))
        }
      } catch (e) {
        console.warn("Session storage is not available. Falling back to memory storage.")
        if (!this.config.storageType.includes(LogStorage.MEMORY)) {
          this.config.storageType.push(LogStorage.MEMORY)
        }
      }
    }
  }

  /**
   * Log an error
   */
  public log(level: LogLevel, message: string, context?: Record<string, any>, component?: string): void {
    // Skip if below minimum log level
    if (this.getLogLevelValue(level) < this.getLogLevelValue(this.config.minLevel!)) {
      return
    }

    const logEntry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      component,
      context,
    }

    // Store in memory if configured
    if (this.config.storageType.includes(LogStorage.MEMORY)) {
      this.memoryLogs.push(logEntry)

      // Trim if exceeds max entries
      if (this.memoryLogs.length > this.config.maxEntries!) {
        this.memoryLogs.shift()
      }
    }

    // Store in localStorage if configured
    if (this.config.storageType.includes(LogStorage.LOCAL_STORAGE) && typeof window !== "undefined") {
      try {
        const logs = JSON.parse(localStorage.getItem(this.storageKey) || "[]")
        logs.push(logEntry)

        // Trim if exceeds max entries
        while (logs.length > this.config.maxEntries!) {
          logs.shift()
        }

        localStorage.setItem(this.storageKey, JSON.stringify(logs))
      } catch (e) {
        console.error("Failed to write to localStorage", e)
      }
    }

    // Store in sessionStorage if configured
    if (this.config.storageType.includes(LogStorage.SESSION_STORAGE) && typeof window !== "undefined") {
      try {
        const logs = JSON.parse(sessionStorage.getItem(this.storageKey) || "[]")
        logs.push(logEntry)

        // Trim if exceeds max entries
        while (logs.length > this.config.maxEntries!) {
          logs.shift()
        }

        sessionStorage.setItem(this.storageKey, JSON.stringify(logs))
      } catch (e) {
        console.error("Failed to write to sessionStorage", e)
      }
    }

    // Log to console if configured
    if (this.config.storageType.includes(LogStorage.CONSOLE)) {
      const consoleMethod = this.getConsoleMethod(level)
      consoleMethod(
        `[${this.config.applicationName}] [${level}] ${component ? `[${component}] ` : ""}${message}`,
        context || "",
      )
    }
  }

  /**
   * Log an error object
   */
  public logError(error: Error | AppError, level: LogLevel = LogLevel.ERROR): void {
    const appError = error instanceof AppError ? error : new AppError(error.message, "UNKNOWN_ERROR", {}, "unknown")

    this.log(
      level,
      appError.message,
      {
        ...appError.context,
        code: appError.code,
        stack: appError.stack,
      },
      appError.component,
    )
  }

  /**
   * Get all logs from storage
   */
  public getLogs(storage: LogStorage = LogStorage.MEMORY): LogEntry[] {
    switch (storage) {
      case LogStorage.MEMORY:
        return [...this.memoryLogs]
      case LogStorage.LOCAL_STORAGE:
        if (typeof window !== "undefined") {
          try {
            return JSON.parse(localStorage.getItem(this.storageKey) || "[]")
          } catch (e) {
            console.error("Failed to read from localStorage", e)
            return []
          }
        }
        return []
      case LogStorage.SESSION_STORAGE:
        if (typeof window !== "undefined") {
          try {
            return JSON.parse(sessionStorage.getItem(this.storageKey) || "[]")
          } catch (e) {
            console.error("Failed to read from sessionStorage", e)
            return []
          }
        }
        return []
      default:
        return []
    }
  }

  /**
   * Clear logs from storage
   */
  public clearLogs(storage: LogStorage = LogStorage.MEMORY): void {
    switch (storage) {
      case LogStorage.MEMORY:
        this.memoryLogs = []
        break
      case LogStorage.LOCAL_STORAGE:
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(this.storageKey, JSON.stringify([]))
          } catch (e) {
            console.error("Failed to clear localStorage", e)
          }
        }
        break
      case LogStorage.SESSION_STORAGE:
        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem(this.storageKey, JSON.stringify([]))
          } catch (e) {
            console.error("Failed to clear sessionStorage", e)
          }
        }
        break
      default:
        break
    }
  }

  /**
   * Helper to get console method based on log level
   */
  private getConsoleMethod(level: LogLevel): (message: string, ...optionalParams: any[]) => void {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug
      case LogLevel.INFO:
        return console.info
      case LogLevel.WARN:
        return console.warn
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        return console.error
      default:
        return console.log
    }
  }

  /**
   * Helper to get numeric value for log level comparison
   */
  private getLogLevelValue(level: LogLevel): number {
    switch (level) {
      case LogLevel.DEBUG:
        return 0
      case LogLevel.INFO:
        return 1
      case LogLevel.WARN:
        return 2
      case LogLevel.ERROR:
        return 3
      case LogLevel.CRITICAL:
        return 4
      default:
        return -1
    }
  }
}

// Convenience functions
export const logger = ErrorLogger.getInstance()

export const logDebug = (message: string, context?: Record<string, any>, component?: string): void => {
  logger.log(LogLevel.DEBUG, message, context, component)
}

export const logInfo = (message: string, context?: Record<string, any>, component?: string): void => {
  logger.log(LogLevel.INFO, message, context, component)
}

export const logWarn = (message: string, context?: Record<string, any>, component?: string): void => {
  logger.log(LogLevel.WARN, message, context, component)
}

export const logError = (message: string, context?: Record<string, any>, component?: string): void => {
  logger.log(LogLevel.ERROR, message, context, component)
}

export const logCritical = (message: string, context?: Record<string, any>, component?: string): void => {
  logger.log(LogLevel.CRITICAL, message, context, component)
}

export const logException = (error: Error | AppError, component?: string): void => {
  if (error instanceof AppError) {
    logger.logError(error)
  } else {
    const appError = new AppError(error.message, "UNCAUGHT_ERROR", { originalStack: error.stack }, component)
    logger.logError(appError)
  }
}
