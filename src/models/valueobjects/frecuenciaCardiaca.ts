import { Frecuencia } from "./frecuencia.js";

export class FrecuenciaCardiaca extends Frecuencia {
  private static readonly RANGO_MINIMO: number = 40;
  private static readonly RANGO_MAXIMO: number = 200;

  public constructor(valor: number) {
    super("frecuencia cardíaca", valor, FrecuenciaCardiaca.RANGO_MINIMO, FrecuenciaCardiaca.RANGO_MAXIMO);
  }
}
