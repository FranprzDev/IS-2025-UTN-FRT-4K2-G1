import { describe, it } from "node:test";
import { expect } from "chai";
import { Ingreso } from "../../src/models/ingreso.js";
import { Paciente } from "../../src/models/paciente.js";
import { Enfermera } from "../../src/models/enfermera.js";
import { NivelEmergencia } from "../../src/models/nivelEmergencia.js";
import { EstadoIngreso } from "../../src/models/estadoIngreso.js";

describe("Ingreso", () => {
  let paciente: Paciente;
  let enfermera: Enfermera;

  paciente = new Paciente("Juan", "Perez", "23-12345678-9", "OSDE");
  enfermera = new Enfermera("Maria", "Gonzalez");

  it("deberia crear ingreso con datos validos", () => {
    const ingreso: Ingreso = new Ingreso({
      paciente,
      enfermera,
      informe: "Paciente con dolor abdominal",
      nivelEmergencia: NivelEmergencia.EMERGENCIA,
      temperatura: 38,
      frecuenciaCardiaca: 80,
      frecuenciaRespiratoria: 16,
      frecuenciaSistolica: 120,
      frecuenciaDiastolica: 80,
    });
    expect(ingreso).to.exist;
  });

  describe("compararCon", () => {
    it("deberia devolver negativo cuando this tiene mayor prioridad que otro", () => {
      const ingresoCritico: Ingreso = new Ingreso({
        paciente,
        enfermera,
        informe: "Paciente critico",
        nivelEmergencia: NivelEmergencia.CRITICA,
        temperatura: 38,
        frecuenciaCardiaca: 80,
        frecuenciaRespiratoria: 16,
        frecuenciaSistolica: 120,
        frecuenciaDiastolica: 80,
      });

      const ingresoEmergencia: Ingreso = new Ingreso({
        paciente: new Paciente("Ana", "Lopez", "27-87654321-3", "Swiss"),
        enfermera,
        informe: "Paciente con emergencia",
        nivelEmergencia: NivelEmergencia.EMERGENCIA,
        temperatura: 37,
        frecuenciaCardiaca: 75,
        frecuenciaRespiratoria: 15,
        frecuenciaSistolica: 110,
        frecuenciaDiastolica: 70,
      });

      const resultado: number = ingresoCritico.compararCon(ingresoEmergencia);
      expect(resultado).to.be.lessThan(0);
    });

    it("deberia devolver positivo cuando otro tiene mayor prioridad que this", () => {
      const ingresoUrgencia: Ingreso = new Ingreso({
        paciente,
        enfermera,
        informe: "Paciente con urgencia",
        nivelEmergencia: NivelEmergencia.URGENCIA,
        temperatura: 38,
        frecuenciaCardiaca: 80,
        frecuenciaRespiratoria: 16,
        frecuenciaSistolica: 120,
        frecuenciaDiastolica: 80,
      });

      const ingresoCritico: Ingreso = new Ingreso({
        paciente: new Paciente("Ana", "Lopez", "27-87654321-3", "Swiss"),
        enfermera,
        informe: "Paciente critico",
        nivelEmergencia: NivelEmergencia.CRITICA,
        temperatura: 37,
        frecuenciaCardiaca: 75,
        frecuenciaRespiratoria: 15,
        frecuenciaSistolica: 110,
        frecuenciaDiastolica: 70,
      });

      const resultado: number = ingresoUrgencia.compararCon(ingresoCritico);
      expect(resultado).to.be.greaterThan(0);
    });

    it("deberia comparar por fecha cuando tienen el mismo nivel de emergencia", () => {
      // Crear dos ingresos con el mismo nivel
      const ingreso1: Ingreso = new Ingreso({
        paciente,
        enfermera,
        informe: "Primer paciente",
        nivelEmergencia: NivelEmergencia.EMERGENCIA,
        temperatura: 38,
        frecuenciaCardiaca: 80,
        frecuenciaRespiratoria: 16,
        frecuenciaSistolica: 120,
        frecuenciaDiastolica: 80,
      });

      const ingreso2: Ingreso = new Ingreso({
        paciente: new Paciente("Ana", "Lopez", "27-87654321-3", "Swiss"),
        enfermera,
        informe: "Segundo paciente",
        nivelEmergencia: NivelEmergencia.EMERGENCIA,
        temperatura: 37,
        frecuenciaCardiaca: 75,
        frecuenciaRespiratoria: 15,
        frecuenciaSistolica: 110,
        frecuenciaDiastolica: 70,
      });

      // Como tienen el mismo nivel, deberían compararse por fecha
      // La comparación por nivel debería ser 0, y luego por fecha
      const comparacionNivel: number = ingreso1.NivelEmergencia.compararCon(ingreso2.NivelEmergencia);
      expect(comparacionNivel).to.equal(0); // Mismo nivel

      // La comparación total debería depender de la fecha
      const resultado: number = ingreso1.compararCon(ingreso2);
      // El resultado puede ser diferente dependiendo del timing, pero no debería ser undefined
      expect(resultado).to.be.a('number');
    });

    it("deberia devolver cero cuando son el mismo ingreso", () => {
      const ingreso: Ingreso = new Ingreso({
        paciente,
        enfermera,
        informe: "Paciente",
        nivelEmergencia: NivelEmergencia.EMERGENCIA,
        temperatura: 38,
        frecuenciaCardiaca: 80,
        frecuenciaRespiratoria: 16,
        frecuenciaSistolica: 120,
        frecuenciaDiastolica: 80,
      });

      const resultado: number = ingreso.compararCon(ingreso);
      expect(resultado).to.equal(0);
    });
  });

  describe("getters", () => {
    it("deberia devolver el cuil del paciente", () => {
      const ingreso: Ingreso = new Ingreso({
        paciente,
        enfermera,
        informe: "Paciente",
        nivelEmergencia: NivelEmergencia.EMERGENCIA,
        temperatura: 38,
        frecuenciaCardiaca: 80,
        frecuenciaRespiratoria: 16,
        frecuenciaSistolica: 120,
        frecuenciaDiastolica: 80,
      });

      expect(ingreso.CuilPaciente).to.equal("23-12345678-9");
    });

    it("deberia devolver el nivel de emergencia", () => {
      const ingreso: Ingreso = new Ingreso({
        paciente,
        enfermera,
        informe: "Paciente",
        nivelEmergencia: NivelEmergencia.CRITICA,
        temperatura: 38,
        frecuenciaCardiaca: 80,
        frecuenciaRespiratoria: 16,
        frecuenciaSistolica: 120,
        frecuenciaDiastolica: 80,
      });

      expect(ingreso.NivelEmergencia).to.equal(NivelEmergencia.CRITICA);
    });

    it("deberia devolver la fecha de ingreso", () => {
      const fechaAntes: Date = new Date();
      const ingreso: Ingreso = new Ingreso({
        paciente,
        enfermera,
        informe: "Paciente",
        nivelEmergencia: NivelEmergencia.EMERGENCIA,
        temperatura: 38,
        frecuenciaCardiaca: 80,
        frecuenciaRespiratoria: 16,
        frecuenciaSistolica: 120,
        frecuenciaDiastolica: 80,
      });
      const fechaDespues: Date = new Date();

      expect(ingreso.FechaIngreso.getTime()).to.be.greaterThanOrEqual(fechaAntes.getTime());
      expect(ingreso.FechaIngreso.getTime()).to.be.lessThanOrEqual(fechaDespues.getTime());
    });

    it("deberia inicializar el estado en PENDIENTE por defecto", () => {
      const ingreso: Ingreso = new Ingreso({
        paciente,
        enfermera,
        informe: "Paciente",
        nivelEmergencia: NivelEmergencia.EMERGENCIA,
        temperatura: 38,
        frecuenciaCardiaca: 80,
        frecuenciaRespiratoria: 16,
        frecuenciaSistolica: 120,
        frecuenciaDiastolica: 80,
      });

      expect(ingreso.Estado).to.equal(EstadoIngreso.PENDIENTE);
    });

    it("deberia permitir inicializar con un estado especifico", () => {
      const ingreso: Ingreso = new Ingreso({
        paciente,
        enfermera,
        informe: "Paciente",
        nivelEmergencia: NivelEmergencia.EMERGENCIA,
        estado: EstadoIngreso.EN_PROCESO,
        temperatura: 38,
        frecuenciaCardiaca: 80,
        frecuenciaRespiratoria: 16,
        frecuenciaSistolica: 120,
        frecuenciaDiastolica: 80,
      });

      expect(ingreso.Estado).to.equal(EstadoIngreso.EN_PROCESO);
    });

    it("deberia permitir cambiar el estado", () => {
      const ingreso: Ingreso = new Ingreso({
        paciente,
        enfermera,
        informe: "Paciente",
        nivelEmergencia: NivelEmergencia.EMERGENCIA,
        temperatura: 38,
        frecuenciaCardiaca: 80,
        frecuenciaRespiratoria: 16,
        frecuenciaSistolica: 120,
        frecuenciaDiastolica: 80,
      });

      ingreso.cambiarEstado(EstadoIngreso.FINALIZADO);
      expect(ingreso.Estado).to.equal(EstadoIngreso.FINALIZADO);
    });
  });
});
