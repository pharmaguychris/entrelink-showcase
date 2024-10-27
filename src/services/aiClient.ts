import { API_CONFIG, ERROR_MESSAGES } from './config';
import { ParsedResume, ResumeParsingError } from './types';

async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = API_CONFIG.MAX_RETRIES,
  baseDelay: number = API_CONFIG.BASE_RETRY_DELAY
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(ERROR_MESSAGES.TIMEOUT_ERROR)), API_CONFIG.REQUEST_TIMEOUT);
      });

      return await Promise.race([operation(), timeoutPromise]) as T;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`Attempt ${attempt + 1} failed:`, lastError.message);
      
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
    }
  }

  throw lastError || new Error(ERROR_MESSAGES.NETWORK_ERROR);
}

export async function parseWithAI(text: string): Promise<ParsedResume> {
  if (!text?.trim()) {
    throw new ResumeParsingError('No text provided for processing');
  }

  if (!API_CONFIG.ANTHROPIC_API_KEY) {
    throw new ResumeParsingError(ERROR_MESSAGES.MISSING_API_KEY);
  }

  try {
    const response = await retryWithBackoff(async () => {
      const result = await fetch(API_CONFIG.ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_CONFIG.ANTHROPIC_API_KEY,
          'anthropic-version': API_CONFIG.ANTHROPIC_VERSION
        },
        body: JSON.stringify({
          model: API_CONFIG.MODEL,
          max_tokens: API_CONFIG.MAX_TOKENS,
          temperature: API_CONFIG.TEMPERATURE,
          messages: [{
            role: 'user',
            content: `Extract structured information from this resume and return it as a JSON object. Follow these requirements exactly:

            1. The output must match this TypeScript interface:
            {
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

            2. Extract information exactly as written in the resume
            3. Use consistent date formats (YYYY-MM)
            4. Create a professional summary if none exists
            5. Return ONLY valid JSON, no other text
            6. Ensure all required fields are present
            7. Use empty arrays for missing sections
            8. Handle incomplete or missing dates gracefully

            Resume text:
            ${text}`
          }]
        })
      });

      if (!result.ok) {
        const errorData = await result.json().catch(() => null);
        throw new ResumeParsingError(
          errorData?.error?.message || `HTTP error! status: ${result.status}`,
          result.status
        );
      }

      return result.json();
    });

    if (!response?.content?.[0]?.text) {
      throw new ResumeParsingError(ERROR_MESSAGES.INVALID_RESPONSE);
    }

    let parsedData: unknown;
    try {
      parsedData = JSON.parse(response.content[0].text);
    } catch (error) {
      throw new ResumeParsingError(ERROR_MESSAGES.PARSE_ERROR);
    }

    validateParsedResume(parsedData);
    return parsedData;
  } catch (error) {
    if (error instanceof ResumeParsingError) {
      throw error;
    }
    throw new ResumeParsingError(
      error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR,
      error
    );
  }
}

function validateParsedResume(data: unknown): asserts data is ParsedResume {
  if (!data || typeof data !== 'object') {
    throw new ResumeParsingError('Invalid resume data structure');
  }

  const resume = data as Partial<ParsedResume>;

  if (!resume.basics || typeof resume.basics !== 'object') {
    throw new ResumeParsingError('Missing or invalid basics section');
  }

  const { basics } = resume;
  if (!basics.name || !basics.title || !basics.summary) {
    throw new ResumeParsingError('Missing required basic information');
  }

  if (!Array.isArray(resume.experience)) {
    throw new ResumeParsingError('Invalid experience section');
  }

  if (!Array.isArray(resume.education)) {
    throw new ResumeParsingError('Invalid education section');
  }

  if (!Array.isArray(resume.skills)) {
    throw new ResumeParsingError('Invalid skills section');
  }

  // Validate experience entries
  resume.experience.forEach((exp, index) => {
    if (!exp.company || !exp.position) {
      throw new ResumeParsingError(`Invalid experience entry at position ${index + 1}`);
    }
    if (!Array.isArray(exp.highlights)) {
      throw new ResumeParsingError(`Invalid highlights in experience entry ${index + 1}`);
    }
  });

  // Validate education entries
  resume.education.forEach((edu, index) => {
    if (!edu.institution || !edu.degree || !edu.field) {
      throw new ResumeParsingError(`Invalid education entry at position ${index + 1}`);
    }
  });
}