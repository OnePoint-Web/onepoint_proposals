import { z } from 'zod';

export const userLoginSchema = z.object({
    username: z.string().min(1, "Please enter username"),
    password: z.string().min(1, "Please enter password")
    })

  