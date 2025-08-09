import bcrypt from 'bcrypt'

const SALT_ROUNDS = 12

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash)
}

export const validatePassword = (password: string): boolean => {
  // Minimum 8 characters, at least one uppercase letter, one lowercase letter, and one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
} 