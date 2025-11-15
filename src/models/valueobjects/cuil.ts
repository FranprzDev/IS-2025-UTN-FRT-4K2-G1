import { InvalidValueError } from "./errors/InvalidValueError.js";

export class Cuil {
  private valor: string;

  public constructor(valor: string) {
    this.validarFormato(valor);
    this.valor = valor;
  }

  private validarFormato(cuil: string): void {
    if (!cuil || (cuil.length !== 11 && cuil.length !== 10)) {
      throw new InvalidValueError("El CUIL debe tener 10 o 11 caracteres");
    }
    if (!/^\d+$/.test(cuil)) {
      throw new InvalidValueError("El CUIL debe contener solo números");
    }
  }

  get Valor(): string {
    return this.valor;
  }

  public formatearConGuiones(): string {
    if (this.valor.length === 11) {
      return `${this.valor.substring(0, 2)}-${this.valor.substring(2, 10)}-${this.valor.substring(10)}`;
    }
    if (this.valor.length === 10) {
      return `${this.valor.substring(0, 2)}-${this.valor.substring(2, 9)}-${this.valor.substring(9)}`;
    }
    return this.valor;
  }
}

