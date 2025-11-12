import jwt from "jsonwebtoken";
import { JwtProvider, JwtPayload } from "../interface/jwtProvider.js";

export class JwtService implements JwtProvider {
  private readonly secret: string;
  private readonly defaultExpiresIn: string = "60m";

  public constructor(secret?: string) {
    const secretValue: string = secret || process.env.JWT_SECRET || "";
    if (!secretValue) {
      throw new Error("JWT_SECRET no está configurado");
    }
    this.secret = secretValue;
  }

  public sign(payload: JwtPayload, expiresIn?: string): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: expiresIn || this.defaultExpiresIn,
    });
  }

  public verify(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.secret) as JwtPayload;
    } catch (error) {
      throw new Error("Token inválido");
    }
  }
}

