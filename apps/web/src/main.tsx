import { Providers } from '@/components/shared'
import '@/styles/shadcn.css'
import ReactDOM from 'react-dom/client'

import { App } from './routes/app'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
   <Providers>
      <App />
   </Providers>
)
