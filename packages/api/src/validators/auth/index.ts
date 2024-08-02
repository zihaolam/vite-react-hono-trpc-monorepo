import { z } from 'zod'

export const loginValidator = z.object({
   email: z.string().email(),
   password: z.string().min(6),
})

export type LoginSchema = z.infer<typeof loginValidator>

export const getEmailOTPValidator = z.object({
   email: z.string().email(),
   turnstileToken: z.string(),
})

export type GetEmailOTPSchema = z.infer<typeof getEmailOTPValidator>

export const verifyEmailOTPValidator = z.object({
   email: z.string().email(),
   otp: z.string(),
})

export type VerifyEmailOTPSchema = z.infer<typeof verifyEmailOTPValidator>

export const createUserValidator = z.object({
   token: z.string(),
   password: z.string(),
})

export type CreateUserSchema = z.infer<typeof createUserValidator>
