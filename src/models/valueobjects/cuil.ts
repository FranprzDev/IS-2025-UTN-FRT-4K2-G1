import { InvalidValueError } from "./errors/InvalidValueError.js";

export class Cuil {
  private valor: string;

  public constructor(valor: string) {
    this.validarFormato(valor);
    this.valor = valor;
  }

  private validarFormato(cuil: string): void {
    if (!cuil || cuil.length !== 11) {
      throw new InvalidValueError("El CUIL debe tener 11 caracteres");
    }
    if (!/^\d{11}$/.test(cuil)) {
      throw new InvalidValueError("El CUIL debe contener solo números");
    }
  }

  get Valor(): string {
    return this.valor;
  }
}

