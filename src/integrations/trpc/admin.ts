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

      return adminRepo.createCard(input)
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

      return adminRepo.updateCard(input)
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

      return adminRepo.deleteCard(input.id)
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

      return adminRepo.createArticle(input)
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

      return adminRepo.updateArticle(input)
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

      return adminRepo.deleteArticle(input.id)
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
