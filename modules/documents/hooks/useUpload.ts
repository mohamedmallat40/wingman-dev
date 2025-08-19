import {
  deleteUploadedFile,
  fetchPrivateDocument,
  uploadFile,
  uploadPublic
} from '@root/modules/documents/services/upload.service';

export const useUpload = () => {
  const uploadFileSingle = async (file: File) => {
    const uploadResponse = await uploadFile(file);
    return uploadResponse.data;
  };

  const uploadPublicFile = async (file: File) => {
    const uploadResponse = await uploadPublic(file);
    return uploadResponse.data;
  };
  const deleteFile = async (fileName: string) => {
    const deleteResponse = await deleteUploadedFile(fileName);
    return deleteResponse.data;
  };

  const fetchSecureDocument = async (fileName: string) => {
    return await fetchPrivateDocument(fileName);
  };

  return {
    uploadFileSingle,
    deleteFile,
    fetchSecureDocument,
    uploadPublicFile
  };
};
