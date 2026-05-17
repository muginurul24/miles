import { z } from 'zod'

const optionalTextSchema = z
  .string()
  .trim()
  .max(500, 'Maksimal 500 karakter.')
  .transform((value) => (value.length > 0 ? value : null))

const optionalUrlSchema = z
  .string()
  .trim()
  .max(500, 'Maksimal 500 karakter.')
  .refine(
    (value) => value.length === 0 || URL.canParse(value),
    'URL gambar tidak valid.',
  )
  .transform((value) => (value.length > 0 ? value : null))

const cardIdSchema = z
  .string()
  .trim()
  .min(3, 'ID kartu minimal 3 karakter.')
  .max(80, 'ID kartu maksimal 80 karakter.')
  .regex(/^[a-z0-9-]+$/, 'Gunakan huruf kecil, angka, dan tanda hubung.')

const adminCardBaseSchema = z.object({
  id: cardIdSchema,
  name: z.string().trim().min(3).max(140),
  shortName: z.string().trim().min(2).max(80),
  bank: z.string().trim().min(2).max(80),
  network: z.string().trim().min(2).max(40),
  tier: z.string().trim().min(2).max(80),
  annualFee: z.coerce.number().int().min(0).max(100_000_000),
  minIncome: z.coerce.number().int().min(0).max(1_000_000_000),
  imageUrl: optionalUrlSchema,
  bestFor: optionalTextSchema,
  notIdealFor: optionalTextSchema,
  loungeAccess: z.boolean(),
  travelInsurance: z.boolean(),
  airportTransfer: z.boolean(),
})

export const adminCardCreateInputSchema = adminCardBaseSchema

export const adminCardUpdateInputSchema = adminCardBaseSchema

export const adminCardDeleteInputSchema = z.object({
  id: cardIdSchema,
})

export type AdminCardCreateInput = z.infer<typeof adminCardCreateInputSchema>
export type AdminCardUpdateInput = z.infer<typeof adminCardUpdateInputSchema>
