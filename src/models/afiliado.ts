import { ObraSocial } from "./obraSocial.js";

export class Afiliado {
  private obraSocial: ObraSocial;
  private numeroAfiliado: string;

  public constructor(obraSocial: ObraSocial, numeroAfiliado: string) {
    this.obraSocial = obraSocial;
    this.numeroAfiliado = numeroAfiliado;
  }

  get ObraSocial(): ObraSocial {
    return this.obraSocial;
  }

  get NumeroAfiliado(): string {
    return this.numeroAfiliado;
  }
}

