import { InvalidValueError } from "./valueobjects/errors/InvalidValueError.js";

export class Domicilio {
  private calle: string;
  private numero: string;
  private localidad: string;

  public constructor(
    calle: string,
    numero: string,
    localidad: string,
  ) {
    this.validarCalle(calle);
    this.validarNumero(numero);
    this.validarLocalidad(localidad);
    this.calle = calle;
    this.numero = numero;
    this.localidad = localidad;
  }

  private validarCalle(calle: string): void {
    if (!calle || calle.trim() === "") {
      throw new InvalidValueError("La calle no puede estar vacía");
    }
  }

  private validarNumero(numero: string): void {
    if (!numero || numero.trim() === "") {
      throw new InvalidValueError("El número no puede estar vacío");
    }
  }

  private validarLocalidad(localidad: string): void {
    if (!localidad || localidad.trim() === "") {
      throw new InvalidValueError("La localidad no puede estar vacía");
    }
  }

  get Calle(): string {
    return this.calle;
  }

  get Numero(): string {
    return this.numero;
  }

  get Localidad(): string {
    return this.localidad;
  }
}

