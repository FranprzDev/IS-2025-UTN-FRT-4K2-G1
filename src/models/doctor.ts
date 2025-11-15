import { Persona } from "./persona.js";
import { Cuil } from "./valueobjects/cuil.js";
import { Email } from "./valueobjects/email.js";

export class Doctor extends Persona {
  private matricula: string;

  public constructor(
    cuil: Cuil,
    nombre: string,
    apellido: string,
    email: Email,
    matricula: string,
  ) {
    super(cuil, nombre, apellido, email);
    this.matricula = matricula;
  }

  get Matricula(): string {
    return this.matricula;
  }
}

