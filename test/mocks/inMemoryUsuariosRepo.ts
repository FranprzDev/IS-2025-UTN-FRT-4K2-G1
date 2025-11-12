import { RepoUsuarios } from "../../src/app/interface/repoUsuarios.js";
import { Usuario } from "../../src/models/usuario.js";
import { Email } from "../../src/models/valueobjects/email.js";

export class InMemoryUsuariosRepo implements RepoUsuarios {
  private usuarios: Map<string, Usuario> = new Map();

  public async findByEmail(email: Email): Promise<Usuario | null> {
    for (const usuario of this.usuarios.values()) {
      if (usuario.Email.Valor === email.Valor) {
        return usuario;
      }
    }
    return null;
  }

  public async save(usuario: Usuario): Promise<void> {
    this.usuarios.set(usuario.Id, usuario);
  }

  public limpiar(): void {
    this.usuarios.clear();
  }
}

