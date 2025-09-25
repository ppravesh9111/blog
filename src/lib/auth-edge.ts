// Edge Runtime compatible JWT utilities
// This file uses jose library which supports Edge Runtime

import { jwtVerify } from 'jose';

export interface AuthUser {
  id: string;
  username: string;
}

// JWT verification using jose library (Edge Runtime compatible)
export async function verifyTokenEdge(token: string): Promise<AuthUser | null> {
  try {
    if (!token || token.length < 10) {
      return null;
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    return {
      id: payload.id as string,
      username: payload.username as string
    };
  } catch (error) {
    console.log('Token verification error:', error);
    return null;
  }
}

// Fallback simple JWT verification for Edge Runtime (without external dependencies)
export function verifyTokenEdgeSimple(token: string): AuthUser | null {
  try {
    if (!token || token.length < 10) {
      return null;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (middle part)
    const payload = parts[1];
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const user = JSON.parse(decodedPayload);

    // Check if token is expired
    if (user.exp && user.exp < Date.now() / 1000) {
      return null;
    }

    return {
      id: user.id,
      username: user.username
    };
  } catch (error) {
    console.log('Token verification error:', error);
    return null;
  }
}
