import { GlobalStyle } from '@/styles'
import { RouterProvider } from '@tanstack/react-router'

import { router } from './router'

export const App = () => (
   <AppContainer>
      <GlobalStyle />
      <RouterProvider router={router} />
   </AppContainer>
)

const AppContainer = ({ children }: React.PropsWithChildren) => {
   return <div className="min-h-screen">{children}</div>
}
