import { logError, logInfo } from "./error-logger"

// Enhanced fetch function with error handling and logging
export async function safeFetch(url: string, options: RequestInit = {}, component = "API"): Promise<any> {
  try {
    logInfo(`Fetching ${url}`, { method: options.method || "GET" }, component)

    const response = await fetch(url, options)

    // Handle non-OK responses
    if (!response.ok) {
      const errorText = await response.text().catch(() => "Could not read error response")
      const error = new Error(`HTTP error ${response.status}: ${errorText}`)

      // Add response details to the error
      Object.assign(error, {
        status: response.status,
        statusText: response.statusText,
        url,
      })

      throw error
    }

    // Parse JSON response
    try {
      const data = await response.json()
      return data
    } catch (parseError) {
      logError(`Failed to parse JSON response from ${url}`, { parseError }, component)
      throw new Error(`Invalid JSON response: ${parseError.message}`)
    }
  } catch (error) {
    // Log the error with details
    logError(
      `API request failed: ${error.message}`,
      {
        url,
        method: options.method || "GET",
        status: error.status,
        stack: error.stack,
      },
      component,
    )

    // Return a standardized error response
    return {
      success: false,
      error: error.message || "Unknown error occurred",
      status: error.status || 500,
    }
  }
}
