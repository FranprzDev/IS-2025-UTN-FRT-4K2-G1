import { RepoPacientes } from "../interface/repoPacientes.js";
import { Ingreso } from "../../models/ingreso.js";
import { Enfermera } from "../../models/enfermera.js";
import { NivelEmergencia } from "../../models/nivelEmergencia.js";
import { Temperatura } from "../../models/valueobjects/temperatura.js";
import { FrecuenciaCardiaca } from "../../models/valueobjects/frecuenciaCardiaca.js";
import { FrecuenciaRespiratoria } from "../../models/valueobjects/frecuenciaRespiratoria.js";
import { TensionArterial } from "../../models/valueobjects/tensionArterial.js";

interface RegistrarUrgenciaArgs {
  cuil: string;
  enfermera: Enfermera;
  informe: string;
  nivelEmergencia: NivelEmergencia;
  temperatura: number;
  frecuenciaCardiaca: number;
  frecuenciaRespiratoria: number;
  frecuenciaSistolica: number;
  frecuenciaDiastolica: number;
}

export class UrgenciaService {
  private repoPacientes: RepoPacientes;
  private listaEspera: Ingreso[] = [];

  public constructor(repoPacientes: RepoPacientes) {
    this.repoPacientes = repoPacientes;
  }

  public registrarUrgencia({
    cuil,
    enfermera,
    informe,
    nivelEmergencia,
    temperatura,
    frecuenciaCardiaca,
    frecuenciaRespiratoria,
    frecuenciaSistolica,
    frecuenciaDiastolica,
  }: RegistrarUrgenciaArgs): void {
    new Temperatura(temperatura);
    new FrecuenciaCardiaca(frecuenciaCardiaca);
    new FrecuenciaRespiratoria(frecuenciaRespiratoria);
    new TensionArterial(frecuenciaSistolica, frecuenciaDiastolica);

    const paciente = this.repoPacientes.obtenerPacientePorCuil(cuil);

    const ingreso = new Ingreso({
      paciente,
      enfermera,
      informe,
      nivelEmergencia,
      temperatura,
      frecuenciaCardiaca,
      frecuenciaRespiratoria,
      frecuenciaSistolica,
      frecuenciaDiastolica,
    });

    this.listaEspera.push(ingreso);
    this.listaEspera.sort((a, b) => a.compararCon(b));
  }

  public obtenerIngresosPendientes(): Ingreso[] {
    return [...this.listaEspera];
  }
}
