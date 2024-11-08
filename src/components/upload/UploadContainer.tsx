import React, { useState } from 'react';
import { useS3 } from '@/hooks/use-s3';
import { UploadUI } from './UploadUi';
import { S3Item } from '../../types/s3-types';

interface UploadContainerProps {
  onFileSelect: (files: FileList) => void;
  onRemove: (fileName: string) => void;
  selectedFiles: File[];
  uploading: boolean;
  userId: string;
}

export const UploadContainer: React.FC<UploadContainerProps> = ({
  onFileSelect,
  onRemove,
  selectedFiles,
  uploading,
  userId
}) => {
  const [items, setItems] = useState<S3Item[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { getUserItems, error: s3Error } = useS3();

  // useEffect(() => {
  //   const fetchItems = async () => {
  //     try {
  //       const fetchedItems = await getUserItems(userId);
  //       if (fetchedItems) {
  //         setItems(fetchedItems);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching items:', error);
  //     }
  //   };
  //   fetchItems();
  // }, [userId, getUserItems]);

  const handleFileSelect = (files: FileList) => {
    onFileSelect(files);
    setUploadError(null);
  };

  return (
    <UploadUI
      onFileSelect={handleFileSelect}
      onRemove={onRemove}
      items={items}
      selectedFiles={selectedFiles}
      uploading={uploading}
      error={uploadError || s3Error}
    />
  );
};