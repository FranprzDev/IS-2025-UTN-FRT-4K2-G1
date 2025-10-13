import { RepoPacientes } from "../interface/repoPacientes.js";
import { Ingreso } from "../../models/ingreso.js";
import { Enfermera } from "../../models/enfermera.js";
import { NivelEmergencia } from "../../models/nivelEmergencia.js";

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
