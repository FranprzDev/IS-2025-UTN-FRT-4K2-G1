import { Persona } from "./persona.js";
import { Cuil } from "./valueobjects/cuil.js";
import { Email } from "./valueobjects/email.js";
import { Afiliado } from "./afiliado.js";
import { Domicilio } from "./domicilio.js";

export class Paciente extends Persona {
  private afiliado: Afiliado;
  private domicilio: Domicilio;

  public constructor(
    cuil: Cuil,
    nombre: string,
    apellido: string,
    email: Email,
    afiliado: Afiliado,
    domicilio: Domicilio,
  ) {
    super(cuil, nombre, apellido, email);
    this.afiliado = afiliado;
    this.domicilio = domicilio;
  }

  get Afiliado(): Afiliado {
    return this.afiliado;
  }

  get Domicilio(): Domicilio {
    return this.domicilio;
  }
}
