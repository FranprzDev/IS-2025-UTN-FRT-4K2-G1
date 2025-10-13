import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "chai";
import { Enfermera } from "@/models/enfermera";
import { Paciente } from "@/models/paciente";
import { NivelEmergencia } from "@/models/nivelEmergencia";
import { UrgenciaService } from "@/app/service/urgenciaService";
import { DBPruebaEnMemoria } from "@/test/mocks/DBPruebaEnMemoria";

let enfermera: Enfermera | null = null;
let dbMockeada: DBPruebaEnMemoria | null = null;
let servicioUrgencias: UrgenciaService | null = null;
let excepcionEsperada: Error | null = null;

Given("que la siguiente enfermera esta registrada:", function (dataTable) {
  const row = dataTable.hashes()[0];
  const nombre = row["Nombre"];
  const apellido = row["Apellido"];

  enfermera = new Enfermera(nombre, apellido);

  // Initialize the mock database and service
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

    // Parse tension arterial (format: "120/80")
    const tensionParts = tensionArterialStr.split("/");
    const frecuenciaSistolica = parseFloat(tensionParts[0]);
    const frecuenciaDiastolica = parseFloat(tensionParts[1]);

    // Find the corresponding NivelEmergencia
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

Then(
  "el sistema muestra el siguiente error: {string}",
  function (mensaje: string) {
    expect(excepcionEsperada).to.not.be.null;
    expect(excepcionEsperada!.message).to.equal(mensaje);
  },
);
