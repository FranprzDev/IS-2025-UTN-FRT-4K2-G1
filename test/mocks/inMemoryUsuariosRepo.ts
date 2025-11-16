import { RepoUsuarios } from "../../src/app/interface/repoUsuarios.js";
import { Usuario } from "../../src/models/usuario.js";
import { Email } from "../../src/models/valueobjects/email.js";

export class InMemoryUsuariosRepo implements RepoUsuarios {
  private usuarios: Map<string, Usuario> = new Map();

  public async buscarPorEmail(email: Email): Promise<Usuario | null> {
    for (const usuario of this.usuarios.values()) {
      if (usuario.Email.Valor === email.Valor) {
        return usuario;
      }
    }
    return null;
  }

  public async guardar(usuario: Usuario): Promise<void> {
    this.usuarios.set(usuario.Id, usuario);
  }

  public guardarEntidad(entidad: Usuario): void {
    this.usuarios.set(entidad.Id, entidad);
  }

  public obtenerPorId(id: string): Usuario | null {
    return this.usuarios.get(id) || null;
  }

  public obtenerTodos(): Usuario[] {
    return Array.from(this.usuarios.values());
  }

  public limpiar(): void {
    this.usuarios.clear();
  }
}

