import axios, { AxiosError } from 'axios';

/**
 * Types of API errors that can occur
 */
export enum ErrorType {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NOT_FOUND = 'not_found',
  VALIDATION = 'validation',
  SERVER = 'server',
  UNKNOWN = 'unknown',
}

/**
 * Interface for structured error responses
 */
export interface ErrorResponse {
  type: ErrorType;
  message: string;
  statusCode?: number;
  details?: Record<string, any>;
}

/**
 * Maps HTTP status codes to error types
 * @param statusCode - HTTP status code
 * @returns Corresponding error type
 */
export const mapStatusToErrorType = (statusCode?: number): ErrorType => {
  if (!statusCode) return ErrorType.UNKNOWN;
  
  if (statusCode === 401) return ErrorType.AUTHENTICATION;
  if (statusCode === 403) return ErrorType.AUTHORIZATION;
  if (statusCode === 404) return ErrorType.NOT_FOUND;
  if (statusCode >= 400 && statusCode < 500) return ErrorType.VALIDATION;
  if (statusCode >= 500) return ErrorType.SERVER;
  
  return ErrorType.UNKNOWN;
};

/**
 * Processes an API error into a standardized format
 * @param error - Error from API call
 * @returns Standardized error response
 */
export const processApiError = (error: unknown): ErrorResponse => {
  // Handle Axios errors
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    // Network errors (no response from server)
    if (!axiosError.response) {
      return {
        type: ErrorType.NETWORK,
        message: 'Unable to connect to the server. Please check your internet connection.',
        details: { originalError: axiosError.message },
      };
    }
    
    // Server responded with an error status
    const statusCode = axiosError.response.status;
    const errorType = mapStatusToErrorType(statusCode);
    
    // Try to extract detailed error message from response
    let errorMessage = 'An error occurred while processing your request.';
    let errorDetails = {};
    
    if (axiosError.response.data) {
      if (typeof axiosError.response.data === 'string') {
        errorMessage = axiosError.response.data;
      } else if (axiosError.response.data.message) {
        errorMessage = axiosError.response.data.message;
        errorDetails = axiosError.response.data;
      } else if (axiosError.response.data.error) {
        errorMessage = axiosError.response.data.error;
        errorDetails = axiosError.response.data;
      }
    }
    
    return {
      type: errorType,
      message: errorMessage,
      statusCode,
      details: errorDetails,
    };
  }
  
  // Handle standard JavaScript errors
  if (error instanceof Error) {
    return {
      type: ErrorType.UNKNOWN,
      message: error.message || 'An unexpected error occurred',
      details: { stack: error.stack },
    };
  }
  
  // Handle unknown error types
  return {
    type: ErrorType.UNKNOWN,
    message: 'An unexpected error occurred',
    details: { originalError: String(error) },
  };
};

/**
 * Provides user-friendly error messages based on error type
 * @param error - Processed error response
 * @returns User-friendly error message
 */
export const getUserFriendlyErrorMessage = (error: ErrorResponse): string => {
  switch (error.type) {
    case ErrorType.NETWORK:
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    
    case ErrorType.AUTHENTICATION:
      return 'Your session has expired. Please log in again.';
    
    case ErrorType.AUTHORIZATION:
      return 'You do not have permission to perform this action.';
    
    case ErrorType.NOT_FOUND:
      return 'The requested resource could not be found.';
    
    case ErrorType.VALIDATION:
      return error.message || 'The provided information is invalid. Please check your inputs and try again.';
    
    case ErrorType.SERVER:
      return 'The server encountered an error. Please try again later.';
    
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
};

/**
 * Logs errors with appropriate detail level based on environment
 * @param error - Error to log
 * @param context - Additional context information
 */
export const logError = (error: unknown, context?: string): void => {
  const isProduction = process.env.NODE_ENV === 'production';
  const processedError = processApiError(error);
  
  if (isProduction) {
    // In production, log minimal information
    console.error(
      `Error${context ? ` in ${context}` : ''}:`,
      processedError.message,
      { 
        type: processedError.type, 
        statusCode: processedError.statusCode,
      }
    );
    
    // Here you would typically send to an error tracking service
    // like Sentry, LogRocket, etc.
    // trackError(processedError, context);
  } else {
    // In development, log full details
    console.error(
      `Error${context ? ` in ${context}` : ''}:`,
      processedError,
      { originalError: error }
    );
  }
};
