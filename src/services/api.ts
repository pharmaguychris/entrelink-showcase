import { API_CONFIG, ERROR_MESSAGES } from './config';
import { ParsedResume } from './types';

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new ApiError(
      errorData?.message || `HTTP error! status: ${response.status}`,
      response.status,
      errorData
    );
  }

  const data = await response.json();
  return {
    data,
    status: response.status,
    message: data.message
  };
}

async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    return await handleResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      ERROR_MESSAGES.NETWORK_ERROR,
      undefined,
      error
    );
  }
}

export async function saveResume(data: ParsedResume): Promise<string> {
  try {
    const response = await apiRequest<{ id: string }>('http://localhost:3000/api/resumes', {
      method: 'POST',
      body: JSON.stringify({ data })
    });
    return response.data.id;
  } catch (error) {
    console.error('Error saving resume:', error);
    throw new ApiError(
      'Failed to save resume. Please try again.',
      undefined,
      error
    );
  }
}

export async function getResume(id: string): Promise<ParsedResume> {
  try {
    const response = await apiRequest<{ data: ParsedResume }>(`http://localhost:3000/api/resumes/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error retrieving resume:', error);
    throw new ApiError(
      'Failed to retrieve resume. Please try again.',
      undefined,
      error
    );
  }
}