import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "chai";
import { Enfermera } from "../../../src/models/enfermera.js";
import { Paciente } from "../../../src/models/paciente.js";
import { NivelEmergencia } from "../../../src/models/nivelEmergencia.js";
import { UrgenciaService } from "../../../src/app/service/urgenciaService.js";
import { DBPruebaEnMemoria } from "@/test/mocks/DBPruebaEnMemoria.js";

let enfermera: Enfermera | null = null;
let dbMockeada: DBPruebaEnMemoria | null = null;
let servicioUrgencias: UrgenciaService | null = null;
let excepcionEsperada: Error | null = null;

Given("que la siguiente enfermera esta registrada:", function (dataTable) {
  const row = dataTable.hashes()[0];
  const nombre = row["Nombre"];
  const apellido = row["Apellido"];

  enfermera = new Enfermera(nombre, apellido);

  dbMockeada = new DBPruebaEnMemoria();
  servicioUrgencias = new UrgenciaService(dbMockeada);
});

Given("que estan registrados los siguientes pacientes:", function (dataTable) {
  const rows = dataTable.hashes();

  for (const row of rows) {
    const cuil = row["Cuil"];
    const nombre = row["Nombre"];
    const apellido = row["Apellido"];
    const obraSocial = row["Obra Social"];

    const paciente = new Paciente(nombre, apellido, cuil, obraSocial);
    dbMockeada!.guardarPaciente(paciente);
  }
});

When("Ingresan a urgencias los siguientes pacientes:", function (dataTable) {
  const rows = dataTable.hashes();
  excepcionEsperada = null;

  for (const row of rows) {
    const cuil = row["Cuil"];
    const informe = row["Informe"];
    const nivelEmergenciaStr = row["Nivel de Emergencia"];
    const temperatura = parseFloat(row["Temperatura"]);
    const frecuenciaCardiaca = parseFloat(row["Frecuencia Cardiaca"]);
    const frecuenciaRespiratoria = parseFloat(row["Frecuencia Respiratoria"]);
    const tensionArterialStr = row["Tension Arterial"];
    const tensionParts = tensionArterialStr.split("/");
    const frecuenciaSistolica = parseFloat(tensionParts[0]);
    const frecuenciaDiastolica = parseFloat(tensionParts[1]);

    let nivelEmergencia: NivelEmergencia | null = null;
    const niveles = [
      NivelEmergencia.CRITICA,
      NivelEmergencia.EMERGENCIA,
      NivelEmergencia.URGENCIA,
      NivelEmergencia.URGENCIA_MENOR,
      NivelEmergencia.SIN_URGENCIA,
    ];

    for (const nivel of niveles) {
      if (nivel.tieneNombre(nivelEmergenciaStr)) {
        nivelEmergencia = nivel;
        break;
      }
    }

    if (!nivelEmergencia) {
      throw new Error(`Nivel de emergencia desconocido: ${nivelEmergenciaStr}`);
    }

    try {
      servicioUrgencias!.registrarUrgencia({
        cuil: cuil,
        enfermera: enfermera!,
        informe: informe,
        nivelEmergencia: nivelEmergencia,
        temperatura: temperatura,
        frecuenciaCardiaca: frecuenciaCardiaca,
        frecuenciaRespiratoria: frecuenciaRespiratoria,
        frecuenciaSistolica: frecuenciaSistolica,
        frecuenciaDiastolica: frecuenciaDiastolica,
      });
    } catch (error) {
      excepcionEsperada = error as Error;
      break;
    }
  }
});

Then(
  "La lista de espera esta ordenada por cuil de la siguiente manera:",
  function (dataTable) {
    const expectedCuils = dataTable.raw().map((row: any) => row[0]);

    const ingresosPendientes = servicioUrgencias!.obtenerIngresosPendientes();
    const actualCuils = ingresosPendientes.map(
      (ingreso) => ingreso.CuilPaciente,
    );

    expect(actualCuils).to.have.length(expectedCuils.length);
    expect(actualCuils).to.deep.equal(expectedCuils);
  },
);

Given("que el siguiente paciente esta registrado", function (dataTable) {
  const row = dataTable.hashes()[0];
  const cuil = row["Cuil"];
  const nombre = row["Nombre"];
  const apellido = row["Apellido"];
  const obraSocial = row["Obra Social"];

  const paciente = new Paciente(nombre, apellido, cuil, obraSocial);
  dbMockeada!.guardarPaciente(paciente);
});

Given("que el paciente no existe en el sistema", function () {
  // No guardamos ningún paciente en la BD mockeada
  // Esto simula que el paciente no existe en el sistema
});


Then("el sistema guarda el ingreso del paciente", function () {
  const ingresos = servicioUrgencias!.obtenerIngresosPendientes();
  expect(ingresos).to.have.length.greaterThan(0);
});

Then("el paciente entra en la cola de atención con estado {string}", function (estado: string) {
  const ingresos = servicioUrgencias!.obtenerIngresosPendientes();
  const ultimoIngreso = ingresos[ingresos.length - 1];
  expect(ultimoIngreso?.NivelEmergencia.tieneNombre(estado)).to.be.true;
});

Then("el sistema muestra el siguiente mensaje: {string}", function (mensaje: string) {
  expect(excepcionEsperada).to.not.be.null;
  expect(excepcionEsperada!.message).to.equal(mensaje);
});


Then(
  "el sistema muestra el siguiente error: {string}",
  function (mensaje: string) {
    expect(excepcionEsperada).to.not.be.null;
    expect(excepcionEsperada!.message).to.equal(mensaje);
  },
);
