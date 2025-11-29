import { JwtProvider, JwtPayload } from "../../interface/jwtProvider.js";
import jwt from "jsonwebtoken";

export class JwtTokenProvider implements JwtProvider {
  private readonly secret: string;

  public constructor(secret: string) {
    this.secret = secret;
  }

  public sign(payload: JwtPayload, expiresIn: string = "1h"): string {
    return jwt.sign(payload as object, this.secret, { expiresIn: expiresIn as any });
  }

  public verify(token: string): JwtPayload {
    return jwt.verify(token, this.secret) as JwtPayload;
  }
}
