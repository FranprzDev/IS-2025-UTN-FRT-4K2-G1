import { Before, Given, When, Then } from "@cucumber/cucumber";
import { expect } from "chai";
import { PacienteService } from "../../../src/app/service/pacienteService.js";
import { DBPruebaEnMemoria } from "../../../src/test/mocks/DBPruebaEnMemoria.js";
import { InMemoryObrasSocialesRepo } from "../../mocks/inMemoryObrasSocialesRepo.js";
import { InMemoryAfiliacionesRepo } from "../../mocks/inMemoryAfiliacionesRepo.js";
import { ObraSocial } from "../../../src/models/obraSocial.js";
import { Paciente } from "../../../src/models/paciente.js";
import { mensajesContexto } from "./sharedMessages.js";

let repoPacientes: DBPruebaEnMemoria;
let repoObrasSociales: InMemoryObrasSocialesRepo;
let repoAfiliaciones: InMemoryAfiliacionesRepo;
let pacienteService: PacienteService;
let ultimoPacienteRegistrado: Paciente | null;
let excepcionPaciente: Error | null;
let forzarNoAfiliado: boolean;

const crearObraSocial = (nombre: string): ObraSocial => {
  const id: string = (repoObrasSociales.obtenerTodos().length + 1).toString();
  const obraSocial: ObraSocial = new ObraSocial(id, nombre);
  repoObrasSociales.guardar(obraSocial);
  return obraSocial;
};

const parsearDomicilio = (
  domicilioPlano: string,
): { calle: string; numero: string; localidad: string } => {
  const valor: string = domicilioPlano.trim();
  if (valor === "") {
    return { calle: "", numero: "", localidad: "" };
  }
  const partes: string[] = valor.split(" ");
  if (partes.length === 1) {
    return { calle: valor, numero: "", localidad: "San Miguel de Tucumán" };
  }
  const numero: string = partes.pop() || "";
  const calle: string = partes.join(" ");
  return { calle, numero, localidad: "San Miguel de Tucumán" };
};

const prepararAfiliacionSiCorresponde = (
  cuil: string,
  nombreObraSocial: string | undefined,
  numeroAfiliado: string | undefined,
): void => {
  if (!nombreObraSocial || nombreObraSocial.trim() === "") {
    return;
  }
  if (!numeroAfiliado || numeroAfiliado.trim() === "") {
    return;
  }
  if (forzarNoAfiliado) {
    return;
  }
  repoAfiliaciones.guardar({
    cuil,
    nombreObraSocial,
    numeroAfiliado,
  });
};

const registrarPacienteDesdeTabla = (fila: Record<string, string>): void => {
  const domicilio = parsearDomicilio(fila["Domicilio"] || "");
  const nombreObraSocial: string | undefined =
    fila["Obra Social"] && fila["Obra Social"].trim() !== ""
      ? fila["Obra Social"]
      : undefined;
  let numeroAfiliado: string | undefined =
    fila["Numero de afiliado"] && fila["Numero de afiliado"].trim() !== ""
      ? fila["Numero de afiliado"]
      : undefined;
  if (nombreObraSocial && (!numeroAfiliado || numeroAfiliado.trim() === "")) {
    numeroAfiliado = "N/A";
  }

  const cuilNormalizado: string = (fila["Cuil"] || "").replace(/-/g, "");

  prepararAfiliacionSiCorresponde(
    cuilNormalizado,
    nombreObraSocial,
    numeroAfiliado,
  );

  try {
    ultimoPacienteRegistrado = pacienteService.registrarPaciente({
      cuil: cuilNormalizado,
      apellido: fila["Apellido"] || "",
      nombre: fila["Nombre"] || "",
      calle: domicilio.calle,
      numero: domicilio.numero,
      localidad: domicilio.localidad,
      nombreObraSocial,
      numeroAfiliado,
    });
    excepcionPaciente = null;
  } catch (error) {
    ultimoPacienteRegistrado = null;
    excepcionPaciente = error as Error;
  }
  mensajesContexto.ultimoMensaje = excepcionPaciente
    ? excepcionPaciente.message
    : null;
  mensajesContexto.ultimoError = excepcionPaciente;
};

Before(() => {
  repoPacientes = new DBPruebaEnMemoria();
  repoObrasSociales = new InMemoryObrasSocialesRepo();
  repoAfiliaciones = new InMemoryAfiliacionesRepo();
  pacienteService = new PacienteService(
    repoPacientes,
    repoObrasSociales,
    repoAfiliaciones,
  );
  ultimoPacienteRegistrado = null;
  excepcionPaciente = null;
  forzarNoAfiliado = false;
});

Given("que existe la siguiente obra social:", function (dataTable) {
  const row = dataTable.hashes()[0];
  crearObraSocial(row["Nombre"]);
});

Given("que existen las siguientes obras sociales:", function (dataTable) {
  const rows = dataTable.hashes();
  for (const row of rows) {
    crearObraSocial(row["Nombre"]);
  }
});

Given("el paciente no esta afiliado a dicha obra social.", function () {
  forzarNoAfiliado = true;
});

When(/^se registra el siguiente paciente:?$/, function (dataTable) {
  const row = dataTable.hashes()[0];
  registrarPacienteDesdeTabla(row);
});

Then("el sistema registra el paciente", function () {
  expect(ultimoPacienteRegistrado).to.not.be.null;
});

Then("el sistema registra el paciente.", function () {
  expect(ultimoPacienteRegistrado).to.not.be.null;
});

