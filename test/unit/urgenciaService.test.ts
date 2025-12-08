import { describe, it } from "node:test";
import { expect } from "chai";
import { UrgenciaService } from "../../src/app/service/urgenciaService.js";
import { DBPruebaEnMemoria } from "../../src/test/mocks/DBPruebaEnMemoria.js";
import { Paciente } from "../../src/models/paciente.js";
import { Enfermera } from "../../src/models/enfermera.js";
import { NivelEmergencia } from "../../src/models/nivelEmergencia.js";
import { Doctor } from "../../src/models/doctor.js";
import { EstadoIngreso } from "../../src/models/estadoIngreso.js";
import { Email } from "../../src/models/valueobjects/email.js";
import { Cuil } from "../../src/models/valueobjects/cuil.js";
import { Afiliado } from "../../src/models/afiliado.js";
import { ObraSocial } from "../../src/models/obraSocial.js";
import { Domicilio } from "../../src/models/domicilio.js";

describe("UrgenciaService", () => {
  let dbMockeada: DBPruebaEnMemoria;
  let servicioUrgencias: UrgenciaService;
  let paciente1: Paciente;
  let paciente2: Paciente;
  let paciente3: Paciente;
  let enfermera: Enfermera;

  const setupTestData = () => {
    dbMockeada = new DBPruebaEnMemoria();
    servicioUrgencias = new UrgenciaService(dbMockeada);

    const obraSocial1: ObraSocial = new ObraSocial("1", "OSDE");
    const afiliado1: Afiliado = new Afiliado(obraSocial1, "12345678");
    const domicilio1: Domicilio = new Domicilio("Calle 1", "123", "San Miguel de Tucumán");
    paciente1 = new Paciente(
      new Cuil("23123456789"),
      "Juan",
      "Perez",
      new Email("juan@example.com"),
      afiliado1,
      domicilio1,
    );

    const obraSocial2: ObraSocial = new ObraSocial("2", "Swiss");
    const afiliado2: Afiliado = new Afiliado(obraSocial2, "87654321");
    const domicilio2: Domicilio = new Domicilio("Calle 2", "456", "San Miguel de Tucumán");
    paciente2 = new Paciente(
      new Cuil("27876543213"),
      "Ana",
      "Lopez",
      new Email("ana@example.com"),
      afiliado2,
      domicilio2,
    );

    const obraSocial3: ObraSocial = new ObraSocial("3", "Fondo de Bikini");
    const afiliado3: Afiliado = new Afiliado(obraSocial3, "11223344");
    const domicilio3: Domicilio = new Domicilio("Calle 3", "789", "San Miguel de Tucumán");
    paciente3 = new Paciente(
      new Cuil("23112233445"),
      "Carlos",
      "Rodriguez",
      new Email("carlos@example.com"),
      afiliado3,
      domicilio3,
    );

    dbMockeada.guardarPaciente(paciente1);
    dbMockeada.guardarPaciente(paciente2);
    dbMockeada.guardarPaciente(paciente3);

    enfermera = new Enfermera(
      new Cuil("27123456789"),
      "Maria",
      "Gonzalez",
      new Email("maria@example.com"),
      "ENF12345",
    );
  };

  describe("registrarUrgencia", () => {
    it("deberia registrar un ingreso exitosamente", () => {
      setupTestData();
      expect(() => {
        servicioUrgencias.registrarUrgencia({
          cuil: "23123456789",
          enfermera,
          informe: "Paciente con dolor abdominal",
          nivelEmergencia: NivelEmergencia.EMERGENCIA,
          temperatura: 38,
          frecuenciaCardiaca: 80,
          frecuenciaRespiratoria: 16,
          frecuenciaSistolica: 120,
          frecuenciaDiastolica: 80,
        });
      }).to.not.throw();

      const ingresos = servicioUrgencias.obtenerIngresosPendientes();
      expect(ingresos).to.have.length(1);
      expect(ingresos?.[0]?.CuilPaciente).to.equal("23-12345678-9");
    });

    it("deberia lanzar error cuando el paciente no existe", () => {
      setupTestData();
      expect(() => {
        servicioUrgencias.registrarUrgencia({
          cuil: "99999999999",
          enfermera,
          informe: "Paciente con dolor abdominal",
          nivelEmergencia: NivelEmergencia.EMERGENCIA,
          temperatura: 38,
          frecuenciaCardiaca: 80,
          frecuenciaRespiratoria: 16,
          frecuenciaSistolica: 120,
          frecuenciaDiastolica: 80,
        });
      }).to.throw("Paciente con CUIL 99-99999999-9 no encontrado");
    });

    it("deberia ordenar correctamente por prioridad de emergencia", () => {
      setupTestData();
      servicioUrgencias.registrarUrgencia({
        cuil: "23123456789",
        enfermera,
        informe: "Paciente crítico",
        nivelEmergencia: NivelEmergencia.CRITICA,
        temperatura: 39,
        frecuenciaCardiaca: 100,
        frecuenciaRespiratoria: 25,
        frecuenciaSistolica: 140,
        frecuenciaDiastolica: 90,
      });

      servicioUrgencias.registrarUrgencia({
          cuil: "27876543213",
        enfermera,
        informe: "Paciente con emergencia",
        nivelEmergencia: NivelEmergencia.EMERGENCIA,
        temperatura: 38,
        frecuenciaCardiaca: 85,
        frecuenciaRespiratoria: 18,
        frecuenciaSistolica: 130,
        frecuenciaDiastolica: 85,
      });

      servicioUrgencias.registrarUrgencia({
          cuil: "23112233445",
        enfermera,
        informe: "Paciente sin urgencia",
        nivelEmergencia: NivelEmergencia.SIN_URGENCIA,
        temperatura: 36.5,
        frecuenciaCardiaca: 65,
        frecuenciaRespiratoria: 12,
        frecuenciaSistolica: 110,
        frecuenciaDiastolica: 70,
      });

      const ingresos = servicioUrgencias.obtenerIngresosPendientes();
      expect(ingresos).to.have.length(3);

      expect(ingresos[0]?.CuilPaciente).to.equal("23-12345678-9");
      expect(ingresos[1]?.CuilPaciente).to.equal("27-87654321-3");
      expect(ingresos[2]?.CuilPaciente).to.equal("23-11223344-5");
    });

    it("deberia ordenar por fecha cuando tienen el mismo nivel de emergencia", () => {
      setupTestData();
      servicioUrgencias.registrarUrgencia({
        cuil: "23123456789",
        enfermera,
        informe: "Primer paciente urgencia",
        nivelEmergencia: NivelEmergencia.URGENCIA,
        temperatura: 38,
        frecuenciaCardiaca: 80,
        frecuenciaRespiratoria: 16,
        frecuenciaSistolica: 120,
        frecuenciaDiastolica: 80,
      });

      setTimeout(() => {}, 10);

      servicioUrgencias.registrarUrgencia({
          cuil: "27876543213",
        enfermera,
        informe: "Segundo paciente urgencia",
        nivelEmergencia: NivelEmergencia.URGENCIA,
        temperatura: 37.5,
        frecuenciaCardiaca: 75,
        frecuenciaRespiratoria: 15,
        frecuenciaSistolica: 115,
        frecuenciaDiastolica: 75,
      });

      const ingresos = servicioUrgencias.obtenerIngresosPendientes();
      expect(ingresos).to.have.length(2);

      expect(ingresos?.[0]?.CuilPaciente).to.equal("23-12345678-9");
      expect(ingresos?.[1]?.CuilPaciente).to.equal("27-87654321-3");
    });
  });

  describe("obtenerIngresosPendientes", () => {
    it("deberia devolver lista vacia inicialmente", () => {
      setupTestData();
      const ingresos = servicioUrgencias.obtenerIngresosPendientes();
      expect(ingresos).to.have.length(0);
    });

    it("deberia devolver copia de la lista, no referencia", () => {
      setupTestData();
      servicioUrgencias.registrarUrgencia({
        cuil: "23123456789",
        enfermera,
        informe: "Paciente",
        nivelEmergencia: NivelEmergencia.EMERGENCIA,
        temperatura: 38,
        frecuenciaCardiaca: 80,
        frecuenciaRespiratoria: 16,
        frecuenciaSistolica: 120,
        frecuenciaDiastolica: 80,
      });

      const ingresos1 = servicioUrgencias.obtenerIngresosPendientes();
      const ingresos2 = servicioUrgencias.obtenerIngresosPendientes();

      expect(ingresos1).to.not.equal(ingresos2);
      expect(ingresos1).to.deep.equal(ingresos2);
    });
  });

  describe("reclamarPaciente", () => {
    it("deberia tomar el paciente con mayor prioridad y pasarlo a EN_PROCESO", () => {
      setupTestData();
      servicioUrgencias.registrarUrgencia({
        cuil: "23123456789",
        enfermera,
        informe: "Paciente en emergencia",
        nivelEmergencia: NivelEmergencia.EMERGENCIA,
        temperatura: 37.8,
        frecuenciaCardiaca: 90,
        frecuenciaRespiratoria: 18,
        frecuenciaSistolica: 125,
        frecuenciaDiastolica: 82,
      });
      servicioUrgencias.registrarUrgencia({
        cuil: "27876543213",
        enfermera,
        informe: "Paciente critico",
        nivelEmergencia: NivelEmergencia.CRITICA,
        temperatura: 38.5,
        frecuenciaCardiaca: 105,
        frecuenciaRespiratoria: 22,
        frecuenciaSistolica: 140,
        frecuenciaDiastolica: 90,
      });
      const doctor: Doctor = new Doctor(
        new Cuil("20999999999"),
        "Carlos",
        "Medico",
        new Email("doctor@example.com"),
        "MAT12345",
      );

      const ingresoReclamado = servicioUrgencias.reclamarPaciente(doctor);

      expect(ingresoReclamado.CuilPaciente).to.equal("27-87654321-3");
      expect(ingresoReclamado.Estado).to.equal(EstadoIngreso.EN_PROCESO);
      expect(ingresoReclamado.DoctorAsignado).to.not.be.null;
      expect(ingresoReclamado.DoctorAsignado?.Email.Valor).to.equal(
        doctor.Email.Valor,
      );
      const pendientes = servicioUrgencias.obtenerIngresosPendientes();
      expect(pendientes.map((ingreso) => ingreso.CuilPaciente)).to.not.include(
        ingresoReclamado.CuilPaciente,
      );
    });

    it("deberia lanzar error cuando no hay pacientes pendientes", () => {
      setupTestData();
      const doctor: Doctor = new Doctor(
        new Cuil("20999999999"),
        "Carlos",
        "Medico",
        new Email("doctor@example.com"),
        "MAT12345",
      );

      expect(() => servicioUrgencias.reclamarPaciente(doctor)).to.throw(
        "No hay pacientes en la lista de espera.",
      );
    });

    it("deberia impedir reclamar si el medico ya tiene un ingreso en proceso", () => {
      setupTestData();
      servicioUrgencias.registrarUrgencia({
        cuil: "23123456789",
        enfermera,
        informe: "Paciente en emergencia",
        nivelEmergencia: NivelEmergencia.EMERGENCIA,
        temperatura: 37.8,
        frecuenciaCardiaca: 90,
        frecuenciaRespiratoria: 18,
        frecuenciaSistolica: 125,
        frecuenciaDiastolica: 82,
      });
      servicioUrgencias.registrarUrgencia({
        cuil: "27876543213",
        enfermera,
        informe: "Paciente critico",
        nivelEmergencia: NivelEmergencia.CRITICA,
        temperatura: 38.5,
        frecuenciaCardiaca: 105,
        frecuenciaRespiratoria: 22,
        frecuenciaSistolica: 140,
        frecuenciaDiastolica: 90,
      });
      const doctor: Doctor = new Doctor(
        new Cuil("20999999999"),
        "Carlos",
        "Medico",
        new Email("doctor@example.com"),
        "MAT12345",
      );

      servicioUrgencias.reclamarPaciente(doctor);

      expect(() => servicioUrgencias.reclamarPaciente(doctor)).to.throw(
        "El médico ya tiene un paciente en proceso.",
      );
    });
  });

  describe("registrarAtencion", () => {
    it("deberia finalizar el ingreso y registrar la atencion", () => {
      setupTestData();
      servicioUrgencias.registrarUrgencia({
        cuil: "23123456789",
        enfermera,
        informe: "Paciente en emergencia",
        nivelEmergencia: NivelEmergencia.EMERGENCIA,
        temperatura: 37.8,
        frecuenciaCardiaca: 90,
        frecuenciaRespiratoria: 18,
        frecuenciaSistolica: 125,
        frecuenciaDiastolica: 82,
      });
      const doctor: Doctor = new Doctor(
        new Cuil("20999999999"),
        "Carlos",
        "Medico",
        new Email("doctor@example.com"),
        "MAT12345",
      );
      servicioUrgencias.reclamarPaciente(doctor, "23123456789");
      const atencion = servicioUrgencias.registrarAtencion(
        doctor,
        "23123456789",
        "Informe final",
      );
      const ingresos = servicioUrgencias.obtenerIngresosDelDoctor(
        doctor.Email.Valor,
      );
      expect(ingresos[0]?.Estado).to.equal(EstadoIngreso.FINALIZADO);
      const atenciones = servicioUrgencias.obtenerAtencionesDelDoctor(
        doctor.Email.Valor,
      );
      expect(atenciones).to.have.length(1);
      expect(atencion.Informe).to.equal("Informe final");
    });

    it("deberia lanzar error cuando el informe esta vacio", () => {
      setupTestData();
      servicioUrgencias.registrarUrgencia({
        cuil: "23123456789",
        enfermera,
        informe: "Paciente en emergencia",
        nivelEmergencia: NivelEmergencia.EMERGENCIA,
        temperatura: 37.8,
        frecuenciaCardiaca: 90,
        frecuenciaRespiratoria: 18,
        frecuenciaSistolica: 125,
        frecuenciaDiastolica: 82,
      });
      const doctor: Doctor = new Doctor(
        new Cuil("20999999999"),
        "Carlos",
        "Medico",
        new Email("doctor@example.com"),
        "MAT12345",
      );
      servicioUrgencias.reclamarPaciente(doctor, "23123456789");
      expect(() =>
        servicioUrgencias.registrarAtencion(doctor, "23123456789", " "),
      ).to.throw("Se ha omitido el informe de la atención");
    });

    it("deberia impedir registrar atencion si el medico no es el asignado", () => {
      setupTestData();
      servicioUrgencias.registrarUrgencia({
        cuil: "23123456789",
        enfermera,
        informe: "Paciente en emergencia",
        nivelEmergencia: NivelEmergencia.EMERGENCIA,
        temperatura: 37.8,
        frecuenciaCardiaca: 90,
        frecuenciaRespiratoria: 18,
        frecuenciaSistolica: 125,
        frecuenciaDiastolica: 82,
      });
      const doctorAsignado: Doctor = new Doctor(
        new Cuil("20999999999"),
        "Carlos",
        "Medico",
        new Email("doctor@example.com"),
        "MAT12345",
      );
      servicioUrgencias.reclamarPaciente(doctorAsignado, "23123456789");
      const doctorExterno: Doctor = new Doctor(
        new Cuil("20911111111"),
        "Laura",
        "Externa",
        new Email("externa@example.com"),
        "MAT54321",
      );
      expect(() =>
        servicioUrgencias.registrarAtencion(
          doctorExterno,
          "23123456789",
          "Informe",
        ),
      ).to.throw("Solo puede registrar la atención el médico asignado.");
    });
  });
});
