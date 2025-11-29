import { PasswordHasher } from "../../interface/passwordHasher.js";
import bcrypt from "bcryptjs";

export class BcryptPasswordHasher implements PasswordHasher {
  public async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  public async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
