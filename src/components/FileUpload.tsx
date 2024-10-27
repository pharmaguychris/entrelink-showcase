import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { parseResume } from '../services/resumeParser';
import { ParsedResume, ResumeParsingError } from '../services/types';
import { ERROR_MESSAGES } from '../services/config';
import { defaultResume } from '../data/defaultResume';

interface FileUploadProps {
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
  onResumeProcessed: (data: ParsedResume) => void;
}

function FileUpload({ isUploading, setIsUploading, onResumeProcessed }: FileUploadProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    if (!file) {
      toast.error(ERROR_MESSAGES.INVALID_FORMAT);
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading('Processing your resume... This may take a few moments.');
    
    try {
      const parsedResume = await parseResume(file);
      if (!parsedResume) {
        throw new ResumeParsingError(ERROR_MESSAGES.PARSE_ERROR);
      }
      
      toast.success('Resume processed successfully!', { id: toastId });
      onResumeProcessed(parsedResume);
    } catch (error) {
      console.error('Resume processing error:', error);
      
      // Use default resume as fallback when API fails
      toast.error('Using demo portfolio due to processing error', { 
        id: toastId,
        duration: 3000
      });
      
      // Short delay before showing the portfolio to ensure the error message is seen
      setTimeout(() => {
        onResumeProcessed(defaultResume);
      }, 1500);
    } finally {
      setIsUploading(false);
    }
  }, [setIsUploading, onResumeProcessed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false,
    disabled: isUploading,
    maxSize: 5242880, // 5MB
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === 'file-too-large') {
        toast.error(ERROR_MESSAGES.FILE_TOO_LARGE);
      } else if (error?.code === 'file-invalid-type') {
        toast.error(ERROR_MESSAGES.INVALID_FORMAT);
      } else {
        toast.error(ERROR_MESSAGES.FILE_ERROR);
      }
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-xl p-8 cursor-pointer
        transition-all duration-200 text-center
        ${isDragActive ? 'border-purple-500 bg-purple-500/10' : 'border-slate-700 hover:border-purple-500/50'}
        ${isUploading ? 'pointer-events-none opacity-75' : ''}
      `}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center gap-4">
        {isUploading ? (
          <Loader className="w-12 h-12 text-purple-400 animate-spin" />
        ) : (
          <Upload className="w-12 h-12 text-purple-400" />
        )}
        
        <div className="space-y-2">
          <p className="text-white text-lg">
            {isDragActive
              ? "Drop your resume here..."
              : "Drag & drop your resume here"}
          </p>
          <p className="text-slate-400">
            or click to select a file
          </p>
        </div>
        
        <div className="text-sm text-slate-500">
          Supports Word documents (.docx) up to 5MB
        </div>
      </div>
    </div>
  );
}

export default FileUpload;