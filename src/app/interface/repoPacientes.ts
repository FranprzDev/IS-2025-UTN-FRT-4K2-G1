import { Paciente } from "../../models/paciente.js";

export interface RepoPacientes {
  obtenerPacientePorCuil(cuil: string): Paciente;
  guardarPaciente(paciente: Paciente): void;
}
