export enum NivelEmergenciaCodigo {
  CRITICA = 1,
  EMERGENCIA = 2,
  URGENCIA = 3,
  URGENCIA_MENOR = 4,
  SIN_URGENCIA = 5,
}

export class NivelEmergencia {
  public codigo: NivelEmergenciaCodigo;
  public descripcion: string;

  private constructor(codigo: number, descripcion: string) {
    this.codigo = codigo;
    this.descripcion = descripcion;
  }

  static readonly CRITICA = new NivelEmergencia(
    NivelEmergenciaCodigo.CRITICA,
    "Critica",
  );
  static readonly EMERGENCIA = new NivelEmergencia(
    NivelEmergenciaCodigo.EMERGENCIA,
    "Emergencia",
  );
  static readonly URGENCIA = new NivelEmergencia(
    NivelEmergenciaCodigo.URGENCIA,
    "Urgencia",
  );
  static readonly URGENCIA_MENOR = new NivelEmergencia(
    NivelEmergenciaCodigo.URGENCIA_MENOR,
    "Urgencia Menor",
  );
  static readonly SIN_URGENCIA = new NivelEmergencia(
    NivelEmergenciaCodigo.SIN_URGENCIA,
    "Sin Urgencia",
  );

  public compararCon(otro: NivelEmergencia): number {
    return this.codigo - otro.codigo;
  }

  public tieneNombre(nombre: string): boolean {
    return this.descripcion === nombre;
  }
}
