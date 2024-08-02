import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import { Environment } from './src/env/env'

// --------------------plugins--------------------

type Env = Record<string, string>

const envPlugin = (env: Env) => ({
   name: 'env',
   transform: () => {
      Environment.config(env)
   },
})

// --------------------config--------------------

export default defineConfig(({ mode }) => {
   const env = loadEnv(mode, process.cwd())

   return {
      plugins: [envPlugin(env), tsconfigPaths(), react({ babel: { plugins: [['babel-plugin-styled-components']] } })],
      server: {
         host: true,
         proxy: { '/trpc': { target: env.VITE_BACKEND_URL } },
      },
      resolve: { alias: { '@': path.resolve(__dirname, './src') } },
   }
})
