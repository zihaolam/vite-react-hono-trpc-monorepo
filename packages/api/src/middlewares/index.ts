import type { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { cors } from 'hono/cors'
import { join, resolve } from 'path'

import { env } from '@luda/api/env'
import { initializeTrpc } from '@luda/api/trpc/router'

export class Middlewares {
   public static configure(app: Hono) {
      initializeTrpc(app)
      this.cors(app)
      if (env.isProd) {
         this.serveWeb(app)
      }
   }

   public static cors(app: Hono) {
      app.use('*', cors({ origin: env.CLIENT_URL }))
   }

   private static serveWeb(app: Hono) {
      const buildPath = resolve(__dirname, '../../../../web/dist')
      app.get('*', serveStatic({ path: join(buildPath, 'index.html') }))
   }
}
