import { Paciente } from "../../models/paciente.js";
import { IRepositorio } from "./iRepositorio.js";

export interface RepoPacientes extends IRepositorio<Paciente> {
  obtenerPacientePorCuil(cuil: string): Paciente;
  guardarPaciente(paciente: Paciente): void;
}
