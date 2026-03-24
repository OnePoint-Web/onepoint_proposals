import { z } from "zod"

export const createMemberSchema = z.object({
  member_name: z.string().min(1, "Full name is required"),
  role: z.string().min(1, "Member role/position is required"),
  description: z.string().min(1, "Write a short description..."),
  image: z.any().optional() 
})