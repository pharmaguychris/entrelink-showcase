import { apiRequest } from './client';
import { ParsedResume, SaveResumeResponse, GetResumeResponse, ApiError } from './types';

export async function saveResume(data: ParsedResume): Promise<string> {
  try {
    const response = await apiRequest<SaveResumeResponse>('/resumes', {
      method: 'POST',
      body: JSON.stringify({ data })
    });
    return response.data.id;
  } catch (error) {
    throw ApiError.fromError(error);
  }
}

export async function getResume(id: string): Promise<ParsedResume> {
  try {
    const response = await apiRequest<GetResumeResponse>(`/resumes/${id}`);
    return response.data.data;
  } catch (error) {
    throw ApiError.fromError(error);
  }
}