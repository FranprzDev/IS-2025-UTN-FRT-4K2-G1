import { FrecuenciaDiastolica } from "./frecuenciaDiastolica.js";
import { FrecuenciaSistolica } from "./frecuenciaSistolica.js";

export class TensionArterial {
  sistolica: FrecuenciaSistolica;
  diastolica: FrecuenciaDiastolica;

  public constructor(sistolica: number, diastolica: number) {
    this.sistolica = new FrecuenciaSistolica(sistolica);
    this.diastolica = new FrecuenciaDiastolica(diastolica);
  }
}
