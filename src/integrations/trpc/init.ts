import { TRPCError, initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { auth } from '#/lib/auth'
import { rateLimit } from '#/lib/rate-limit'

interface CreateTRPCContextOptions {
  req: Request
}

type AuthSession = Awaited<ReturnType<typeof auth.api.getSession>>

export interface TRPCContext {
  clientIp?: string
  session: AuthSession
}

export async function createTRPCContext({
  req,
}: CreateTRPCContextOptions): Promise<TRPCContext> {
  const session = await auth.api.getSession({
    headers: req.headers,
  })

  return { clientIp: getClientIp(req.headers), session }
}

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
})

const requireUser = t.middleware(({ ctx, next }) => {
  const { session } = ctx

  if (!session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Login diperlukan.',
    })
  }

  return next({
    ctx: {
      ...ctx,
      session,
      user: session.user,
    },
  })
})

const requireAdmin = t.middleware(({ ctx, next }) => {
  const { session } = ctx

  if (!session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Login diperlukan.',
    })
  }

  if (session.user.role !== 'admin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Akses admin diperlukan.',
    })
  }

  return next({
    ctx: {
      ...ctx,
      session,
      user: session.user,
    },
  })
})

function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for')?.split(',').at(0)?.trim()

  return (
    forwardedFor ||
    headers.get('cf-connecting-ip') ||
    headers.get('x-real-ip') ||
    'anonymous'
  )
}

function rateLimitedProcedure(
  keyPrefix: string,
  limit: number,
  windowMs: number,
) {
  return publicProcedure.use(async ({ ctx, next }) => {
    const identifier = encodeURIComponent(
      ctx.session?.user.id ?? ctx.clientIp ?? 'anonymous',
    )

    try {
      await rateLimit(`rate-limit:${keyPrefix}:${identifier}`, limit, windowMs)
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      }

      console.warn(`Redis rate limit failed for ${keyPrefix}.`, error)
    }

    return next()
  })
}

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(requireUser)
export const adminProcedure = protectedProcedure.use(requireAdmin)
export const newsletterProcedure = rateLimitedProcedure(
  'newsletter:subscribe',
  3,
  60 * 60 * 1000,
)
export const consultingProcedure = rateLimitedProcedure(
  'consulting:submit',
  5,
  60 * 60 * 1000,
)
