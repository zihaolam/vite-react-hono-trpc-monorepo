import 'dotenv/config'

import { HttpServer } from '@luda/api/core'

import { Middlewares } from '@luda/api/middlewares'

import { env } from './env'

const { app } = HttpServer.create()

Middlewares.configure(app)
console.info(`TRPC Server is running on port ${env.SERVER_PORT}`)
export default {
   port: env.SERVER_PORT,
   fetch: app.fetch,
}
