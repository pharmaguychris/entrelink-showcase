import { ApiError, ResumeParsingError } from './types';
import { ERROR_MESSAGES } from './config';

export function handleApiError(status: number, error: ApiError): ResumeParsingError {
  switch (status) {
    case 401:
    case 403:
      return new ResumeParsingError(ERROR_MESSAGES.AUTH_ERROR);
    case 408:
    case 504:
      return new ResumeParsingError(ERROR_MESSAGES.TIMEOUT_ERROR);
    case 429:
      return new ResumeParsingError('Too many requests. Please try again in a few minutes.');
    case 500:
    case 502:
    case 503:
      return new ResumeParsingError('Service temporarily unavailable. Please try again later.');
    default:
      return new ResumeParsingError(
        error?.message || ERROR_MESSAGES.NETWORK_ERROR,
        error
      );
  }
}