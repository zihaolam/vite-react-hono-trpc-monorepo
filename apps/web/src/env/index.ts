import { Environment } from './env'

export const { MODE, VITE_BACKEND_URL } = Environment.config(import.meta.env)
