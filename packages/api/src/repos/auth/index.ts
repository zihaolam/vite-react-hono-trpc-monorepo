import { TRPCError } from '@trpc/server'
import { type Context as HonoContext } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'
import type { JWTPayload } from 'jose'
import { sql } from 'kysely'
import { Scrypt } from 'lucia'

import { sign, verify } from '@luda/api/lib/jwt'
import { lucia } from '@luda/api/lib/lucia'
import { generateOTP } from '@luda/api/lib/otp'
import { verifyTurnstileToken } from '@luda/api/lib/turnstile'
import { BaseRepo } from '@luda/api/repos/base'
import type { TRPCContext } from '@luda/api/trpc'
import type { authValidators } from '@luda/api/validators'

interface EmailOTPVerificationTokenPayload extends JWTPayload {
   email: string
}
export class AuthRepo extends BaseRepo {
   getEmailOTP = async (ctx: TRPCContext, input: authValidators.GetEmailOTPSchema) => {
      const turnstileVerification = await verifyTurnstileToken(input.turnstileToken)
      if (!turnstileVerification?.success) {
         throw new TRPCError({ code: 'BAD_REQUEST' })
      }

      const otp = generateOTP(6)
      const existingOTP = await ctx.db
         .selectFrom('EmailVerificationToken')
         .select(['expiresAt'])
         .where('email', '=', input.email)
         .executeTakeFirst()
      if (existingOTP && existingOTP.expiresAt > new Date()) {
         throw new TRPCError({
            code: 'TOO_MANY_REQUESTS',
            message: 'You have requested an OTP too recently. Please wait a few minutes before trying again.',
         })
      }

      await ctx.db
         .insertInto('EmailVerificationToken')
         .values({
            email: input.email,
            expiresAt: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes
            token: otp,
         })
         .onDuplicateKeyUpdate({
            token: otp,
            expiresAt: new Date(Date.now() + 1000 * 60 * 5),
         })
         .execute()
   }

   verifyEmailOTP = async (ctx: TRPCContext, input: authValidators.VerifyEmailOTPSchema) => {
      const otpRecord = await ctx.db
         .selectFrom('EmailVerificationToken')
         .selectAll('EmailVerificationToken')
         .where('email', '=', input.email)
         .executeTakeFirst()
      if (!otpRecord || otpRecord.expiresAt < new Date()) {
         throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'otp expired',
         })
      }

      if (otpRecord.token !== input.otp) {
         throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'invalid otp',
         })
      }

      await ctx.db.deleteFrom('EmailVerificationToken').where('email', '=', input.email).execute()
      return sign({ email: input.email })
   }

   login = async (ctx: TRPCContext, input: authValidators.LoginSchema) => {
      const user = await ctx.db.selectFrom('User').selectAll('User').where('email', '=', input.email).executeTakeFirst()
      if (!user)
         throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid email or password',
         })

      const isValidPassword = new Scrypt().verify(user.hashedPassword, input.password)
      if (!isValidPassword)
         throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid email or password',
         })

      const { session } = await this.createSessionAndSetCookie(ctx.hctx, user.id)
      return this.getSessionData(session.id)
   }

   createSession = async (userId: string) => {
      const session = await lucia.createSession(userId, {})
      return session
   }

   createSessionAndSetCookie = async (ctx: HonoContext, userId: string) => {
      const session = await this.createSession(userId)
      const sessionCookie = lucia.createSessionCookie(session.id)
      setCookie(ctx, sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
      return {
         session,
         sessionCookie,
      }
   }

   getSessionData = (sessionId: string) => {
      return lucia.validateSession(sessionId)
   }

   createUser = async (ctx: TRPCContext, input: authValidators.CreateUserSchema) => {
      const { token, password } = input
      const { email } = await verify<EmailOTPVerificationTokenPayload>(token)
      const hashedPassword = await new Scrypt().hash(password)
      const newUser = await ctx.db
         .insertInto('User')
         .defaultValues()
         .values({
            id: sql`DEFAULT`,
            email,
            hashedPassword,
         })
         .returning(['id'])
         .executeTakeFirst()
      if (!newUser) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
      const { session } = await this.createSessionAndSetCookie(ctx.hctx, newUser.id)
      return this.getSessionData(session.id)
   }

   revokeCookieSession = (ctx: HonoContext) => {
      const sessionCookie = lucia.createBlankSessionCookie()
      setCookie(ctx, sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
   }

   getSession = async (ctx: HonoContext) => {
      const sessionId = getCookie(ctx, lucia.sessionCookieName) ?? null

      if (!sessionId) {
         return {
            session: null,
            user: null,
         }
      }

      const { session, user } = await this.getSessionData(sessionId)
      // next.js throws when you attempt to set cookie when rendering page

      try {
         if (!session) {
            this.revokeCookieSession(ctx)
            return {
               session: null,
               user: null,
            }
         }

         if (session?.fresh) {
            const sessionCookie = lucia.createSessionCookie(session.id)
            setCookie(ctx, sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
            return {
               session,
               user,
            }
         }

         return {
            session,
            user,
         }
      } catch (error) {
         console.error('Failed to set session cookie due to: ', error)
         return {
            session: null,
            user: null,
         }
      }
   }

   logout = async (ctx: TRPCContext) => {
      const sessionId = getCookie(ctx.hctx, lucia.sessionCookieName) ?? null
      if (!sessionId) return false
      await lucia.invalidateSession(sessionId)
      this.revokeCookieSession(ctx.hctx)
      return true
   }
}
