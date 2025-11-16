import { Usuario } from "../../models/usuario.js";
import { Email } from "../../models/valueobjects/email.js";
import { IRepositorio } from "./iRepositorio.js";

export interface RepoUsuarios extends IRepositorio<Usuario> {
  buscarPorEmail(email: Email): Promise<Usuario | null>;
  guardar(usuario: Usuario): Promise<void>;
}

