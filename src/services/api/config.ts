export const API_CONFIG = {
  ANTHROPIC_API_URL: 'https://api.anthropic.com/v1/messages',
  ANTHROPIC_API_KEY: import.meta.env.VITE_ANTHROPIC_API_KEY,
  ANTHROPIC_VERSION: '2024-01-01',
  MODEL: 'claude-3-opus-20240229',
  MAX_TOKENS: 4096,
  TEMPERATURE: 0.7,
  REQUEST_TIMEOUT: 30000,
  MAX_RETRIES: 3,
  BASE_RETRY_DELAY: 1000,
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the service. Please check your internet connection.',
  TIMEOUT_ERROR: 'The request took too long to complete. Please try again.',
  AUTH_ERROR: 'Unable to authenticate with the service. Please try again later.',
  PARSE_ERROR: 'Unable to process the resume. Please ensure it\'s properly formatted.',
  INVALID_RESPONSE: 'Received an invalid response from the service.',
  MISSING_API_KEY: 'Service configuration is incomplete. Please try again later.',
  FILE_ERROR: 'Unable to read the file. Please ensure it\'s a valid Word document.',
};