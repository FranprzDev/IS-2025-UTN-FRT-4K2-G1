import { RepoUsuarios } from "../../interface/repoUsuarios.js";
import { Usuario } from "../../../models/usuario.js";
import { Email } from "../../../models/valueobjects/email.js";

export class InMemoryRepoUsuarios implements RepoUsuarios {
  private usuarios: Map<string, Usuario> = new Map();

  public async guardar(usuario: Usuario): Promise<void> {
    this.usuarios.set(usuario.Email.Valor, usuario);
  }

  public async buscarPorEmail(email: Email): Promise<Usuario | null> {
    return this.usuarios.get(email.Valor) || null;
  }

  public obtenerPorId(id: string): Usuario | null {
    for (const usuario of this.usuarios.values()) {
      if (usuario.Id === id) return usuario;
    }
    return null;
  }

  public obtenerTodos(): Usuario[] {
    return Array.from(this.usuarios.values());
  }
}
