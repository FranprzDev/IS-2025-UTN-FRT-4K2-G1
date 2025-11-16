import { describe, it } from "node:test";
import { expect } from "chai";
import { PacienteService } from "../../src/app/service/pacienteService.js";
import { RepoPacientes } from "../../src/app/interface/repoPacientes.js";
import { RepoObrasSociales } from "../../src/app/interface/repoObrasSociales.js";
import { RepoAfiliaciones } from "../../src/app/interface/repoAfiliaciones.js";
import { Paciente } from "../../src/models/paciente.js";
import { Cuil } from "../../src/models/valueobjects/cuil.js";
import { Email } from "../../src/models/valueobjects/email.js";
import { Domicilio } from "../../src/models/domicilio.js";
import { ObraSocial } from "../../src/models/obraSocial.js";
import { Afiliado } from "../../src/models/afiliado.js";
import { NumeroAfiliado } from "../../src/models/valueobjects/numeroAfiliado.js";
import { InMemoryObrasSocialesRepo } from "../mocks/inMemoryObrasSocialesRepo.js";
import { InMemoryAfiliacionesRepo } from "../mocks/inMemoryAfiliacionesRepo.js";
import { DBPruebaEnMemoria } from "../../src/test/mocks/DBPruebaEnMemoria.js";
import { PacienteError } from "../../src/app/service/errors/pacienteError.js";

describe("PacienteService", () => {
  let repoPacientes: RepoPacientes;
  let repoObrasSociales: RepoObrasSociales;
  let repoAfiliaciones: RepoAfiliaciones;
  let pacienteService: PacienteService;

  const setupTestData = () => {
    repoPacientes = new DBPruebaEnMemoria();
    repoObrasSociales = new InMemoryObrasSocialesRepo();
    repoAfiliaciones = new InMemoryAfiliacionesRepo();
    pacienteService = new PacienteService(
      repoPacientes,
      repoObrasSociales,
      repoAfiliaciones,
    );
  };

  describe("registrarPaciente", () => {
    it("deberia registrar paciente con todos los datos mandatorios y obra social existente", () => {
      setupTestData();
      const obraSocial: ObraSocial = new ObraSocial("1", "OSDE");
      repoObrasSociales.guardar(obraSocial);
      repoAfiliaciones.guardar({
        cuil: "20123456789",
        nombreObraSocial: "OSDE",
        numeroAfiliado: "12345678",
      });

      const paciente: Paciente = pacienteService.registrarPaciente({
        cuil: "20123456789",
        apellido: "Perez",
        nombre: "Juan",
        calle: "Av. Libertador",
        numero: "1234",
        localidad: "San Miguel de Tucumán",
        nombreObraSocial: "OSDE",
        numeroAfiliado: "12345678",
      });

      expect(paciente).to.exist;
      expect(paciente.Cuil.Valor).to.equal("20123456789");
      expect(paciente.Nombre).to.equal("Juan");
      expect(paciente.Apellido).to.equal("Perez");
      expect(paciente.Afiliado).to.not.be.null;
      expect(paciente.Afiliado?.ObraSocial.Nombre).to.equal("OSDE");
    });

    it("deberia registrar paciente con todos los datos mandatorios sin obra social", () => {
      setupTestData();

      const paciente: Paciente = pacienteService.registrarPaciente({
        cuil: "20123456789",
        apellido: "Perez",
        nombre: "Juan",
        calle: "Av. Libertador",
        numero: "1234",
        localidad: "San Miguel de Tucumán",
      });

      expect(paciente).to.exist;
      expect(paciente.Cuil.Valor).to.equal("20123456789");
      expect(paciente.Nombre).to.equal("Juan");
      expect(paciente.Apellido).to.equal("Perez");
      expect(paciente.Afiliado).to.be.null;
    });

    it("deberia lanzar error cuando la obra social no existe", () => {
      setupTestData();

      expect(() => {
        pacienteService.registrarPaciente({
          cuil: "20123456789",
          apellido: "Perez",
          nombre: "Juan",
          calle: "Av. Libertador",
          numero: "1234",
          localidad: "San Miguel de Tucumán",
          nombreObraSocial: "Obra Social Inexistente",
          numeroAfiliado: "12345678",
        });
      }).to.throw(PacienteError, "No se puede registrar al paciente con una obra social inexistente");
    });

    it("deberia lanzar error cuando el paciente no esta afiliado a la obra social", () => {
      setupTestData();
      const obraSocial: ObraSocial = new ObraSocial("1", "OSDE");
      repoObrasSociales.guardar(obraSocial);

      expect(() => {
        pacienteService.registrarPaciente({
          cuil: "20123456789",
          apellido: "Perez",
          nombre: "Juan",
          calle: "Av. Libertador",
          numero: "1234",
          localidad: "San Miguel de Tucumán",
          nombreObraSocial: "OSDE",
          numeroAfiliado: "12345678",
        });
      }).to.throw(PacienteError, "El paciente no esta afiliado a esta obra social");
    });

    it("deberia lanzar error cuando falta el campo Cuil", () => {
      setupTestData();

      expect(() => {
        pacienteService.registrarPaciente({
          cuil: "",
          apellido: "Perez",
          nombre: "Juan",
          calle: "Av. Libertador",
          numero: "1234",
          localidad: "San Miguel de Tucumán",
        });
      }).to.throw(PacienteError, "Se debe completar el campo: Cuil");
    });

    it("deberia lanzar error cuando falta el campo Apellido", () => {
      setupTestData();

      expect(() => {
        pacienteService.registrarPaciente({
          cuil: "20123456789",
          apellido: "",
          nombre: "Juan",
          calle: "Av. Libertador",
          numero: "1234",
          localidad: "San Miguel de Tucumán",
        });
      }).to.throw(PacienteError, "Se debe completar el campo: Apellido");
    });

    it("deberia lanzar error cuando falta el campo Nombre", () => {
      setupTestData();

      expect(() => {
        pacienteService.registrarPaciente({
          cuil: "20123456789",
          apellido: "Perez",
          nombre: "",
          calle: "Av. Libertador",
          numero: "1234",
          localidad: "San Miguel de Tucumán",
        });
      }).to.throw(PacienteError, "Se debe completar el campo: Nombre");
    });

    it("deberia lanzar error cuando falta el campo Domicilio", () => {
      setupTestData();

      expect(() => {
        pacienteService.registrarPaciente({
          cuil: "20123456789",
          apellido: "Perez",
          nombre: "Juan",
          calle: "",
          numero: "1234",
          localidad: "San Miguel de Tucumán",
        });
      }).to.throw(PacienteError, "Se debe completar el campo: Domicilio");
    });

    it("deberia lanzar error cuando se proporciona obra social sin numero de afiliado", () => {
      setupTestData();
      const obraSocial: ObraSocial = new ObraSocial("1", "OSDE");
      repoObrasSociales.guardar(obraSocial);

      expect(() => {
        pacienteService.registrarPaciente({
          cuil: "20123456789",
          apellido: "Perez",
          nombre: "Juan",
          calle: "Av. Libertador",
          numero: "1234",
          localidad: "San Miguel de Tucumán",
          nombreObraSocial: "OSDE",
        });
      }).to.throw(PacienteError, "El número de afiliado es obligatorio cuando se proporciona obra social");
    });
  });
});

