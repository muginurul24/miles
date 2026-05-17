import { z } from 'zod'

export const adminInquiryStatusSchema = z.enum([
  'new',
  'contacted',
  'resolved',
  'closed',
])

export const adminInquiryListInputSchema = z
  .object({
    status: adminInquiryStatusSchema.optional(),
  })
  .optional()

export const adminInquiryUpdateStatusInputSchema = z.object({
  id: z.string().uuid('ID inquiry tidak valid.'),
  status: adminInquiryStatusSchema,
})

export type AdminInquiryStatus = z.infer<typeof adminInquiryStatusSchema>
