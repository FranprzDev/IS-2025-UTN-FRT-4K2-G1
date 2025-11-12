export class AuthError extends Error {
  public constructor(mensaje: string) {
    super(mensaje);
    this.name = "AuthError";
  }
}

