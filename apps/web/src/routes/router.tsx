import { createRootRouteWithContext, createRouter } from '@tanstack/react-router'

import { RootLayout } from './layout'
import { routers } from './routes'

interface RouterContext {
   auth: string
}

export const rootRoute = createRootRouteWithContext<RouterContext>()({ component: RootLayout })
const routeTree = rootRoute.addChildren([routers.homeRoute, routers.loginRoute])

export const router = createRouter({
   routeTree,
   context: { auth: 'hello' },
})

window.navigate = router.navigate

declare global {
   interface Window {
      navigate: typeof router.navigate
   }
}

// declare module '@tanstack/react-router' {
//    interface Register {
//       router: typeof router
//    }
// }
