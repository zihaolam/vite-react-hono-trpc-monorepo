import { TRPCError, initTRPC } from '@trpc/server'
import type { Context as HonoContext } from 'hono'

import { createDbClient } from '@luda/api/db'
import type { UserRole } from '@luda/api/db/enums'
import { repos } from '@luda/api/repos'

const createContextFactory = () => {
   const db = createDbClient()
   return async (ctx: HonoContext) => {
      const { req, res } = ctx
      const auth = await repos.auth.getSession(ctx)
      return {
         req,
         hctx: ctx,
         res,
         ...auth,
         db,
      }
   }
}

export const createContext = createContextFactory()

export type TRPCContext = Awaited<ReturnType<typeof createContext>>

export const t = initTRPC.context<TRPCContext>().create()

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure

const enforceUserPermissions = (roles: UserRole[]) =>
   t.middleware(async ({ ctx, next }) => {
      if (!ctx.session) {
         throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      if (!roles.length) return next({ ctx }) // return next if no roles are specified, means normal auth is required only

      if (roles.includes(ctx.user.role as unknown as UserRole)) return next({ ctx })

      throw new TRPCError({ code: 'UNAUTHORIZED' })
   })

export const protectedProcedure = (...roles: UserRole[]) => t.procedure.use(enforceUserPermissions(roles))
