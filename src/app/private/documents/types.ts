export interface IDocument {
  id: string;
  documentName: string;
  fileName: string;
  createdAt: string;
  createdBy?: string;
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
  } | null;
  status: {
    id: string;
    name: string;
  } | null;
}

export type DocumentType = 'all-documents' | 'shared-with-me';

export interface DocumentFilters {
  search?: string;
  name?: string;
  tags?: string[];
  type?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}
