import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';

export interface AuthUser {
  id: string;
  username: string;
}

function getSecretKey() {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return new TextEncoder().encode(JWT_SECRET);
}

// Constant-time string comparison to prevent timing attacks
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const encoder = new TextEncoder();
  const bufA = encoder.encode(a);
  const bufB = encoder.encode(b);
  let result = 0;
  for (let i = 0; i < bufA.length; i++) {
    result |= bufA[i] ^ bufB[i];
  }
  return result === 0;
}

export async function generateToken(user: AuthUser): Promise<string> {
  return new SignJWT({ id: user.id, username: user.username })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(getSecretKey());
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    if (!token || token.length < 10) {
      return null;
    }
    const { payload } = await jwtVerify(token, getSecretKey());
    return {
      id: payload.id as string,
      username: payload.username as string,
    };
  } catch {
    return null;
  }
}

export async function authenticateUser(
  username: string,
  password: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  if (!JWT_SECRET || !ADMIN_PASSWORD) {
    return { success: false, error: 'Server configuration error. Please contact administrator.' };
  }

  if (timingSafeEqual(username, ADMIN_USERNAME) && timingSafeEqual(password, ADMIN_PASSWORD)) {
    const user: AuthUser = { id: '1', username: ADMIN_USERNAME };
    const token = await generateToken(user);
    return { success: true, token };
  }

  return { success: false, error: 'Invalid credentials' };
}
