import { env } from '@luda/api/env'

export const verifyTurnstileToken = async (token: string) => {
   const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      body: `secret=${env.CLOUDFLARE_TURNSTILE_SECRET_KEY}&response=${token}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
   })

   if (!res.ok) return null

   const data = (await res.json()) as {
      success: boolean
      'error-codes': string[]
      challenge_ts: string
      hostname: string
   }

   return data
}
