import { Hono } from 'hono'

export class HttpServer {
   public static create() {
      const app = new Hono()

      return { app }
   }
}
