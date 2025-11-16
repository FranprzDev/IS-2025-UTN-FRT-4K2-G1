import { InvalidValueError } from "./errors/InvalidValueError.js";

export class NumeroAfiliado {
  private valor: string;

  public constructor(valor: string) {
    this.validarValor(valor);
    this.valor = valor;
  }

  private validarValor(valor: string): void {
    if (!valor || valor.trim() === "") {
      throw new InvalidValueError("El número de afiliado no puede estar vacío");
    }
  }

  get Valor(): string {
    return this.valor;
  }
}

