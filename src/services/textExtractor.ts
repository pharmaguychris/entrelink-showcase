import mammoth from 'mammoth';
import { ResumeParsingError } from './types';
import { ERROR_MESSAGES } from './config';

export async function extractTextFromDoc(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new ResumeParsingError(ERROR_MESSAGES.EMPTY_FILE);
    }

    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (!result?.value) {
      throw new ResumeParsingError(ERROR_MESSAGES.FILE_ERROR);
    }

    const extractedText = result.value.trim();
    if (!extractedText) {
      throw new ResumeParsingError(ERROR_MESSAGES.EMPTY_FILE);
    }

    // Basic validation of extracted text
    if (extractedText.length < 50) {
      throw new ResumeParsingError('The document contains too little text to be a valid resume');
    }

    return extractedText;
  } catch (error) {
    console.error('Text extraction error:', error);
    
    if (error instanceof ResumeParsingError) {
      throw error;
    }
    
    throw new ResumeParsingError(
      error instanceof Error 
        ? error.message 
        : ERROR_MESSAGES.FILE_ERROR
    );
  }
}