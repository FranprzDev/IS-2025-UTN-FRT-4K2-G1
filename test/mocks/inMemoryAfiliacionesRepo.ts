import { RepoAfiliaciones, Afiliacion } from "../../src/app/interface/repoAfiliaciones.js";

export class InMemoryAfiliacionesRepo implements RepoAfiliaciones {
  private afiliaciones: Map<string, Afiliacion> = new Map();

  public guardar(entidad: Afiliacion): void {
    const clave: string = this.generarClave(entidad.cuil, entidad.nombreObraSocial);
    this.afiliaciones.set(clave, entidad);
  }

  public obtenerPorId(id: string): Afiliacion | null {
    return this.afiliaciones.get(id) || null;
  }

  public obtenerTodos(): Afiliacion[] {
    return Array.from(this.afiliaciones.values());
  }

  public estaAfiliado(cuil: string, nombreObraSocial: string, numeroAfiliado: string): boolean {
    const clave: string = this.generarClave(cuil, nombreObraSocial);
    const afiliacion: Afiliacion | undefined = this.afiliaciones.get(clave);
    return afiliacion !== undefined && afiliacion.numeroAfiliado === numeroAfiliado;
  }

  private generarClave(cuil: string, nombreObraSocial: string): string {
    return `${cuil}-${nombreObraSocial}`;
  }
}

