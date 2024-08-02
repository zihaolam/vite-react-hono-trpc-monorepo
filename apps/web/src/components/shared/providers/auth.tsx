import { trpc } from '@/trpc'
import React from 'react'

import type { AuthObj } from '@luda/api/types'

export type AuthContext = AuthObj & {
   isAuthenticated: boolean
   loginMutation: LoginMutation
   logoutMutation: LogoutMutation
}

const AuthContext = React.createContext<AuthContext | null>(null)

type LoginMutation = ReturnType<typeof trpc.auth.login.useMutation>
type LogoutMutation = ReturnType<typeof trpc.auth.logout.useMutation>

const defaultAuthObj: AuthObj = {
   user: null,
   session: null,
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
   const [authObj, setAuthObj] = React.useState<AuthObj>(defaultAuthObj)
   const isAuthenticated = !!authObj.user

   const loginMutation = trpc.auth.login.useMutation()
   const logoutMutation = trpc.auth.logout.useMutation()

   React.useEffect(() => {
      if (loginMutation.isSuccess) {
         if (!loginMutation?.data) return
         setAuthObj(loginMutation.data as AuthObj)
      }
   }, [loginMutation.data, loginMutation.isSuccess])

   React.useEffect(() => {
      if (logoutMutation.isSuccess) setAuthObj(defaultAuthObj)
   }, [logoutMutation.isSuccess])

   return (
      <AuthContext.Provider
         value={{
            isAuthenticated,
            loginMutation,
            logoutMutation,
            ...authObj,
         }}
      >
         {children}
      </AuthContext.Provider>
   )
}

export function useAuth() {
   const context = React.useContext(AuthContext)
   if (!context) {
      throw new Error('useAuth must be used within an AuthProvider')
   }
   return context
}
