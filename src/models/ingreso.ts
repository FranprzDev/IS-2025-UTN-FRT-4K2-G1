import { Paciente } from "./paciente";
import { Enfermera } from "./enfermera";
import { NivelEmergencia } from "./nivelEmergencia";
import { TensionArterial } from "./valueobjects/tensionArterial";
import { FrecuenciaCardiaca } from "./valueobjects/frecuenciaCardiaca";
import { FrecuenciaRespiratoria } from "./valueobjects/frecuenciaRespiratoria";

interface IngresoArgs {
  paciente: Paciente;
  enfermera: Enfermera;
  informe: string;
  nivelEmergencia: NivelEmergencia;
  temperatura: number;
  frecuenciaCardiaca: number;
  frecuenciaRespiratoria: number;
  frecuenciaSistolica: number;
  frecuenciaDiastolica: number;
}

export class Ingreso {
  private paciente: Paciente;
  private enfermera: Enfermera;
  private fechaIngreso: Date;
  private informe: string;
  private nivelEmergencia: NivelEmergencia;
  private temperatura: number;
  private frecuenciaCardiaca: FrecuenciaCardiaca;
  private frecuenciaRespiratoria: FrecuenciaRespiratoria;
  private tensionArterial: TensionArterial;

  public constructor(args: IngresoArgs) {
    this.paciente = args.paciente;
    this.enfermera = args.enfermera;
    this.fechaIngreso = new Date();
    this.informe = args.informe;
    this.nivelEmergencia = args.nivelEmergencia;
    this.temperatura = args.temperatura;
    this.frecuenciaCardiaca = new FrecuenciaCardiaca(args.frecuenciaCardiaca);
    this.frecuenciaRespiratoria = new FrecuenciaRespiratoria(
      args.frecuenciaRespiratoria,
    );
    this.tensionArterial = new TensionArterial(
      args.frecuenciaSistolica,
      args.frecuenciaDiastolica,
    );
  }

  public compararCon(ingreso: Ingreso): number {
    const comparacion = this.nivelEmergencia.compararCon(
      ingreso.nivelEmergencia,
    );

    if (comparacion === 0) {
      return this.fechaIngreso.getTime() - ingreso.fechaIngreso.getTime();
    }
    return comparacion;
  }

  get CuilPaciente(): string {
    return this.paciente.Cuil;
  }

  get NivelEmergencia(): NivelEmergencia {
    return this.nivelEmergencia;
  }

  get FechaIngreso(): Date {
    return this.fechaIngreso;
  }
}
