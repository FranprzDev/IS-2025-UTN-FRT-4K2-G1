import { FrecuenciaDiastolica } from "./frecuenciaDiastolica";
import { FrecuenciaSistolica } from "./frecuenciaSistolica";

export class TensionArterial {
  sistolica: FrecuenciaSistolica;
  diastolica: FrecuenciaDiastolica;

  public constructor(sistolica: number, diastolica: number) {
    this.sistolica = new FrecuenciaSistolica(sistolica);
    this.diastolica = new FrecuenciaDiastolica(diastolica);
  }
}
