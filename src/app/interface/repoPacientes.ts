import { Paciente } from "../../models/paciente";

export interface RepoPacientes {
  obtenerPacientePorCuil(cuil: string): Paciente;
  guardarPaciente(paciente: Paciente): void;
}
