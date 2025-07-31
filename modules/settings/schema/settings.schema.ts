import { z } from 'zod';

// General Info Schema
export const generalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  profileImage: z.string().url('Please provide a valid avatar URL').optional(),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    houseNumber: z.string().min(1, 'House number is required'),
    city: z.string().min(1, 'City is required'),
    country: z.string().min(1, 'Country is required')
  }),
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
  paymentType: z.enum(['HOURLY_BASED', 'DAILY_BASED', 'PROJECT'])
});

// Skills Schema
export const skillSchema = z.object({
  id: z.number(),
  key: z.string().min(1, 'Skill name is required')
});

export const skillsSchema = z.object({
  skills: z.array(skillSchema).min(2, 'At least one skill is required')
});

// Languages Schema
export const languageSchema = z.object({
  id: z.number(),
  key: z.string().min(2, 'Language code is required'),
  level: z.enum(['Basic', 'Intermediate', 'Advanced', 'Native'])
});

export const languagesSchema = z.object({
  languages: z.array(languageSchema).min(1, 'At least one language is required')
});

// Experience Schema
export const experienceItemSchema = z.object({
  id: z.number(),
  position: z.string().min(1, 'Position is required'),
  company: z.string().min(1, 'Company is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().nullable()
});

export const experienceSchema = z.object({
  experience: z.array(experienceItemSchema)
});

// Projects Schema
export const projectItemSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Project name is required'),
  company: z.string().min(1, 'Company is required'),
  image: z.string().url('Please provide a valid image URL')
});

export const projectsSchema = z.object({
  projects: z.array(projectItemSchema)
});

// Education Schema
export const educationItemSchema = z.object({
  id: z.number(),
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
  key: z.string().min(1, 'Skill name is required'),
  type: z.enum(['NORMAL', 'SOFT', 'TECHNICAL'])
});

export const serviceItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Service name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(1, 'Price must be at least $1'),
  type: z.enum(['HOURLY_BASED', 'DAILY_BASED', 'PROJECT_BASED']),
  skills: z.array(serviceSkillSchema).min(1, 'At least one skill is required')
});

export const servicesSchema = z.object({
  services: z.array(serviceItemSchema)
});

export type GeneralInfoFormData = z.infer<typeof generalInfoSchema>;
export type SkillsFormData = z.infer<typeof skillsSchema>;
export type LanguagesFormData = z.infer<typeof languagesSchema>;
export type ExperienceFormData = z.infer<typeof experienceSchema>;
export type ProjectsFormData = z.infer<typeof projectsSchema>;
export type EducationFormData = z.infer<typeof educationSchema>;
export type ServicesFormData = z.infer<typeof servicesSchema>;
