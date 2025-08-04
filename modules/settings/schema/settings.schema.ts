import { z } from 'zod';

export const generalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),

  profileImage: z.string().url('Profile image must be a valid URL').optional().nullable(),
  profileCover: z.string().url('Profile cover must be a valid URL').optional().nullable(),

  address: z
    .object({
      street: z.string().min(5, 'Street is required'),
      city: z.string().min(5, 'City is required'),
      postalCode: z.string().min(5, 'Postal code is required'),
      country: z.string().min(5, 'Country is required'),
      countryCode: z.string().min(5, 'Country is required'),
      houseNumber: z.string().min(5, 'Country is required'),
      VATNumber: z.string(),
      companyName: z.string(),
      type: z.string().default('BILLING')
    })
    .array()
    .min(1, 'At least one address is required'),

  aboutMe: z
    .string()
    .min(10, 'About me must be at least 10 characters')
    .max(500, 'About me must be less than 500 characters'),

  experienceYears: z
    .number()
    .min(0, 'Experience years must be positive')
    .max(50, 'Experience years must be realistic'),

  hourlyRate: z
    .number()
    .min(1, 'Hourly rate must be at least $1')
    .max(1000, 'Hourly rate must be realistic'),

  dailyRate: z
    .number()
    .min(1, 'Daily rate must be at least $1')
    .max(10_000, 'Daily rate must be realistic')
    .optional(),

  paymentType: z.enum(['HOURLY_BASED', 'DAILY_BASED', 'PROJECT']),
  workType: z.enum(['REMOTE', 'ON_SITE']),
  workingTime: z.enum(['PART_TIME', 'FULL_TIME']),
  statusAviability: z.enum(['OPEN_FOR_PROJECT', 'AVAILABLE', 'NOT_AVAILABLE']),

  profession: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  region: z.string().nullable(),
  city: z.string().nullable(),

  phoneNumber: z.string().min(5, 'Phone number must be valid'),
  birthDate: z.string().nullable().optional(),

  linkedinProfile: z.string().url('LinkedIn profile must be a valid URL').optional(),
  profileWebsite: z.string().url('Profile website must be a valid URL').optional(),

  language: z.string().min(2, 'Language code must be valid'),
  skills: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().min(1, 'Skill name is required'),
        level: z.string().min(1, 'Skill level is required')
      })
    )
    .optional(),

  tags: z.array(z.string()),
  notes: z.array(z.string()),

  shouldBeVisible: z.boolean(),
  acceptChatWarning: z.boolean(),

  portfolio: z.string().url('Portfolio must be a valid URL').nullable().optional()
});

// Skills Schema
export const skillSchema = z.object({
  id: z.string(),
  key: z.string().min(1, 'Skill name is required')
});

export const skillsSchema = z.object({
  skills: z.array(skillSchema).min(2, 'At least one skill is required')
});

// Languages Schema
export const languageSchema = z.object({
  id: z.string(),
  key: z.string().min(2, 'Language code is required'),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'NATIVE'])
});

export const languagesSchema = z.object({
  languages: z.array(languageSchema).min(1, 'At least one language is required')
});

// Experience Schema
export const experienceItemSchema = z.object({
  id: z.string(),
  position: z.string().min(1, 'Position is required'),
  company: z.string().min(1, 'Company is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().nullable()
});

export const experienceSchema = z.object({
  experience: z.array(experienceItemSchema)
});

// Projects Schema
const experienceProjectItemSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(1, 'Company is required'),
  description: z.string().min(20, 'Description is required'),
  startDate: z.string().min(10, 'Start date is required'),
  endDate: z.string().optional(),
  position: z.string().min(1, 'Position is required'),
  owner: z.string().optional(),
  title: z.string().nullable().optional(),
  link: z.string().url().nullable().optional(),
  image: z.string().nullable().optional(),
  screenShots: z.array(z.string().url()).nullable().optional(),
  videoUrl: z.string().url().nullable().optional(),
  category: z.string().nullable().optional()
});

export const projectsExpSchema = z.object({
  projects: z.array(experienceProjectItemSchema)
});

// Education Schema
export const educationItemSchema = z.object({
  id: z.string(),
  degree: z.string().min(1, 'Degree is required'),
  university: z.string().min(1, 'University is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  description: z.string().min(10, 'Description must be at least 10 characters')
});

export const educationSchema = z.object({
  education: z.array(educationItemSchema)
});

// Services Schema
export const serviceSkillSchema = z.object({
  id: z.string(),
  key: z.string().min(1, 'Skill name is required')
});

export const serviceItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Service name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(5, 'Price must be at least $5'),
  type: z.enum(['HOURLY_BASED', 'DAILY_BASED', 'PROJECT_BASED']),
  skills: z.array(skillSchema).min(2, 'At least one skill is required')
});

export const servicesSchema = z.object({
  services: z.array(serviceItemSchema)
});

export type GeneralInfoFormData = z.infer<typeof generalInfoSchema>;
export type SkillsFormData = z.infer<typeof skillsSchema>;
export type LanguagesFormData = z.infer<typeof languagesSchema>;
export type ExperienceFormData = z.infer<typeof experienceSchema>;
export type ProjectsFormData = z.infer<typeof projectsExpSchema>;
export type EducationFormData = z.infer<typeof educationItemSchema>;
export type ServicesFormData = z.infer<typeof servicesSchema>;
