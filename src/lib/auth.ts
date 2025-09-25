import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';

export interface AuthUser {
  id: string;
  username: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: AuthUser): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): AuthUser | null {
  try {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }
    
    if (!token || token.length < 10) {
      return null;
    }
    
    // Properly verify the JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    console.log('Token verification error:', error);
    return null;
  }
}

export async function authenticateUser(username: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  // Check if environment variables are set
  if (!JWT_SECRET || !ADMIN_PASSWORD) {
    return { success: false, error: 'Server configuration error. Please contact administrator.' };
  }
  
  // For simplicity, we'll use a single admin user
  // In production, you might want to store this in a database
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const user: AuthUser = { id: '1', username: ADMIN_USERNAME };
    const token = generateToken(user);
    return { success: true, token };
  }
  
  return { success: false, error: 'Invalid credentials' };
}
