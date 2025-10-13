import { Frecuencia } from "./frecuencia";

export class FrecuenciaSistolica extends Frecuencia {
  public constructor(valor: number) {
    super("Frecuencia Sistolica", valor);
  }
}
