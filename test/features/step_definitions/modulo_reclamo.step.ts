import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "chai";
import { Paciente } from "../../../src/models/paciente.js";
import { Enfermera } from "../../../src/models/enfermera.js";
import { NivelEmergencia } from "../../../src/models/nivelEmergencia.js";
import { UrgenciaService } from "../../../src/app/service/urgenciaService.js";
import { DBPruebaEnMemoria } from "../../../src/test/mocks/DBPruebaEnMemoria.js";
import { Cuil } from "../../../src/models/valueobjects/cuil.js";
import { Email } from "../../../src/models/valueobjects/email.js";
import { Afiliado } from "../../../src/models/afiliado.js";
import { ObraSocial } from "../../../src/models/obraSocial.js";
import { Domicilio } from "../../../src/models/domicilio.js";
import { escenarioMedicoContexto } from "./sharedContext.js";
import { mensajesContexto } from "./sharedMessages.js";

let excepcionEsperada: Error | null = null;

Given("estan registrados los siguientes pacientes:", function (dataTable) {
  if (!escenarioMedicoContexto.db) {
    escenarioMedicoContexto.db = new DBPruebaEnMemoria();
    escenarioMedicoContexto.servicioUrgencias = new UrgenciaService(
      escenarioMedicoContexto.db,
    );
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

    const paciente: Paciente = new Paciente(
      cuil,
      nombre,
      apellido,
      email,
      afiliado,
      domicilio,
    );
    escenarioMedicoContexto.db!.guardarPaciente(paciente);
  }
});

Given("la actual lista de espera ordenada por cuil es:", function (dataTable) {
  if (!escenarioMedicoContexto.db) {
    escenarioMedicoContexto.db = new DBPruebaEnMemoria();
    escenarioMedicoContexto.servicioUrgencias = new UrgenciaService(
      escenarioMedicoContexto.db,
    );
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
    escenarioMedicoContexto.servicioUrgencias!.registrarUrgencia({
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
  if (!escenarioMedicoContexto.db) {
    escenarioMedicoContexto.db = new DBPruebaEnMemoria();
    escenarioMedicoContexto.servicioUrgencias = new UrgenciaService(
      escenarioMedicoContexto.db,
    );
  }
});

When("el médico reclama al proximo paciente en la lista de espera", function () {
  excepcionEsperada = null;

  try {
    escenarioMedicoContexto.servicioUrgencias!.reclamarProximoPaciente(
      escenarioMedicoContexto.doctor!,
    );
  } catch (error) {
    excepcionEsperada = error as Error;
  }
  mensajesContexto.ultimoMensaje = excepcionEsperada
    ? excepcionEsperada.message
    : null;
  mensajesContexto.ultimoError = excepcionEsperada;
});

When("el médico reclama el proximo paciente en la lista de espera", function () {
  excepcionEsperada = null;

  try {
    escenarioMedicoContexto.servicioUrgencias!.reclamarProximoPaciente(
      escenarioMedicoContexto.doctor!,
    );
  } catch (error) {
    excepcionEsperada = error as Error;
  }
  mensajesContexto.ultimoMensaje = excepcionEsperada
    ? excepcionEsperada.message
    : null;
  mensajesContexto.ultimoError = excepcionEsperada;
});

Then("la lista de espera ordenada por cuil es:", function (dataTable) {
  const expectedCuils = dataTable.raw().slice(1).map((row: any) => row[0]);

  const ingresosPendientes =
    escenarioMedicoContexto.servicioUrgencias!.obtenerIngresosPendientes();
  const actualCuils = ingresosPendientes.map((ingreso) => ingreso.CuilPaciente);

  expect(actualCuils).to.have.length(expectedCuils.length);
  expect(actualCuils).to.deep.equal(expectedCuils);
});

