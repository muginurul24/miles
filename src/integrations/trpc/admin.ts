import { TRPCError } from '@trpc/server'
import { adminProcedure } from './init'
import {
  adminArticleCreateInputSchema,
  adminArticleDeleteInputSchema,
  adminArticleUpdateInputSchema,
} from '#/lib/schemas/admin-article'
import {
  adminCardCreateInputSchema,
  adminCardDeleteInputSchema,
  adminCardUpdateInputSchema,
} from '#/lib/schemas/admin-card'
import {
  adminInquiryListInputSchema,
  adminInquiryUpdateStatusInputSchema,
} from '#/lib/schemas/admin-inquiry'
import { adminInquiriesRepo } from '#/server/repositories/admin-inquiries.repo'
import { adminOverviewRepo } from '#/server/repositories/admin-overview.repo'
import { adminRepo } from '#/server/repositories/admin.repo'
import { adminSubscribersRepo } from '#/server/repositories/admin-subscribers.repo'
import { invalidate } from '#/lib/cache'

import type { TRPCRouterRecord } from '@trpc/server'

const adminRouter = {
  ping: adminProcedure.query(({ ctx }) => ({
    ok: true,
    userId: ctx.user.id,
  })),
  overview: adminProcedure.query(() => adminOverviewRepo.getOverview()),
  cards: adminProcedure.query(() => adminRepo.listCards()),
  createCard: adminProcedure
    .input(adminCardCreateInputSchema)
    .mutation(async ({ input }) => {
      const exists = await adminRepo.cardExists(input.id)

      if (exists) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'ID kartu sudah digunakan.',
        })
      }

      const card = await adminRepo.createCard(input)
      await invalidate('cards:')
      return card
    }),
  updateCard: adminProcedure
    .input(adminCardUpdateInputSchema)
    .mutation(async ({ input }) => {
      const exists = await adminRepo.cardExists(input.id)

      if (!exists) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Kartu tidak ditemukan.',
        })
      }

      const card = await adminRepo.updateCard(input)
      await invalidate('cards:')
      return card
    }),
  deleteCard: adminProcedure
    .input(adminCardDeleteInputSchema)
    .mutation(async ({ input }) => {
      const exists = await adminRepo.cardExists(input.id)

      if (!exists) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Kartu tidak ditemukan.',
        })
      }

      const card = await adminRepo.deleteCard(input.id)
      await invalidate('cards:')
      return card
    }),
  articles: adminProcedure.query(() => adminRepo.listArticles()),
  createArticle: adminProcedure
    .input(adminArticleCreateInputSchema)
    .mutation(async ({ input }) => {
      const exists = await adminRepo.articleExists(input.id)

      if (exists) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'ID artikel sudah digunakan.',
        })
      }

      const article = await adminRepo.createArticle(input)
      await invalidate('articles:')
      return article
    }),
  updateArticle: adminProcedure
    .input(adminArticleUpdateInputSchema)
    .mutation(async ({ input }) => {
      const exists = await adminRepo.articleExists(input.id)

      if (!exists) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Artikel tidak ditemukan.',
        })
      }

      const article = await adminRepo.updateArticle(input)
      await invalidate('articles:')
      return article
    }),
  deleteArticle: adminProcedure
    .input(adminArticleDeleteInputSchema)
    .mutation(async ({ input }) => {
      const exists = await adminRepo.articleExists(input.id)

      if (!exists) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Artikel tidak ditemukan.',
        })
      }

      const article = await adminRepo.deleteArticle(input.id)
      await invalidate('articles:')
      return article
    }),
  inquiries: adminProcedure
    .input(adminInquiryListInputSchema)
    .query(({ input }) => adminInquiriesRepo.list(input?.status)),
  updateInquiryStatus: adminProcedure
    .input(adminInquiryUpdateStatusInputSchema)
    .mutation(async ({ input }) => {
      const exists = await adminInquiriesRepo.exists(input.id)

      if (!exists) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Inquiry tidak ditemukan.',
        })
      }

      return adminInquiriesRepo.updateStatus(input.id, input.status)
    }),
  subscribers: adminProcedure.query(() => adminSubscribersRepo.list()),
} satisfies TRPCRouterRecord

export { adminRouter }
