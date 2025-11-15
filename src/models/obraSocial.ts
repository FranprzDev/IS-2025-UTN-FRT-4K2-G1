export class ObraSocial {
  private id: string;
  private nombre: string;

  public constructor(id: string, nombre: string) {
    this.id = id;
    this.nombre = nombre;
  }

  get Id(): string {
    return this.id;
  }

  get Nombre(): string {
    return this.nombre;
  }
}

