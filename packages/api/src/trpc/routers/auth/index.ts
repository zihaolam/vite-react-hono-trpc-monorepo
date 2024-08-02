import { repos } from '@luda/api/repos'
import { createTRPCRouter, publicProcedure } from '@luda/api/trpc'
import { authValidators } from '@luda/api/validators'

export const authRouter = createTRPCRouter({
   login: publicProcedure
      .input(authValidators.loginValidator)
      .mutation(({ ctx, input }) => repos.auth.login(ctx, input)),
   logout: publicProcedure.mutation(({ ctx }) => repos.auth.logout(ctx)),
   getEmailOTP: publicProcedure
      .input(authValidators.getEmailOTPValidator)
      .mutation(({ ctx, input }) => repos.auth.getEmailOTP(ctx, input)),
   verifyEmailOTP: publicProcedure
      .input(authValidators.verifyEmailOTPValidator)
      .mutation(({ ctx, input }) => repos.auth.verifyEmailOTP(ctx, input)),
   createUser: publicProcedure
      .input(authValidators.createUserValidator)
      .mutation(({ ctx, input }) => repos.auth.createUser(ctx, input)),
})
