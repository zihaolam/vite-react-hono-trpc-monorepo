import type { RootRepo } from './root'

export class BaseRepo {
   protected root: RootRepo
   constructor(root: RootRepo) {
      this.root = root
   }
}
