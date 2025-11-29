import { InvalidValueError } from "./errors/InvalidValueError.js";

export class Email {
  private valor: string;

  public constructor(valor: string) {
    this.validarFormato(valor);
    this.valor = valor;
  }

  private validarFormato(email: string): void {
    const regexEmail: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
      throw new InvalidValueError("El email no tiene un formato válido");
    }
  }

  get Valor(): string {
    return this.valor;
  }

  public toJSON(): object {
    return { valor: this.valor };
  }
}

