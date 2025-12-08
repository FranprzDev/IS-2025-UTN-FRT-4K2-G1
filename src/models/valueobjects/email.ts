import { InvalidValueError } from "./errors/InvalidValueError.js";

export class Email {
  private valor: string;

  public constructor(valor: string) {
    const normalizado: string = valor.trim().toLowerCase();
    this.validarFormato(normalizado);
    this.valor = normalizado;
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

