import { Frecuencia } from "./frecuencia.js";

export class FrecuenciaSistolica extends Frecuencia {
  public constructor(valor: number) {
    super("Frecuencia Sistolica", valor);
  }
}
