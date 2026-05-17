import { z } from 'zod'

export const consultingInquiryInputSchema = z.object({
  name: z.string().trim().min(2, 'Nama minimal 2 karakter.'),
  email: z.string().trim().email('Email belum valid.'),
  phone: z.string().trim().optional(),
  packageId: z.string().trim().min(1, 'Pilih paket konsultasi.'),
  currentCards: z.string().trim().optional(),
  needs: z
    .string()
    .trim()
    .min(20, 'Jelaskan kebutuhan minimal 20 karakter.')
    .max(1200, 'Kebutuhan maksimal 1200 karakter.'),
})

export type ConsultingInquiryInput = z.infer<
  typeof consultingInquiryInputSchema
>
