import { cleanEnv, str as string } from 'envalid'

export class Environment {
   public static config(env: unknown) {
      return cleanEnv(env, {
         VITE_BACKEND_URL: string({
            desc: 'Port the backend server is running on',
            example: 'http://localhost:3001',
         }),
         MODE: string({
            desc: 'The mode the web is running in',
            example: 'development',
            choices: ['development', 'test', 'production'] as const,
            default: 'development',
            docs: 'https://vitejs.dev/guide/env-and-mode.html',
         }),
      })
   }
}
