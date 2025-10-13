import { Frecuencia } from "./frecuencia.js";

export class FrecuenciaDiastolica extends Frecuencia {
  public constructor(valor: number) {
    super("Frecuencia Diastolica", valor);
  }
}
