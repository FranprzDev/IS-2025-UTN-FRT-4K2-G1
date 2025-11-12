import bcrypt from "bcryptjs";
import { PasswordHasher } from "../interface/passwordHasher.js";

export class BcryptPasswordHasher implements PasswordHasher {
  private readonly saltRounds: number = 10;

  public async hash(plainPassword: string): Promise<string> {
    return await bcrypt.hash(plainPassword, this.saltRounds);
  }

  public async compare(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

