import type { Session, User } from 'lucia'

export type { Session, User }

export type AuthenticatedUser = {
   user: User
   session: Session
}
export type UnauthenticatedUser = {
   user: null
   session: null
}
export type AuthObj = AuthenticatedUser | UnauthenticatedUser
