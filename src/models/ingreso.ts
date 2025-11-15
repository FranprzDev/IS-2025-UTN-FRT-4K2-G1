import { Paciente } from "./paciente.js";
import { Enfermera } from "./enfermera.js";
import { NivelEmergencia } from "./nivelEmergencia.js";
import { EstadoIngreso } from "./estadoIngreso.js";
import { TensionArterial } from "./valueobjects/tensionArterial.js";
import { FrecuenciaCardiaca } from "./valueobjects/frecuenciaCardiaca.js";
import { FrecuenciaRespiratoria } from "./valueobjects/frecuenciaRespiratoria.js";
import { Temperatura } from "./valueobjects/temperatura.js";

interface IngresoArgs {
  paciente: Paciente;
  enfermera: Enfermera;
  informe: string;
  nivelEmergencia: NivelEmergencia;
  estado?: EstadoIngreso;
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
  private estado: EstadoIngreso;
  private temperatura: Temperatura;
  private frecuenciaCardiaca: FrecuenciaCardiaca;
  private frecuenciaRespiratoria: FrecuenciaRespiratoria;
  private tensionArterial: TensionArterial;

  public constructor(args: IngresoArgs) {
    this.paciente = args.paciente;
    this.enfermera = args.enfermera;
    this.fechaIngreso = new Date();
    this.informe = args.informe;
    this.nivelEmergencia = args.nivelEmergencia;
    this.estado = args.estado || EstadoIngreso.PENDIENTE;
    this.temperatura = new Temperatura(args.temperatura);
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
    return this.paciente.Cuil.formatearConGuiones();
  }

  get NivelEmergencia(): NivelEmergencia {
    return this.nivelEmergencia;
  }

  get FechaIngreso(): Date {
    return this.fechaIngreso;
  }

  get Estado(): EstadoIngreso {
    return this.estado;
  }

  public cambiarEstado(nuevoEstado: EstadoIngreso): void {
    this.estado = nuevoEstado;
  }
}
