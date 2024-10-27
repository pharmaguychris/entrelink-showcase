import { ParsedResume, ResumeParsingError } from './types';
import { extractTextFromDoc } from './textExtractor';
import { processResumeWithAI } from './api/openai';
import { ERROR_MESSAGES } from './config';

export async function parseResume(file: File): Promise<ParsedResume> {
  if (!file) {
    throw new ResumeParsingError(ERROR_MESSAGES.INVALID_FORMAT);
  }

  if (!file.name.toLowerCase().endsWith('.docx')) {
    throw new ResumeParsingError(ERROR_MESSAGES.INVALID_FORMAT);
  }

  if (file.size > 5242880) { // 5MB
    throw new ResumeParsingError(ERROR_MESSAGES.FILE_TOO_LARGE);
  }

  try {
    const text = await extractTextFromDoc(file);
    if (!text?.trim()) {
      throw new ResumeParsingError(ERROR_MESSAGES.EMPTY_FILE);
    }

    const parsedData = await processResumeWithAI(text);
    if (!parsedData) {
      throw new ResumeParsingError(ERROR_MESSAGES.PARSE_ERROR);
    }

    return parsedData;
  } catch (error) {
    console.error('Resume parsing error:', error);
    
    if (error instanceof ResumeParsingError) {
      throw error;
    }
    
    throw new ResumeParsingError(
      error instanceof Error ? error.message : ERROR_MESSAGES.PARSE_ERROR
    );
  }
}