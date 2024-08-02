import { createRoute } from '@tanstack/react-router'

import { rootRoute } from '../router'

const RouteComponent = () => {
   return <div>Login</div>
}

const route = createRoute({
   getParentRoute: () => rootRoute,
   path: '/login',
   component: RouteComponent,
})

export { route as loginRoute }
