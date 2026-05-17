import { prisma } from '#/db'

import type { Prisma } from '#/generated/prisma/client'
import type { AdminInquiryStatus } from '#/lib/schemas/admin-inquiry'

const adminInquirySelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  currentCards: true,
  needs: true,
  status: true,
  createdAt: true,
  package: {
    select: {
      id: true,
      name: true,
      priceLabel: true,
    },
  },
} satisfies Prisma.ConsultingInquirySelect

export type AdminInquiryRow = Prisma.ConsultingInquiryGetPayload<{
  select: typeof adminInquirySelect
}>

export const adminInquiriesRepo = {
  async list(status?: AdminInquiryStatus): Promise<AdminInquiryRow[]> {
    return prisma.consultingInquiry.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      select: adminInquirySelect,
    })
  },

  async exists(id: string): Promise<boolean> {
    const inquiry = await prisma.consultingInquiry.findUnique({
      where: { id },
      select: { id: true },
    })

    return inquiry !== null
  },

  async updateStatus(
    id: string,
    status: AdminInquiryStatus,
  ): Promise<AdminInquiryRow> {
    return prisma.consultingInquiry.update({
      where: { id },
      data: { status },
      select: adminInquirySelect,
    })
  },
}
