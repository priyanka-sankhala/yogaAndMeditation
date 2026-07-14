import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'your-secret-key';

export interface TokenPayload {
  userId: string;
  email: string;
  role?: string;
}

export async function createToken(
  payload: TokenPayload,
  expiresIn: string = '24h'
): Promise<string> {
  return jwt.sign(payload, secret, { expiresIn });
}

export async function verifyToken(token: string): Promise<TokenPayload> {
  return jwt.verify(token, secret) as TokenPayload;
}

export async function decodeToken(token: string): Promise<TokenPayload | null> {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch (error) {
    return null;
  }
}
