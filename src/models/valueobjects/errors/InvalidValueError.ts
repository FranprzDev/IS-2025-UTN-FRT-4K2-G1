export class InvalidValueError extends Error {
  public constructor(mensaje: string) {
    super(mensaje);
    this.name = "InvalidValueError";
  }
}

