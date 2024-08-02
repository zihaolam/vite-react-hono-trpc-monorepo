import { createRoute } from '@tanstack/react-router'

import { Label } from '@luda/ui'

import { rootRoute } from '../router'

const RouteComponent = () => {
   return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[linear-gradient(to right, #434343, #000000)]">
         <Label>Current role: </Label>
      </div>
   )
}

const route = createRoute({
   getParentRoute: () => rootRoute,
   path: '/',
   component: RouteComponent,
})

export { route as homeRoute }
