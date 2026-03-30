import { z } from "zod"

export const contactSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(100, "Name must be under 100 characters."),
  email: z.email("Please enter a valid email address."),
  subject: z
    .string()
    .min(1, "Subject is required.")
    .max(200, "Subject must be under 200 characters."),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters.")
    .max(5000, "Message must be under 5,000 characters."),
})

export type ContactFormData = z.infer<typeof contactSchema>
