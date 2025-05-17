// Simple logging utility for the application
// This helps track errors and information across the application

type LogLevel = "info" | "warn" | "error"
type ComponentName = string

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  component: ComponentName
  data?: any
}

// Keep a small in-memory log for debugging
const logs: LogEntry[] = []
const MAX_LOGS = 100

// Log information message
export function logInfo(message: string, data = {}, component: ComponentName = "App") {
  logMessage("info", message, data, component)
}

// Log warning message
export function logWarn(message: string, data = {}, component: ComponentName = "App") {
  logMessage("warn", message, data, component)
}

// Log error message
export function logError(message: string, data = {}, component: ComponentName = "App") {
  logMessage("error", message, data, component)
}

// Internal logging function
function logMessage(level: LogLevel, message: string, data = {}, component: ComponentName) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    component,
    data,
  }

  // Add to in-memory logs
  logs.unshift(entry)

  // Keep logs under the maximum size
  if (logs.length > MAX_LOGS) {
    logs.pop()
  }

  // Log to console with appropriate styling
  const styles = {
    info: "color: #8ab4f8; font-weight: bold;",
    warn: "color: #fdd663; font-weight: bold;",
    error: "color: #f28b82; font-weight: bold;",
  }

  console.log(`%c[${level.toUpperCase()}]%c [${component}] ${message}`, styles[level], "color: inherit", data)
}

// Get all logs
export function getLogs() {
  return [...logs]
}

// Clear logs
export function clearLogs() {
  logs.length = 0
}
