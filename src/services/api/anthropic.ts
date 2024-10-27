import { API_CONFIG, ERROR_MESSAGES } from '../config';
import { ParsedResume, ResumeParsingError } from '../types';

interface AnthropicResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  id: string;
  model: string;
  role: string;
}

async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = API_CONFIG.MAX_RETRIES,
  baseDelay: number = API_CONFIG.BASE_RETRY_DELAY
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
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

export async function processResumeWithAI(text: string): Promise<ParsedResume> {
  if (!text?.trim()) {
    throw new ResumeParsingError('No text provided for processing');
  }

  if (!API_CONFIG.ANTHROPIC_API_KEY) {
    throw new ResumeParsingError(ERROR_MESSAGES.MISSING_API_KEY);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_TIMEOUT);

  try {
    const response = await retryWithBackoff(async () => {
      const result = await fetch(API_CONFIG.ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': API_CONFIG.ANTHROPIC_API_KEY,
          'anthropic-version': API_CONFIG.ANTHROPIC_VERSION
        },
        body: JSON.stringify({
          model: API_CONFIG.MODEL,
          max_tokens: API_CONFIG.MAX_TOKENS,
          messages: [{
            role: 'user',
            content: `Parse this resume and extract structured information in JSON format matching this TypeScript interface exactly:

            interface ParsedResume {
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

            Requirements:
            1. Extract information exactly as written
            2. Use consistent date formats (YYYY-MM)
            3. Create a professional summary if none exists
            4. Return ONLY valid JSON
            5. Include all required fields
            6. Use empty arrays for missing sections

            Resume text:
            ${text}`
          }]
        }),
        signal: controller.signal
      });

      if (!result.ok) {
        const errorData = await result.json().catch(() => null);
        if (result.status === 401) {
          throw new ResumeParsingError(ERROR_MESSAGES.AUTH_ERROR);
        }
        throw new ResumeParsingError(
          errorData?.error?.message || `HTTP error! status: ${result.status}`
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
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ResumeParsingError(ERROR_MESSAGES.TIMEOUT_ERROR);
    }
    throw new ResumeParsingError(
      error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR
    );
  } finally {
    clearTimeout(timeoutId);
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