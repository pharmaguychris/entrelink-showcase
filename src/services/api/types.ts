export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface ParsedResume {
  basics: {
    name: string;
    title: string;
    summary: string;
    email?: string;
    phone?: string;
    location?: string;
  };
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    highlights: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    graduationDate: string;
  }>;
  skills: string[];
}

export class ResumeParsingError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'ResumeParsingError';
  }
}