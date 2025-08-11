export interface IDocument {
  id: string;
  documentName: string;
  fileName: string;
  createdAt: string;
  sharedWith: Array<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImage: string | null;
  }>;
  tags: Array<{
    id: string;
    name: string;
  }>;
  type: {
    id: string;
    name: string;
  };
  status: {
    id: string;
    name: string;
  };
}

export type DocumentType = 'all-documents' | 'shared-with-me';

export interface DocumentFilters {
  search?: string;
  name?: string;
  tags?: string[];
  type?: string;
  status?: string;
}
