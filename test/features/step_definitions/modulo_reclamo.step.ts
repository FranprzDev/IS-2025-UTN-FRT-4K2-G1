import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "chai";
import { Doctor } from "../../../src/models/doctor.js";
import { Paciente } from "../../../src/models/paciente.js";
import { Enfermera } from "../../../src/models/enfermera.js";
import { NivelEmergencia } from "../../../src/models/nivelEmergencia.js";
import { EstadoIngreso } from "../../../src/models/estadoIngreso.js";
import { UrgenciaService } from "../../../src/app/service/urgenciaService.js";
import { DBPruebaEnMemoria } from "../../../src/test/mocks/DBPruebaEnMemoria.js";
import { Cuil } from "../../../src/models/valueobjects/cuil.js";
import { Email } from "../../../src/models/valueobjects/email.js";
import { Afiliado } from "../../../src/models/afiliado.js";
import { ObraSocial } from "../../../src/models/obraSocial.js";
import { Domicilio } from "../../../src/models/domicilio.js";
import { Ingreso } from "../../../src/models/ingreso.js";

let doctor: Doctor | null = null;
let dbMockeada: DBPruebaEnMemoria | null = null;
let servicioUrgencias: UrgenciaService | null = null;
let excepcionEsperada: Error | null = null;
let ingresoReclamado: Ingreso | null = null;

Given("que el siguiente médico esta registrado:", function (dataTable) {
  const row = dataTable.hashes()[0];
  const nombre = row["Nombre"];
  const apellido = row["Apellido"];

  const cuil: Cuil = new Cuil("27123456789");
  const email: Email = new Email(`${nombre.toLowerCase()}@example.com`);
  doctor = new Doctor(cuil, nombre, apellido, email, "DOC12345");

  if (!dbMockeada) {
    dbMockeada = new DBPruebaEnMemoria();
    servicioUrgencias = new UrgenciaService(dbMockeada);
  }
});

Given("estan registrados los siguientes pacientes:", function (dataTable) {
  if (!dbMockeada) {
    dbMockeada = new DBPruebaEnMemoria();
    servicioUrgencias = new UrgenciaService(dbMockeada);
  }

  const rows = dataTable.hashes();

  for (const row of rows) {
    const cuilStr = row["Cuil"];
    const nombre = row["Nombre"];
    const apellido = row["Apellido"];
    const obraSocialStr = row["Obra Social"];

    const cuil: Cuil = new Cuil(cuilStr.replace(/-/g, ""));
    const email: Email = new Email(`${nombre.toLowerCase()}@example.com`);
    const obraSocial: ObraSocial = new ObraSocial("1", obraSocialStr);
    const afiliado: Afiliado = new Afiliado(obraSocial, "12345678");
    const domicilio: Domicilio = new Domicilio(
      "Calle Principal",
      "123",
      "San Miguel de Tucumán"
    );

    const paciente: Paciente = new Paciente(cuil, nombre, apellido, email, afiliado, domicilio);
    dbMockeada!.guardarPaciente(paciente);
  }
});

Given("la actual lista de espera ordenada por cuil es:", function (dataTable) {
  if (!dbMockeada) {
    dbMockeada = new DBPruebaEnMemoria();
    servicioUrgencias = new UrgenciaService(dbMockeada);
  }

  const rawRows = dataTable.raw();
  const expectedCuils = rawRows.slice(1).map((row: any) => row[0].trim());

  const enfermera: Enfermera = new Enfermera(
    new Cuil("27123456789"),
    "Maria",
    "Gonzalez",
    new Email("maria@example.com"),
    "ENF12345"
  );

  for (const cuilStr of expectedCuils) {
    const cuilSinGuiones = cuilStr.trim().replace(/-/g, "");
    servicioUrgencias!.registrarUrgencia({
      cuil: cuilSinGuiones,
      enfermera,
      informe: "Test",
      nivelEmergencia: NivelEmergencia.EMERGENCIA,
      temperatura: 38,
      frecuenciaCardiaca: 80,
      frecuenciaRespiratoria: 16,
      frecuenciaSistolica: 120,
      frecuenciaDiastolica: 80,
    });
  }
});

Given("la actual lista de espera esta vacía", function () {
  if (!dbMockeada) {
    dbMockeada = new DBPruebaEnMemoria();
    servicioUrgencias = new UrgenciaService(dbMockeada);
  }
});

When("el médico reclama al proximo paciente en la lista de espera", function () {
  excepcionEsperada = null;
  ingresoReclamado = null;

  try {
    ingresoReclamado = servicioUrgencias!.reclamarProximoPaciente(doctor!);
  } catch (error) {
    excepcionEsperada = error as Error;
  }
});

When("el médico reclama el proximo paciente en la lista de espera", function () {
  excepcionEsperada = null;
  ingresoReclamado = null;

  try {
    ingresoReclamado = servicioUrgencias!.reclamarProximoPaciente(doctor!);
  } catch (error) {
    excepcionEsperada = error as Error;
  }
});

Then(
  'el estado del ingreso del paciente con cuil:{string} pasa a ser "{string}"',
  function (cuil: string, estado: string) {
    expect(ingresoReclamado).to.not.be.null;
    expect(ingresoReclamado!.CuilPaciente).to.equal(cuil);
    
    const estadoEsperado = estado === "EN_PROCESO" ? EstadoIngreso.EN_PROCESO : estado;
    expect(ingresoReclamado!.Estado).to.equal(estadoEsperado);
  }
);

Then("la lista de espera ordenada por cuil es:", function (dataTable) {
  const expectedCuils = dataTable.raw().map((row: any) => row[0]);

  const ingresosPendientes = servicioUrgencias!.obtenerIngresosPendientes();
  const actualCuils = ingresosPendientes.map((ingreso) => ingreso.CuilPaciente);

  expect(actualCuils).to.have.length(expectedCuils.length);
  expect(actualCuils).to.deep.equal(expectedCuils);
});

Then('el sistema muestra el siguiente mensaje de error: "{string}"', function (mensaje: string) {
  expect(excepcionEsperada).to.not.be.null;
  expect(excepcionEsperada!.message).to.equal(mensaje);
});

