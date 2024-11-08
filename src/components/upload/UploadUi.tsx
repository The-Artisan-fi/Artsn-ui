import React from 'react';
import { S3Item } from '../../types/s3-types';
import { Upload, FileType, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';

type UploadUIProps = {
  onFileSelect: (files: FileList) => void;
  onRemove: (fileName: string) => void;
  items: S3Item[];
  selectedFiles: File[];
  uploading: boolean;
  error: string | null;
};

export const UploadUI: React.FC<UploadUIProps> = ({
  onFileSelect,
  onRemove,
  items,
  selectedFiles,
  uploading,
  error
}) => {
  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="mb-4">
        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
          Upload Files
        </label>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                Images, videos, PDFs (MAX. 100MB)
              </p>
            </div>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={(e) => onFileSelect(e.target.files!)}
              multiple
            />
          </label>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
          <ul className="space-y-2">
            {selectedFiles.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                <div className="flex items-center">
                  <FileType className="w-5 h-5 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-700">{file.name}</span>
                </div>
                <button onClick={() => onRemove(file.name)} className="text-red-500 hover:text-red-700">
                  <X className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {items.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Previously Uploaded Files:</h4>
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.key} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                <a href={item.url} className="text-blue-500 hover:text-blue-700 text-sm">{item.key}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};