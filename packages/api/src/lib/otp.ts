import { customAlphabet } from 'nanoid'

export const generateOTP = (size: number) => customAlphabet('1234567890', size)()
