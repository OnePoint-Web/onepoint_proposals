import { z } from 'zod';

const usernameRegex = /^[a-zA-Z0-9]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

export const createClientSchema = z.object({
    username: z.string()
        .min(6, {message: "Username must be 6 characters minimum"})
        .regex(usernameRegex, {message: 'Username must not contain special characters'}),
    first_name: z.string().min(1, {message: "This field is required"}),
    last_name: z.string().min(1, {message: "This field is required"}),
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(8, {message: 'Password must be 8 characters minimum'})
        .regex(passwordRegex, "Password must contain uppercase, lowercase, number, and symbol"),
    confirm_password: z.string(),

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
    }).refine((data) => data.password === data.confirm_password, {
        message: "Passwords do not match",
        path: ["confirm_password"], // path of error
    });;