import { Frecuencia } from "./frecuencia.js";

export class FrecuenciaCardiaca extends Frecuencia {
  public constructor(valor: number) {
    super("frecuencia cardíaca", valor);
  }
}
