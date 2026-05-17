import { TRPCError, initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { auth } from '#/lib/auth'

interface CreateTRPCContextOptions {
  req: Request
}

export async function createTRPCContext({ req }: CreateTRPCContextOptions) {
  const session = await auth.api.getSession({
    headers: req.headers,
  })

  return { session }
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>

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
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Akses admin diperlukan.',
    })
  }

  return next({ ctx })
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(requireUser)
export const adminProcedure = protectedProcedure.use(requireAdmin)
