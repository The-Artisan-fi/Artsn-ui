import { useState } from 'react';
import { fetchUserItems, fetchItemById, uploadFile } from '@/services/s3-service';
import { S3Item } from '@/types/s3-types';

export const useS3 = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserItems = async (userId: string): Promise<S3Item[] | null> => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchUserItems(userId);
      setLoading(false);
      return items;
    } catch (err) {
      console.error('Error fetching user items:', err);
      setError('Failed to fetch items. Please try again later.');
      setLoading(false);
      return null;
    }
  };

  const getItemById = async (userId: string, fileUuid: string): Promise<S3Item | null> => {
    setLoading(true);
    setError(null);
    try {
      const item = await fetchItemById(userId, fileUuid);
      setLoading(false);
      return item;
    } catch (err) {
      console.error('Error fetching item:', err);
      setError('Failed to fetch item. Please try again later.');
      setLoading(false);
      return null;
    }
  };

  const uploadFileToS3 = async (file: File, userId: string): Promise<S3Item | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await uploadFile(file, userId);
      setLoading(false);
      return result;
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload file. Please try again.');
      setLoading(false);
      return null;
    }
  };

  return { getUserItems, getItemById, uploadFileToS3, loading, error };
};