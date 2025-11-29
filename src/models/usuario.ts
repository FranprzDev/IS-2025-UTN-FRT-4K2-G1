import { Email } from "./valueobjects/email.js";

export enum Rol {
  MEDICO = "medico",
  ENFERMERA = "enfermero",
  ADMISION = "administrativo"
}

export class Usuario {
  private id: string;
  private email: Email;
  private passwordHash: string;
  private rol: Rol;

  public constructor(
    id: string,
    email: Email,
    passwordHash: string,
    rol: Rol,
  ) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.rol = rol;
  }

  get Id(): string {
    return this.id;
  }

  get Email(): Email {
    return this.email;
  }

  get PasswordHash(): string {
    return this.passwordHash;
  }

  get Rol(): Rol {
    return this.rol;
  }
}

