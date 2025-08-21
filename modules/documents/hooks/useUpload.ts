import { uploadFile, deleteUploadedFile, fetchPrivateDocument, fetchDocumentById } from '@root/modules/documents/services/upload.service';

export const useUpload = () => {
  const uploadeFileSingle = async (file: File) => {
    const uploadResponse = await uploadFile(file);
    return uploadResponse.data;
  };

  const deleteFile = async (fileName: string) => {
    const deleteResponse = await deleteUploadedFile(fileName);
    return deleteResponse.data;
  };

  const fetchSecureDocument = async (fileName: string) => {
    return await fetchPrivateDocument(fileName);
  };

  const fetchDocumentForViewing = async (documentId: string) => {
    return await fetchDocumentById(documentId);
  };

  return {
    uploadeFileSingle,
    deleteFile,
    fetchSecureDocument,
    fetchDocumentForViewing
  };
};
