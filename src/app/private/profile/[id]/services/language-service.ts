import wingManApi from '@/lib/axios';
import { type Language, type LanguageProficiencyLevel, type CertificationLevel } from '../types';

export interface LanguageData {
  name: string;
  nativeName: string;
  code: string;
  countryFlag: string;
  region: string;
  speakers: number; // Approximate number of speakers worldwide
}

export interface CreateLanguageRequest {
  name: string;
  code: string;
  level: LanguageProficiencyLevel;
  certificationLevel?: CertificationLevel;
  yearsOfExperience?: number;
  description?: string;
  certificationName?: string;
  certificationScore?: string;
  certificationDate?: string;
  isNative: boolean;
  canRead: boolean;
  canWrite: boolean;
  canSpeak: boolean;
  canUnderstand: boolean;
}

export class LanguageService {
  /**
   * Get comprehensive list of world languages
   */
  static getWorldLanguages(): LanguageData[] {
    return [
      // Major World Languages
      { name: 'English', nativeName: 'English', code: 'en', countryFlag: 'us', region: 'Global', speakers: 1500000000 },
      { name: 'Mandarin Chinese', nativeName: '中文', code: 'zh', countryFlag: 'cn', region: 'Asia', speakers: 1100000000 },
      { name: 'Spanish', nativeName: 'Español', code: 'es', countryFlag: 'es', region: 'Europe/Americas', speakers: 500000000 },
      { name: 'Hindi', nativeName: 'हिन्दी', code: 'hi', countryFlag: 'in', region: 'South Asia', speakers: 600000000 },
      { name: 'Arabic', nativeName: 'العربية', code: 'ar', countryFlag: 'sa', region: 'Middle East/Africa', speakers: 400000000 },
      { name: 'Portuguese', nativeName: 'Português', code: 'pt', countryFlag: 'pt', region: 'Europe/Americas', speakers: 280000000 },
      { name: 'Russian', nativeName: 'Русский', code: 'ru', countryFlag: 'ru', region: 'Eastern Europe/Asia', speakers: 260000000 },
      { name: 'Japanese', nativeName: '日本語', code: 'ja', countryFlag: 'jp', region: 'East Asia', speakers: 125000000 },
      { name: 'French', nativeName: 'Français', code: 'fr', countryFlag: 'fr', region: 'Europe/Africa', speakers: 280000000 },
      { name: 'German', nativeName: 'Deutsch', code: 'de', countryFlag: 'de', region: 'Central Europe', speakers: 130000000 },
      { name: 'Korean', nativeName: '한국어', code: 'ko', countryFlag: 'kr', region: 'East Asia', speakers: 80000000 },
      { name: 'Italian', nativeName: 'Italiano', code: 'it', countryFlag: 'it', region: 'Southern Europe', speakers: 65000000 },
      { name: 'Turkish', nativeName: 'Türkçe', code: 'tr', countryFlag: 'tr', region: 'Western Asia', speakers: 80000000 },
      { name: 'Vietnamese', nativeName: 'Tiếng Việt', code: 'vi', countryFlag: 'vn', region: 'Southeast Asia', speakers: 95000000 },
      { name: 'Thai', nativeName: 'ภาษาไทย', code: 'th', countryFlag: 'th', region: 'Southeast Asia', speakers: 70000000 },
      { name: 'Dutch', nativeName: 'Nederlands', code: 'nl', countryFlag: 'nl', region: 'Northwestern Europe', speakers: 25000000 },
      { name: 'Swedish', nativeName: 'Svenska', code: 'sv', countryFlag: 'se', region: 'Northern Europe', speakers: 10000000 },
      { name: 'Norwegian', nativeName: 'Norsk', code: 'no', countryFlag: 'no', region: 'Northern Europe', speakers: 5000000 },
      { name: 'Danish', nativeName: 'Dansk', code: 'da', countryFlag: 'dk', region: 'Northern Europe', speakers: 6000000 },
      { name: 'Finnish', nativeName: 'Suomi', code: 'fi', countryFlag: 'fi', region: 'Northern Europe', speakers: 5500000 },
      { name: 'Polish', nativeName: 'Polski', code: 'pl', countryFlag: 'pl', region: 'Central Europe', speakers: 45000000 },
      { name: 'Czech', nativeName: 'Čeština', code: 'cs', countryFlag: 'cz', region: 'Central Europe', speakers: 10000000 },
      { name: 'Hungarian', nativeName: 'Magyar', code: 'hu', countryFlag: 'hu', region: 'Central Europe', speakers: 13000000 },
      { name: 'Greek', nativeName: 'Ελληνικά', code: 'el', countryFlag: 'gr', region: 'Southern Europe', speakers: 13000000 },
      { name: 'Hebrew', nativeName: 'עברית', code: 'he', countryFlag: 'il', region: 'Middle East', speakers: 9000000 },
      { name: 'Indonesian', nativeName: 'Bahasa Indonesia', code: 'id', countryFlag: 'id', region: 'Southeast Asia', speakers: 270000000 },
      { name: 'Malay', nativeName: 'Bahasa Melayu', code: 'ms', countryFlag: 'my', region: 'Southeast Asia', speakers: 30000000 },
      { name: 'Filipino', nativeName: 'Filipino', code: 'fil', countryFlag: 'ph', region: 'Southeast Asia', speakers: 110000000 },
      { name: 'Swahili', nativeName: 'Kiswahili', code: 'sw', countryFlag: 'ke', region: 'East Africa', speakers: 200000000 },
      { name: 'Urdu', nativeName: 'اردو', code: 'ur', countryFlag: 'pk', region: 'South Asia', speakers: 230000000 },
      { name: 'Bengali', nativeName: 'বাংলা', code: 'bn', countryFlag: 'bd', region: 'South Asia', speakers: 300000000 },
      { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', code: 'pa', countryFlag: 'in', region: 'South Asia', speakers: 130000000 },
      { name: 'Tamil', nativeName: 'தமிழ்', code: 'ta', countryFlag: 'in', region: 'South Asia', speakers: 80000000 },
      { name: 'Telugu', nativeName: 'తెలుగు', code: 'te', countryFlag: 'in', region: 'South Asia', speakers: 95000000 },
      { name: 'Gujarati', nativeName: 'ગુજરાતી', code: 'gu', countryFlag: 'in', region: 'South Asia', speakers: 60000000 },
      { name: 'Marathi', nativeName: 'मराठी', code: 'mr', countryFlag: 'in', region: 'South Asia', speakers: 85000000 },
      { name: 'Ukrainian', nativeName: 'Українська', code: 'uk', countryFlag: 'ua', region: 'Eastern Europe', speakers: 40000000 },
      { name: 'Romanian', nativeName: 'Română', code: 'ro', countryFlag: 'ro', region: 'Southeastern Europe', speakers: 20000000 },
      { name: 'Bulgarian', nativeName: 'Български', code: 'bg', countryFlag: 'bg', region: 'Southeastern Europe', speakers: 9000000 },
      { name: 'Croatian', nativeName: 'Hrvatski', code: 'hr', countryFlag: 'hr', region: 'Southeastern Europe', speakers: 5000000 },
      { name: 'Serbian', nativeName: 'Српски', code: 'sr', countryFlag: 'rs', region: 'Southeastern Europe', speakers: 12000000 },
      { name: 'Slovak', nativeName: 'Slovenčina', code: 'sk', countryFlag: 'sk', region: 'Central Europe', speakers: 5000000 },
      { name: 'Slovenian', nativeName: 'Slovenščina', code: 'sl', countryFlag: 'si', region: 'Central Europe', speakers: 2500000 },
      { name: 'Lithuanian', nativeName: 'Lietuvių', code: 'lt', countryFlag: 'lt', region: 'Northern Europe', speakers: 3000000 },
      { name: 'Latvian', nativeName: 'Latviešu', code: 'lv', countryFlag: 'lv', region: 'Northern Europe', speakers: 2000000 },
      { name: 'Estonian', nativeName: 'Eesti', code: 'et', countryFlag: 'ee', region: 'Northern Europe', speakers: 1100000 }
    ].sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get language by code
   */
  static getLanguageByCode(code: string): LanguageData | undefined {
    return this.getWorldLanguages().find(lang => lang.code === code);
  }

  /**
   * Search languages by name
   */
  static searchLanguages(query: string): LanguageData[] {
    if (!query) return this.getWorldLanguages();
    
    const lowercaseQuery = query.toLowerCase();
    return this.getWorldLanguages().filter(lang => 
      lang.name.toLowerCase().includes(lowercaseQuery) ||
      lang.nativeName.toLowerCase().includes(lowercaseQuery) ||
      lang.code.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Get proficiency level details
   */
  static getProficiencyLevelInfo(level: LanguageProficiencyLevel) {
    const levelInfo = {
      NATIVE: {
        label: 'Native',
        description: 'Native or bilingual proficiency',
        color: 'success',
        cefr: 'C2+',
        percentage: 100
      },
      FLUENT: {
        label: 'Fluent',
        description: 'Full professional proficiency',
        color: 'success',
        cefr: 'C2',
        percentage: 95
      },
      PROFESSIONAL: {
        label: 'Professional',
        description: 'Professional working proficiency',
        color: 'primary',
        cefr: 'C1',
        percentage: 85
      },
      CONVERSATIONAL: {
        label: 'Conversational',
        description: 'General professional proficiency',
        color: 'secondary',
        cefr: 'B2',
        percentage: 75
      },
      INTERMEDIATE: {
        label: 'Intermediate',
        description: 'Limited working proficiency',
        color: 'warning',
        cefr: 'B1',
        percentage: 60
      },
      BEGINNER: {
        label: 'Beginner',
        description: 'Elementary proficiency',
        color: 'default',
        cefr: 'A2',
        percentage: 40
      },
      ELEMENTARY: {
        label: 'Elementary',
        description: 'Elementary proficiency',
        color: 'default',
        cefr: 'A1',
        percentage: 25
      }
    };

    return levelInfo[level];
  }

  /**
   * Get CEFR level details
   */
  static getCEFRLevelInfo(level: CertificationLevel) {
    const cefrInfo = {
      NATIVE: { label: 'Native', description: 'Native speaker', color: 'success' },
      C2: { label: 'C2', description: 'Mastery - Near native proficiency', color: 'success' },
      C1: { label: 'C1', description: 'Advanced - Effective operational proficiency', color: 'primary' },
      B2: { label: 'B2', description: 'Upper Intermediate - Independent user', color: 'secondary' },
      B1: { label: 'B1', description: 'Intermediate - Threshold user', color: 'warning' },
      A2: { label: 'A2', description: 'Elementary - Waystage user', color: 'default' },
      A1: { label: 'A1', description: 'Beginner - Breakthrough user', color: 'default' }
    };

    return cefrInfo[level];
  }

  /**
   * Get common language certifications
   */
  static getLanguageCertifications(languageCode: string) {
    const certifications: Record<string, string[]> = {
      en: ['IELTS', 'TOEFL', 'Cambridge English', 'TOEIC', 'PTE Academic'],
      es: ['DELE', 'SIELE', 'CELU'],
      fr: ['DELF', 'DALF', 'TCF', 'TEF'],
      de: ['TestDaF', 'DSH', 'Goethe-Zertifikat', 'telc Deutsch'],
      it: ['CILS', 'CELI', 'PLIDA', 'IT'],
      pt: ['CELPE-Bras', 'CAPLE'],
      ja: ['JLPT', 'J.TEST', 'NAT-TEST'],
      ko: ['TOPIK', 'KLAT'],
      zh: ['HSK', 'TOCFL', 'BCT'],
      ru: ['TORFL', 'TRKI'],
      ar: ['ALPT', 'ALTA'],
      hi: ['Hindi Prajna', 'Rashtrabhasha Prajna']
    };

    return certifications[languageCode] || ['Other certification'];
  }

  /**
   * Create a new language entry
   */
  static async createLanguage(data: CreateLanguageRequest): Promise<Language> {
    try {
      const response = await wingManApi.post('/profile/languages', data);
      return response.data;
    } catch (error) {
      console.error('Error creating language:', error);
      throw new Error('Failed to create language');
    }
  }

  /**
   * Update language entry
   */
  static async updateLanguage(id: string, data: Partial<CreateLanguageRequest>): Promise<Language> {
    try {
      const response = await wingManApi.put(`/profile/languages/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating language:', error);
      throw new Error('Failed to update language');
    }
  }

  /**
   * Delete language entry
   */
  static async deleteLanguage(id: string): Promise<void> {
    try {
      await wingManApi.delete(`/profile/languages/${id}`);
    } catch (error) {
      console.error('Error deleting language:', error);
      throw new Error('Failed to delete language');
    }
  }

  /**
   * Get user's languages
   */
  static async getUserLanguages(): Promise<Language[]> {
    try {
      const response = await wingManApi.get('/profile/languages');
      return response.data;
    } catch (error) {
      console.error('Error fetching languages:', error);
      throw new Error('Failed to fetch languages');
    }
  }

  /**
   * Create default language object
   */
  static createDefaultLanguage(): Partial<Language> {
    return {
      id: `temp-${Date.now()}`,
      name: '',
      code: '',
      key: '', // For backwards compatibility
      level: 'BEGINNER',
      isNative: false,
      canRead: true,
      canWrite: true,
      canSpeak: true,
      canUnderstand: true,
      yearsOfExperience: 0
    };
  }

  /**
   * Validate language data
   */
  static validateLanguage(language: Partial<Language>): string[] {
    const errors: string[] = [];

    if (!language.name?.trim()) {
      errors.push('Language name is required');
    }

    if (!language.code?.trim()) {
      errors.push('Language code is required');
    }

    if (!language.level) {
      errors.push('Proficiency level is required');
    }

    if (language.yearsOfExperience !== undefined && language.yearsOfExperience < 0) {
      errors.push('Years of experience cannot be negative');
    }

    if (language.certificationDate) {
      const date = new Date(language.certificationDate);
      if (isNaN(date.getTime()) || date > new Date()) {
        errors.push('Invalid certification date');
      }
    }

    return errors;
  }
}