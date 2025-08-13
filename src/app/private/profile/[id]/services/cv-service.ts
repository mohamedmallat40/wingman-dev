import wingManApi from '@/lib/axios';

export interface ParsedCVData {
  personalInfo: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedIn?: string;
    website?: string;
    summary?: string;
  };
  skills: Array<{
    name: string;
    category: string;
    level?: string;
    years?: number;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    grade?: string;
    location?: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    location?: string;
    description: string;
    responsibilities: string[];
  }>;
  languages: Array<{
    name: string;
    level: string;
    proficiency?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    credentialId?: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    startDate?: string;
    endDate?: string;
    url?: string;
  }>;
}

export class CVService {
  static async parseCV(file: File): Promise<ParsedCVData> {
    const formData = new FormData();
    formData.append('cv', file);

    try {
      const response = await wingManApi.post('/cv/parse', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error parsing CV:', error);
      throw new Error('Failed to parse CV');
    }
  }

  static async applyCVData(data: Partial<ParsedCVData>): Promise<void> {
    try {
      await wingManApi.post('/profile/apply-cv-data', data);
    } catch (error) {
      console.error('Error applying CV data:', error);
      throw new Error('Failed to apply CV data to profile');
    }
  }

}
