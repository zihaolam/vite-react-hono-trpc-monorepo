import { createTRPCReact } from '@trpc/react-query'

import { type AppRouter } from '@luda/api/trpc'

export const trpc = createTRPCReact<AppRouter>()
