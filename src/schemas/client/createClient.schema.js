import { z } from 'zod';

export const createClientProfileSchema = z.object({
    company_name: z.string().min(1, {message: "This field is required"}),
    company_email: z.string().optional(),
    company_address: z.string().optional(),
    website: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true; // allow empty / undefined
      try {
        new URL(val); // check if valid URL
        return true;
      } catch {
        return false;
      }
    }, { message: "Invalid URL" }),
});