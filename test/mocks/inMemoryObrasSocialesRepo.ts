import { RepoObrasSociales } from "../../src/app/interface/repoObrasSociales.js";
import { ObraSocial } from "../../src/models/obraSocial.js";

export class InMemoryObrasSocialesRepo implements RepoObrasSociales {
  private obrasSociales: Map<string, ObraSocial> = new Map();

  public guardar(entidad: ObraSocial): void {
    this.obrasSociales.set(entidad.Id, entidad);
  }

  public obtenerPorId(id: string): ObraSocial | null {
    return this.obrasSociales.get(id) || null;
  }

  public obtenerTodos(): ObraSocial[] {
    return Array.from(this.obrasSociales.values());
  }

  public obtenerPorNombre(nombre: string): ObraSocial | null {
    for (const obraSocial of this.obrasSociales.values()) {
      if (obraSocial.Nombre === nombre) {
        return obraSocial;
      }
    }
    return null;
  }

  public existe(nombre: string): boolean {
    return this.obtenerPorNombre(nombre) !== null;
  }
}

