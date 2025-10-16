import { Frecuencia } from "./frecuencia.js";

export class FrecuenciaSistolica extends Frecuencia {
  private static readonly RANGO_MINIMO: number = 60;
  private static readonly RANGO_MAXIMO: number = 180;

  public constructor(valor: number) {
    super("frecuencia sistolica", valor, FrecuenciaSistolica.RANGO_MINIMO, FrecuenciaSistolica.RANGO_MAXIMO);
  }
}
