import { Lucia, TimeSpan } from 'lucia'

import { adapter, type database } from '@luda/api/db'
import { env } from '@luda/api/env'

export const lucia = new Lucia(adapter, {
   getSessionAttributes: session => {
      return session
   },
   getUserAttributes: attributes => {
      return {
         id: attributes.id,
         email: attributes.email,
         emailVerifiedAt: attributes.emailVerifiedAt,
         createdAt: attributes.createdAt,
         role: attributes.role,
      }
   },
   sessionExpiresIn: new TimeSpan(30, 'd'),
   sessionCookie: {
      name: 'session',

      expires: false, // session cookies have very long lifespan (2 years)
      attributes: { secure: env.isProd },
   },
})

declare module 'lucia' {
   interface Register {
      Lucia: typeof lucia
      DatabaseUserAttributes: Omit<database.User, 'hashedPassword'>
   }
}
