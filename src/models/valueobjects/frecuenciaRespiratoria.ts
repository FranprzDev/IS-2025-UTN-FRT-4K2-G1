import { Frecuencia } from "./frecuencia.js";

export class FrecuenciaRespiratoria extends Frecuencia {
  private static readonly RANGO_MINIMO: number = 8;
  private static readonly RANGO_MAXIMO: number = 60;

  public constructor(valor: number) {
    super("frecuencia respiratoria", valor, FrecuenciaRespiratoria.RANGO_MINIMO, FrecuenciaRespiratoria.RANGO_MAXIMO);
  }
}
