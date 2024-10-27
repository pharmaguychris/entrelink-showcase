export const API_CONFIG = {
  OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
  MODEL: 'gpt-3.5-turbo',  // Updated to use GPT-3.5-turbo
  MAX_TOKENS: 4096,
  TEMPERATURE: 0.7,
  REQUEST_TIMEOUT: 60000,
  MAX_RETRIES: 3,
  BASE_RETRY_DELAY: 1000,
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the service. Please check your internet connection and try again.',
  TIMEOUT_ERROR: 'The request took too long to complete. Please try again.',
  AUTH_ERROR: 'Unable to authenticate with OpenAI. Please check your API key configuration.',
  PARSE_ERROR: 'Unable to process the resume. Please ensure it\'s properly formatted and try again.',
  INVALID_RESPONSE: 'Received an invalid response from OpenAI. Please try again.',
  MISSING_API_KEY: 'OpenAI API key is missing. Please check your configuration.',
  FILE_ERROR: 'Unable to read the file. Please ensure it\'s a valid Word document.',
  EMPTY_FILE: 'The uploaded file appears to be empty. Please check the file and try again.',
  INVALID_FORMAT: 'Please upload a valid Word document (.docx).',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit of 5MB.',
  MODEL_ERROR: 'There was an issue with the AI service. Please try again.',
};