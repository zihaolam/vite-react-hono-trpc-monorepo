import { trpc } from '@/trpc'
import { QueryClient } from '@tanstack/react-query'
import { httpLink } from '@trpc/client/links/httpLink'
import { useState } from 'react'

export const useTrpc = () => {
   const [queryClient] = useState(
      () =>
         new QueryClient({
            defaultOptions: {
               queries: {
                  staleTime: Infinity,
                  refetchOnWindowFocus: false,
               },
            },
         })
   )

   const [trpcClient] = useState(() => trpc.createClient({ links: [httpLink({ url: `/trpc` })] }))

   return {
      queryClient,
      trpcClient,
   }
}
