// Edge Runtime compatible JWT verification using jose
// Re-exports from auth.ts since both now use jose

export { verifyToken as verifyTokenEdge } from './auth';
export type { AuthUser } from './auth';
