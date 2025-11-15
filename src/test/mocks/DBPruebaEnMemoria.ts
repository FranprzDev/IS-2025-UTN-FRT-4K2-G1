import { Paciente } from "../../models/paciente.js";
import { RepoPacientes } from "../../app/interface/repoPacientes.js";
import { Cuil } from "../../models/valueobjects/cuil.js";

export class DBPruebaEnMemoria implements RepoPacientes {
  private pacientes: Map<string, Paciente> = new Map();

  public guardarPaciente(paciente: Paciente): void {
    this.pacientes.set(paciente.Cuil.Valor, paciente);
  }

  public obtenerPacientePorCuil(cuil: string): Paciente {
    const paciente = this.pacientes.get(cuil);
    if (!paciente) {
      const cuilObj = new Cuil(cuil);
      throw new Error(`Paciente con CUIL ${cuilObj.formatearConGuiones()} no encontrado`);
    }
    return paciente;
  }
}
