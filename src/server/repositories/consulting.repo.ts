import { prisma } from '#/db'
import { DEFAULT_TTL, cached } from '#/lib/cache'

export interface ConsultingPackageView {
  id: string
  name: string
  description: string | null
  priceIdr: number | null
  priceLabel: string | null
  outputs: string[]
  icon: string | null
}

export interface CreateConsultingInquiryInput {
  name: string
  email: string
  phone?: string
  packageId: string
  currentCards?: string
  needs?: string
}

export interface ConsultingInquiryReceipt {
  id: string
  status: string
}

function normalizeOutputs(outputs: unknown): string[] {
  if (!Array.isArray(outputs)) {
    return []
  }

  return outputs.filter(
    (output): output is string => typeof output === 'string',
  )
}

function optionalText(value: string | undefined): string | null {
  const trimmedValue = value?.trim()

  return trimmedValue ? trimmedValue : null
}

export const consultingRepo = {
  async findPackages(): Promise<ConsultingPackageView[]> {
    return cached(
      'consulting:packages',
      DEFAULT_TTL.CONSULTING_PACKAGES,
      async () => {
        const packages = await prisma.consultingPackage.findMany({
          orderBy: [{ name: 'asc' }],
        })

        return packages
          .map((consultingPackage) => ({
            id: consultingPackage.id,
            name: consultingPackage.name,
            description: consultingPackage.description,
            priceIdr: consultingPackage.priceIdr,
            priceLabel: consultingPackage.priceLabel,
            outputs: normalizeOutputs(consultingPackage.outputs),
            icon: consultingPackage.icon,
          }))
          .sort(
            (first, second) =>
              (first.priceIdr ?? Number.MAX_SAFE_INTEGER) -
              (second.priceIdr ?? Number.MAX_SAFE_INTEGER),
          )
      },
    )
  },

  async packageExists(packageId: string): Promise<boolean> {
    const consultingPackage = await prisma.consultingPackage.findUnique({
      where: {
        id: packageId,
      },
      select: {
        id: true,
      },
    })

    return consultingPackage !== null
  },

  async createInquiry(
    input: CreateConsultingInquiryInput,
  ): Promise<ConsultingInquiryReceipt> {
    return prisma.consultingInquiry.create({
      data: {
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        phone: optionalText(input.phone),
        packageId: input.packageId,
        currentCards: optionalText(input.currentCards),
        needs: optionalText(input.needs),
      },
      select: {
        id: true,
        status: true,
      },
    })
  },
}
