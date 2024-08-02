import { NodePostgresAdapter } from '@lucia-auth/adapter-postgresql'
import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'

import type { database } from './types'

import { env } from '../env'

const pool = new Pool({ connectionString: env.DATABASE_URL })

export const createDbClient = () => {
   return new Kysely<database.DB>({ dialect: new PostgresDialect({ pool }) })
}

export type DBClient = ReturnType<typeof createDbClient>

export const adapter = new NodePostgresAdapter(pool, {
   user: 'User',
   session: 'Session',
})
