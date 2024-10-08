import { useState, useCallback } from 'react';
import crypto from 'crypto';

// Define the shape of the proof data
export interface ProofOfUpload {
  fileHash: string;
  s3ETag: string;
  uploadTimestamp: string;
  fileUuid: string;
  fileName: string;
  fileSize: number;
}

// Define the return type of the hook
interface UseVerifyUploadReturn {
  verifyUploadProof: (
    storedProofHash: string,
    proofData: ProofOfUpload,
    fileUrl: string
  ) => Promise<boolean>;
  isVerifying: boolean;
  isValid: boolean | null;
  error: string | null;
}

export function useVerifyUpload(): UseVerifyUploadReturn {
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verifyUploadProof = useCallback(async (
    storedProofHash: string,
    proofData: ProofOfUpload,
    fileUrl: string
  ): Promise<boolean> => {
    setIsVerifying(true);
    setIsValid(null);
    setError(null);

    try {
      // Fetch the file from the provided URL
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const fileBuffer = await response.arrayBuffer();

      // Verify the file hash
      const calculatedFileHash = crypto.createHash('sha256').update(Buffer.from(fileBuffer)).digest('hex');
      if (calculatedFileHash !== proofData.fileHash) {
        throw new Error('File hash mismatch');
      }

      // Recreate the proof of upload object
      const recreatedProof: ProofOfUpload = {
        fileHash: calculatedFileHash,
        s3ETag: proofData.s3ETag,
        uploadTimestamp: proofData.uploadTimestamp,
        fileUuid: proofData.fileUuid,
        fileName: proofData.fileName,
        fileSize: proofData.fileSize,
      };

      // Generate the proof hash
      const calculatedProofHash = crypto
        .createHash('sha256')
        .update(JSON.stringify(recreatedProof))
        .digest('hex');

      // Compare the calculated hash with the stored hash
      const valid = calculatedProofHash === storedProofHash;
      setIsValid(valid);
      return valid;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, []);

  return { verifyUploadProof, isVerifying, isValid, error };
}