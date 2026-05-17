import { z } from 'zod'

const articleIdSchema = z
  .string()
  .trim()
  .min(3, 'ID artikel minimal 3 karakter.')
  .max(120, 'ID artikel maksimal 120 karakter.')
  .regex(/^[a-z0-9-]+$/, 'Gunakan huruf kecil, angka, dan tanda hubung.')

const nullableTextSchema = z
  .string()
  .trim()
  .max(20_000, 'Konten terlalu panjang.')
  .transform((value) => (value.length > 0 ? value : null))

const nullableUrlSchema = z
  .string()
  .trim()
  .max(500, 'Maksimal 500 karakter.')
  .refine(
    (value) => value.length === 0 || URL.canParse(value),
    'URL tidak valid.',
  )
  .transform((value) => (value.length > 0 ? value : null))

const nullableDateSchema = z
  .string()
  .trim()
  .transform((value, ctx) => {
    if (value.length === 0) {
      return null
    }

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
      ctx.addIssue({
        code: 'custom',
        message: 'Tanggal publish tidak valid.',
      })
      return z.NEVER
    }

    return date
  })

const adminArticleBaseSchema = z.object({
  id: articleIdSchema,
  title: z.string().trim().min(5).max(180),
  excerpt: nullableTextSchema,
  content: nullableTextSchema,
  category: z.string().trim().min(2).max(80),
  subCategory: nullableTextSchema,
  author: nullableTextSchema,
  imageUrl: nullableUrlSchema,
  premium: z.boolean(),
  dealTag: nullableTextSchema,
  publishedAt: nullableDateSchema,
})

export const adminArticleCreateInputSchema = adminArticleBaseSchema
export const adminArticleUpdateInputSchema = adminArticleBaseSchema
export const adminArticleDeleteInputSchema = z.object({ id: articleIdSchema })

export type AdminArticleCreateInput = z.infer<
  typeof adminArticleCreateInputSchema
>
export type AdminArticleUpdateInput = z.infer<
  typeof adminArticleUpdateInputSchema
>
