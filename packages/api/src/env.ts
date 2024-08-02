import { cleanEnv, str } from 'envalid'

export const env = cleanEnv(process.env, {
   SERVER_PORT: str({
      desc: 'Port the backend server is running on',
      example: '3001',
   }),
   CLIENT_URL: str({
      desc: 'The url of the client',
      example: 'localhost:3000',
   }),
   DATABASE_URL: str({
      desc: 'The url of the database',
      example: 'postgresql',
   }),
   CLOUDFLARE_TURNSTILE_SECRET_KEY: str({ desc: 'The secret key to verify cloudflare turnstile' }),
   NODE_ENV: str({
      desc: 'The mode the server is running in',
      example: 'development',
      choices: ['development', 'test', 'production'] as const,
      default: 'development',
      docs: 'https://nodejs.dev/en/learn/how-to-read-environment-variables-from-nodejs/',
   }),
   JWT_SECRET: str({ desc: 'The secret key for jwt' }),
   JWT_ALG: str({ desc: 'The algorithm for jwt' }),
})
