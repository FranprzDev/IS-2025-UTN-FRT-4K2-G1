import { Paciente } from "../../models/paciente.js";
import { RepoPacientes } from "../../app/interface/repoPacientes.js";
import { Cuil } from "../../models/valueobjects/cuil.js";

export class DBPruebaEnMemoria implements RepoPacientes {
  private pacientes: Map<string, Paciente> = new Map();

  public guardarPaciente(paciente: Paciente): void {
    this.pacientes.set(paciente.Cuil.Valor, paciente);
  }

  public guardar(entidad: Paciente): void {
    this.pacientes.set(entidad.Cuil.Valor, entidad);
  }

  public obtenerPorId(id: string): Paciente | null {
    return this.pacientes.get(id) || null;
  }

  public obtenerTodos(): Paciente[] {
    return Array.from(this.pacientes.values());
  }

  public obtenerPacientePorCuil(cuil: string): Paciente {
    const cuilNormalizado: string = cuil.replace(/-/g, "");
    const cuilObj: Cuil = new Cuil(cuilNormalizado);
    const paciente: Paciente | undefined = this.pacientes.get(cuilObj.Valor);
    if (!paciente) {
      throw new Error(`Paciente con CUIL ${cuilObj.formatearConGuiones()} no encontrado`);
    }
    return paciente;
  }
}
