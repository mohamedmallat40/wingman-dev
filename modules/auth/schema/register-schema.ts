import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  kind: z.enum(['FREELANCER', 'COMPANY', 'AGENCY']),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  addressDetails: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
    countryCode: z.string().optional(),
    houseNumber: z.string().optional(),
    VATNumber: z.string().optional(),
    companyName: z.string().optional(),
    type: z.string().default('BILLING').optional()
  })
});
