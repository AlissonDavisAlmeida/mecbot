export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  empresaId: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
  empresaId: string;
}
