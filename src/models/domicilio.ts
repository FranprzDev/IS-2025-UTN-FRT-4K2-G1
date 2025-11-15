export class Domicilio {
  private calle: string;
  private numero: string;
  private ciudad: string;
  private provincia: string;
  private pais: string;

  public constructor(
    calle: string,
    numero: string,
    ciudad: string,
    provincia: string,
    pais: string,
  ) {
    this.calle = calle;
    this.numero = numero;
    this.ciudad = ciudad;
    this.provincia = provincia;
    this.pais = pais;
  }

  get Calle(): string {
    return this.calle;
  }

  get Numero(): string {
    return this.numero;
  }

  get Ciudad(): string {
    return this.ciudad;
  }

  get Provincia(): string {
    return this.provincia;
  }

  get Pais(): string {
    return this.pais;
  }
}

