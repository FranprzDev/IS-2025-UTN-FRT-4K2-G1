export class PacienteError extends Error {
  public constructor(mensaje: string) {
    super(mensaje);
    this.name = "PacienteError";
  }
}

