import { ApiError, NetworkError } from "./error-types"
import { logException } from "./error-logger"

/**
 * Handle API errors in a consistent way
 * @param error The error object
 * @param component The component where the error occurred
 * @returns A user-friendly error message and the original error
 */
export const handleApiError = (error: any, component?: string): { message: string; error: Error } => {
  let errorMessage = "An unexpected error occurred. Please try again."
  let errorObject: Error

  // Network errors
  if (error.name === "TypeError" && error.message === "Failed to fetch") {
    errorMessage = "Unable to connect to the server. Please check your internet connection and try again."
    errorObject = new NetworkError(errorMessage, { originalError: error }, component)
  }
  // Response errors
  else if (error.status || error.statusCode) {
    const status = error.status || error.statusCode

    switch (status) {
      case 400:
        errorMessage = "The request was invalid. Please check your input and try again."
        break
      case 401:
        errorMessage = "You need to be logged in to perform this action."
        break
      case 403:
        errorMessage = "You do not have permission to perform this action."
        break
      case 404:
        errorMessage = "The requested resource was not found."
        break
      case 429:
        errorMessage = "Too many requests. Please try again later."
        break
      case 500:
      case 502:
      case 503:
      case 504:
        errorMessage = "The server encountered an error. Please try again later."
        break
      default:
        errorMessage = `Request failed with status ${status}. Please try again.`
    }

    errorObject = new ApiError(
      errorMessage,
      status,
      {
        originalError: error,
        responseBody: error.data || error.body || null,
      },
      component,
    )
  }
  // Other errors
  else {
    errorObject = new Error(error.message || errorMessage)
  }

  // Log the error
  logException(errorObject, component)

  return {
    message: errorMessage,
    error: errorObject,
  }
}

/**
 * Safely parse JSON from API responses
 * @param response The fetch response object
 * @returns The parsed JSON data
 */
export const safeJsonParse = async (response: Response): Promise<any> => {
  try {
    return await response.json()
  } catch (error) {
    throw new ApiError("Failed to parse API response", response.status, {
      url: response.url,
      statusText: response.statusText,
    })
  }
}

/**
 * Enhanced fetch function with error handling
 * @param url The URL to fetch
 * @param options Fetch options
 * @param component The component making the request
 * @returns The response data
 */
export const safeFetch = async (url: string, options: RequestInit = {}, component?: string): Promise<any> => {
  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      let errorData = {}

      try {
        errorData = await response.json()
      } catch (e) {
        // Ignore JSON parsing errors for error responses
      }

      throw new ApiError(
        `API request failed with status ${response.status}`,
        response.status,
        {
          url,
          method: options.method || "GET",
          errorData,
        },
        component,
      )
    }

    return await safeJsonParse(response)
  } catch (error) {
    const { message, error: handledError } = handleApiError(error, component)
    throw handledError
  }
}
