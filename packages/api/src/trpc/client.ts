import { createTRPCProxyClient, httpLink } from '@trpc/client'

import { HttpService } from '@luda/config/src'

import { type AppRouter } from './router'

export const client = createTRPCProxyClient<AppRouter>({ links: [httpLink({ url: `${HttpService.serverUrl}/trpc` })] })
