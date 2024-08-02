import type { JWTPayload } from 'jose'
import { SignJWT, jwtVerify } from 'jose'

import { env } from '../env'

const encodedSecret = new TextEncoder().encode(env.JWT_SECRET)
export async function sign<TPayload extends JWTPayload>(payload: TPayload, subject?: string): Promise<string> {
   const iat = Math.floor(Date.now() / 1000)
   const exp = iat + 60 * 60 // one hour

   let signedTokenPipeline = new SignJWT({ ...payload })
      .setProtectedHeader({
         alg: env.JWT_ALG,
         typ: 'JWT',
      })
      .setExpirationTime(exp)
      .setIssuedAt(iat)
      .setNotBefore(iat)

   if (subject) {
      signedTokenPipeline = signedTokenPipeline.setSubject(subject)
   }

   return signedTokenPipeline.sign(encodedSecret)
}

export async function verify<TPayload extends Record<string, unknown>>(token: string): Promise<TPayload> {
   const { payload } = await jwtVerify(token, encodedSecret)
   // run some checks on the returned payload, perhaps you expect some specific values

   // if its all good, return it, or perhaps just return a boolean
   return payload as TPayload
}
