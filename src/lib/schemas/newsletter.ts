import { z } from 'zod'

export const newsletterSubscribeInputSchema = z.object({
  email: z.string().trim().email('Masukkan email yang valid.'),
})

export type NewsletterSubscribeInput = z.infer<
  typeof newsletterSubscribeInputSchema
>
