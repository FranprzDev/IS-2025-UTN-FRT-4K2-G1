import { Frecuencia } from "./frecuencia";

export class FrecuenciaCardiaca extends Frecuencia {
  public constructor(valor: number) {
    super("frecuencia cardíaca", valor);
  }
}
