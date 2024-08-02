import type { ColumnType } from 'kysely'

import type { UserRole } from './enums'

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
   ? ColumnType<S, I | undefined, U>
   : ColumnType<T, T | undefined, T>
export type Timestamp = ColumnType<Date, Date | string, Date | string>

export type EmailVerificationToken = {
   email: string
   expiresAt: Timestamp
   token: string
   createdAt: Generated<Timestamp>
}
export type Session = {
   id: string
   userId: string
   expiresAt: Timestamp
}
export type User = {
   id: string
   hashedPassword: string
   email: string
   createdAt: Generated<Timestamp>
   deactivatedAt: Timestamp | null
   emailVerifiedAt: Timestamp | null
   role: Generated<UserRole>
}
export type DB = {
   EmailVerificationToken: EmailVerificationToken
   Session: Session
   User: User
}
