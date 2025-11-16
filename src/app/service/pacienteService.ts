import { Paciente } from "../../models/paciente.js";
import { RepoPacientes } from "../interface/repoPacientes.js";
import { RepoObrasSociales } from "../interface/repoObrasSociales.js";
import { RepoAfiliaciones } from "../interface/repoAfiliaciones.js";
import { Cuil } from "../../models/valueobjects/cuil.js";
import { Email } from "../../models/valueobjects/email.js";
import { Domicilio } from "../../models/domicilio.js";
import { ObraSocial } from "../../models/obraSocial.js";
import { Afiliado } from "../../models/afiliado.js";
import { NumeroAfiliado } from "../../models/valueobjects/numeroAfiliado.js";
import { PacienteError } from "./errors/pacienteError.js";

interface RegistrarPacienteArgs {
  cuil: string;
  apellido: string;
  nombre: string;
  calle: string;
  numero: string;
  localidad: string;
  nombreObraSocial?: string;
  numeroAfiliado?: string;
}

export class PacienteService {
  public constructor(
    private readonly repoPacientes: RepoPacientes,
    private readonly repoObrasSociales: RepoObrasSociales,
    private readonly repoAfiliaciones: RepoAfiliaciones,
  ) {}

  public registrarPaciente(args: RegistrarPacienteArgs): Paciente {
    this.validarCamposObligatorios(args);

    if (args.nombreObraSocial) {
      this.validarObraSocial(args);
    }

    const cuil: Cuil = new Cuil(args.cuil);
    const email: Email = new Email(`${args.nombre.toLowerCase()}.${args.apellido.toLowerCase()}@example.com`);
    const domicilio: Domicilio = new Domicilio(args.calle, args.numero, args.localidad);

    let afiliado: Afiliado | null = null;
    if (args.nombreObraSocial && args.numeroAfiliado) {
      const obraSocial: ObraSocial | null = this.repoObrasSociales.obtenerPorNombre(args.nombreObraSocial);
      if (!obraSocial) {
        throw new PacienteError("No se puede registrar al paciente con una obra social inexistente");
      }
      const numeroAfiliado: NumeroAfiliado = new NumeroAfiliado(args.numeroAfiliado);
      afiliado = new Afiliado(obraSocial, numeroAfiliado.Valor);
    }

    const paciente: Paciente = new Paciente(cuil, args.nombre, args.apellido, email, afiliado, domicilio);
    this.repoPacientes.guardarPaciente(paciente);

    return paciente;
  }

  private validarCamposObligatorios(args: RegistrarPacienteArgs): void {
    if (!args.cuil || args.cuil.trim() === "") {
      throw new PacienteError("Se debe completar el campo: Cuil");
    }
    if (!args.apellido || args.apellido.trim() === "") {
      throw new PacienteError("Se debe completar el campo: Apellido");
    }
    if (!args.nombre || args.nombre.trim() === "") {
      throw new PacienteError("Se debe completar el campo: Nombre");
    }
    if (!args.calle || args.calle.trim() === "" || !args.numero || args.numero.trim() === "" || !args.localidad || args.localidad.trim() === "") {
      throw new PacienteError("Se debe completar el campo: Domicilio");
    }
  }

  private validarObraSocial(args: RegistrarPacienteArgs): void {
    if (!args.numeroAfiliado || args.numeroAfiliado.trim() === "") {
      throw new PacienteError("El número de afiliado es obligatorio cuando se proporciona obra social");
    }

    const obraSocialExiste: boolean = this.repoObrasSociales.existe(args.nombreObraSocial!);
    if (!obraSocialExiste) {
      throw new PacienteError("No se puede registrar al paciente con una obra social inexistente");
    }

    const estaAfiliado: boolean = this.repoAfiliaciones.estaAfiliado(
      args.cuil,
      args.nombreObraSocial!,
      args.numeroAfiliado,
    );

    if (!estaAfiliado) {
      throw new PacienteError("El paciente no esta afiliado a esta obra social");
    }
  }
}

