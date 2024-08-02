import { theme } from '@/styles'
import '@/styles/index.scss'
import { trpc } from '@/trpc'
import { QueryClientProvider } from '@tanstack/react-query'
import { type PropsWithChildren } from 'react'
import { ThemeProvider } from 'styled-components'

import { useTrpc } from '@/hooks'

import { AuthProvider } from './auth'

export const Providers = ({ children }: PropsWithChildren) => {
   const { trpcClient, queryClient } = useTrpc()

   return (
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
         <QueryClientProvider client={queryClient}>
            <AuthProvider>
               <ThemeProvider theme={theme}>{children}</ThemeProvider>
            </AuthProvider>
         </QueryClientProvider>
      </trpc.Provider>
   )
}
