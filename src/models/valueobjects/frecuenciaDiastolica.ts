import { Frecuencia } from "./frecuencia";

export class FrecuenciaDiastolica extends Frecuencia {
  public constructor(valor: number) {
    super("Frecuencia Diastolica", valor);
  }
}
