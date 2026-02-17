type LogLevel = "debug" | "info" | "warn" | "error"

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: any
}

class Logger {
  private logs: LogEntry[] = []
  private maxLogs = 1000

  private formatTime(): string {
    return new Date().toISOString()
  }

  private addLog(level: LogLevel, message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: this.formatTime(),
      level,
      message,
      data,
    }

    this.logs.push(entry)

    // Keep logs size manageable
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Console output based on level
    const consoleMethod = level === "error" ? "error" : level === "warn" ? "warn" : "log"
    console[consoleMethod as "log" | "error" | "warn"](`[${level.toUpperCase()}] ${message}`, data || "")
  }

  debug(message: string, data?: any) {
    this.addLog("debug", message, data)
  }

  info(message: string, data?: any) {
    this.addLog("info", message, data)
  }

  warn(message: string, data?: any) {
    this.addLog("warn", message, data)
  }

  error(message: string, data?: any) {
    this.addLog("error", message, data)
  }

  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  clearLogs() {
    this.logs = []
  }
}

export const logger = new Logger()
