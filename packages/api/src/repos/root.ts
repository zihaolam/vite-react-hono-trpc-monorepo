import { AuthRepo } from './auth'

export class RootRepo {
   auth: AuthRepo

   constructor() {
      this.auth = new AuthRepo(this)
   }
}
