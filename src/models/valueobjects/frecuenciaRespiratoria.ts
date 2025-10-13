import { Frecuencia } from "./frecuencia.js";

export class FrecuenciaRespiratoria extends Frecuencia {
  public constructor(valor: number) {
    super("frecuencia respiratoria", valor);
  }
}
