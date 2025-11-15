export interface JwtPayload {
  sub: string;
  email: string;
  rol: string;
}

export interface JwtProvider {
  sign(payload: JwtPayload, expiresIn?: string): string;
  verify(token: string): JwtPayload;
}

