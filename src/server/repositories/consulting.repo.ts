import { prisma } from '#/db'

export interface ConsultingPackageView {
  id: string
  name: string
  description: string | null
  priceIdr: number | null
  priceLabel: string | null
  outputs: string[]
  icon: string | null
}

function normalizeOutputs(outputs: unknown): string[] {
  if (!Array.isArray(outputs)) {
    return []
  }

  return outputs.filter(
    (output): output is string => typeof output === 'string',
  )
}

export const consultingRepo = {
  async findPackages(): Promise<ConsultingPackageView[]> {
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
}
