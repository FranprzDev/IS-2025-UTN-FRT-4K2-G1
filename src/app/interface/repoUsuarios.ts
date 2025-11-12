import { Usuario } from "../../models/usuario.js";
import { Email } from "../../models/valueobjects/email.js";

export interface RepoUsuarios {
  findByEmail(email: Email): Promise<Usuario | null>;
  save(usuario: Usuario): Promise<void>;
}

