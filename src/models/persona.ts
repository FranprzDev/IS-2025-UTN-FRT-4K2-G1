import { Email } from "./valueobjects/email.js";
import { Cuil } from "./valueobjects/cuil.js";

export class Persona {
  private cuil: Cuil;
  private nombre: string;
  private apellido: string;
  private email: Email;

  public constructor(
    cuil: Cuil,
    nombre: string,
    apellido: string,
    email: Email,
  ) {
    this.cuil = cuil;
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
  }

  get Cuil(): Cuil {
    return this.cuil;
  }

  get Nombre(): string {
    return this.nombre;
  }

  get Apellido(): string {
    return this.apellido;
  }

  get Email(): Email {
    return this.email;
  }

  public toJSON(): object {
    return {
      cuil: this.cuil,
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
    };
  }
}

