import { Paciente } from "../../models/paciente";
import { RepoPacientes } from "../../app/interface/repoPacientes";

export class DBPruebaEnMemoria implements RepoPacientes {
  private pacientes: Map<string, Paciente> = new Map();

  public guardarPaciente(paciente: Paciente): void {
    this.pacientes.set(paciente.Cuil, paciente);
  }

  public obtenerPacientePorCuil(cuil: string): Paciente {
    const paciente = this.pacientes.get(cuil);
    if (!paciente) {
      throw new Error(`Paciente con CUIL ${cuil} no encontrado`);
    }
    return paciente;
  }
}
