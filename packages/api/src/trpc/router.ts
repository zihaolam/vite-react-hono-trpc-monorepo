import { trpcServer } from '@hono/trpc-server'
import type { Hono } from 'hono'

import { createContext } from '@luda/api/trpc'
import { createTRPCRouter } from '@luda/api/trpc'

import { router } from './routers'

export type AppRouter = typeof appRouter

const appRouter = createTRPCRouter(router)

export const initializeTrpc = async (app: Hono) => {
   app.use(
      '/trpc/*',
      trpcServer({
         router: appRouter,
         createContext: (_, c) => createContext(c),
      })
   )
}
