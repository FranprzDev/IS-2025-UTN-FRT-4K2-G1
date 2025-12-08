import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "chai";
import { Doctor } from "../../../src/models/doctor.js";
import { Enfermera } from "../../../src/models/enfermera.js";
import { Paciente } from "../../../src/models/paciente.js";
import { NivelEmergencia } from "../../../src/models/nivelEmergencia.js";
import { UrgenciaService } from "../../../src/app/service/urgenciaService.js";
import { DBPruebaEnMemoria } from "../../../src/test/mocks/DBPruebaEnMemoria.js";
import { Cuil } from "../../../src/models/valueobjects/cuil.js";
import { Email } from "../../../src/models/valueobjects/email.js";
import { Afiliado } from "../../../src/models/afiliado.js";
import { ObraSocial } from "../../../src/models/obraSocial.js";
import { Domicilio } from "../../../src/models/domicilio.js";
import { EstadoIngreso } from "../../../src/models/estadoIngreso.js";
import { Atencion } from "../../../src/models/atencion.js";
import { Ingreso } from "../../../src/models/ingreso.js";

let doctor: Doctor | null = null;
let dbMockeada: DBPruebaEnMemoria | null = null;
let servicioUrgencias: UrgenciaService | null = null;
let atencionRegistrada: Atencion | null = null;
let excepcionEsperada: Error | null = null;

const obtenerNivelEmergencia = (descripcion: string): NivelEmergencia => {
  const niveles = [
    NivelEmergencia.CRITICA,
    NivelEmergencia.EMERGENCIA,
    NivelEmergencia.URGENCIA,
    NivelEmergencia.URGENCIA_MENOR,
    NivelEmergencia.SIN_URGENCIA,
  ];
  const encontrado = niveles.find((nivel) => nivel.descripcion === descripcion);
  if (!encontrado) {
    throw new Error(`Nivel de emergencia desconocido: ${descripcion}`);
  }
  return encontrado;
};

Given("que el siguiente médico esta registrado:", function (dataTable) {
  const row = dataTable.hashes()[0];
  const nombre = row["Nombre"];
  const apellido = row["Apellido"];

  const cuilDoctor: Cuil = new Cuil("27123456789");
  const emailDoctor: Email = new Email(`${nombre.toLowerCase()}@example.com`);
  doctor = new Doctor(cuilDoctor, nombre, apellido, emailDoctor, "DOC12345");

  dbMockeada = new DBPruebaEnMemoria();
  servicioUrgencias = new UrgenciaService(dbMockeada);
  atencionRegistrada = null;
  excepcionEsperada = null;
});

Given("que el siguiente ingreso esta registrado:", function (dataTable) {
  const row = dataTable.hashes()[0];
  const cuil = row["Cuil"];
  const informe = row["Informe"];
  const nivelStr = row["Nivel de Emergencia"];
  const temperatura = parseFloat(row["Temperatura"]);
  const frecuenciaCardiaca = parseFloat(row["Frecuencia Cardiaca"]);
  const frecuenciaRespiratoria = parseFloat(row["Frecuencia Respiratoria"]);
  const tensionParts = row["Tension Arterial"].split("/");
  const frecuenciaSistolica = parseFloat(tensionParts[0]);
  const frecuenciaDiastolica = parseFloat(tensionParts[1]);

  const pacienteCuil: Cuil = new Cuil(cuil.replace(/\D/g, ""));
  const emailPaciente: Email = new Email("paciente@example.com");
  const obraSocial: ObraSocial = new ObraSocial("1", "OSDE");
  const afiliado: Afiliado = new Afiliado(obraSocial, "12345678");
  const domicilio: Domicilio = new Domicilio("Calle Principal", "123", "San Miguel de Tucumán");
  const paciente: Paciente = new Paciente(
    pacienteCuil,
    "Paciente",
    "Urgencias",
    emailPaciente,
    afiliado,
    domicilio,
  );
  dbMockeada!.guardarPaciente(paciente);

  const enfermera: Enfermera = new Enfermera(
    new Cuil("27999999999"),
    "Maria",
    "Gonzalez",
    new Email("maria@example.com"),
    "ENF12345",
  );

  servicioUrgencias!.registrarUrgencia({
    cuil: cuil.replace(/\D/g, ""),
    enfermera,
    informe,
    nivelEmergencia: obtenerNivelEmergencia(nivelStr),
    temperatura,
    frecuenciaCardiaca,
    frecuenciaRespiratoria,
    frecuenciaSistolica,
    frecuenciaDiastolica,
  });

  servicioUrgencias!.reclamarPaciente(doctor!, cuil);
});

When("El medico registra la atencion con el siguiente informe:", function (dataTable) {
  const row = dataTable.hashes()[0];
  const cuil = row["Paciente"];
  const informe = row["Informe"];
  atencionRegistrada = null;
  excepcionEsperada = null;

  try {
    atencionRegistrada = servicioUrgencias!.registrarAtencion(
      doctor!,
      cuil,
      informe,
    );
  } catch (error) {
    excepcionEsperada = error as Error;
  }
});

Then("se registra la atencion", function () {
  expect(atencionRegistrada).to.not.be.null;
});

Then(
  'el estado del ingreso del paciente con cuil:{string} pasa a ser "{string}"',
  function (cuil: string, estado: string) {
    const ingresos: Ingreso[] = servicioUrgencias!.obtenerIngresosDelDoctor(
      doctor!.Email.Valor,
    );
    const ingresoObjetivo = ingresos.find(
      (ingreso) => ingreso.CuilPaciente === cuil,
    );
    const estadoEsperado =
      estado === "FINALIZADO" ? EstadoIngreso.FINALIZADO : estado;
    expect(ingresoObjetivo).to.not.be.undefined;
    expect(ingresoObjetivo!.Estado).to.equal(estadoEsperado);
  },
);

Then(
  'el sistema muestra el siguiente mensaje de error: "{string}"',
  function (mensaje: string) {
    expect(excepcionEsperada).to.not.be.null;
    expect(excepcionEsperada!.message).to.equal(mensaje);
  },
);

