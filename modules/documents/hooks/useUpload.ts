import { uploadFile } from '@root/modules/documents/services/upload.service';

export const useUpload = () => {
  const uploadeFileSingle = async (file: File) => {
    console.log('Uploading file:', file);
    const uploadResponse = await uploadFile(file);
    return uploadResponse.data;
  };

  return {
    uploadeFileSingle
  };
};
