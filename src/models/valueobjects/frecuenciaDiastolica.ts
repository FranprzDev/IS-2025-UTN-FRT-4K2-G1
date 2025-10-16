import { Frecuencia } from "./frecuencia.js";

export class FrecuenciaDiastolica extends Frecuencia {
  private static readonly RANGO_MINIMO: number = 40;
  private static readonly RANGO_MAXIMO: number = 120;

  public constructor(valor: number) {
    super("frecuencia diastolica", valor, FrecuenciaDiastolica.RANGO_MINIMO, FrecuenciaDiastolica.RANGO_MAXIMO);
  }
}
