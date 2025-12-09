import { Ingreso } from "./ingreso.js";
import { Doctor } from "./doctor.js";

interface AtencionArgs {
  ingreso: Ingreso;
  informe: string;
  doctor: Doctor;
}

export class Atencion {
  private ingreso: Ingreso;
  private informe: string;
  private doctor: Doctor;
  private fecha: Date;

  public constructor(args: AtencionArgs) {
    if (!args.informe || args.informe.trim() === "") {
      throw new Error("Se ha omitido el informe de la atención");
    }
    this.ingreso = args.ingreso;
    this.informe = args.informe.trim();
    this.doctor = args.doctor;
    this.fecha = new Date();
  }

  get Ingreso(): Ingreso {
    return this.ingreso;
  }

  get Doctor(): Doctor {
    return this.doctor;
  }

  get Informe(): string {
    return this.informe;
  }

  get Fecha(): Date {
    return this.fecha;
  }

  public toJSON(): object {
    return {
      ingreso: this.ingreso.toJSON(),
      informe: this.informe,
      doctor: this.doctor,
      fecha: this.fecha,
    };
  }
}



