import { describe, it } from "node:test";
import { expect } from "chai";
import { Paciente } from "../../src/models/paciente.js";
import { Email } from "../../src/models/valueobjects/email.js";
import { Cuil } from "../../src/models/valueobjects/cuil.js";
import { Afiliado } from "../../src/models/afiliado.js";
import { ObraSocial } from "../../src/models/obraSocial.js";
import { Domicilio } from "../../src/models/domicilio.js";

describe("Paciente", () => {
  it("deberia crear paciente con datos validos", () => {
    const cuil: Cuil = new Cuil("23123456789");
    const email: Email = new Email("juan@example.com");
    const obraSocial: ObraSocial = new ObraSocial("1", "OSDE");
    const afiliado: Afiliado = new Afiliado(obraSocial, "12345678");
    const domicilio: Domicilio = new Domicilio(
      "Av. Libertador",
      "1234",
      "San Miguel de Tucumán",
    );
    const paciente: Paciente = new Paciente(
      cuil,
      "Juan",
      "Perez",
      email,
      afiliado,
      domicilio,
    );
    expect(paciente).to.exist;
  });

  it("deberia devolver el cuil correcto", () => {
    const cuil: Cuil = new Cuil("23123456789");
    const email: Email = new Email("juan@example.com");
    const obraSocial: ObraSocial = new ObraSocial("1", "OSDE");
    const afiliado: Afiliado = new Afiliado(obraSocial, "12345678");
    const domicilio: Domicilio = new Domicilio(
      "Av. Libertador",
      "1234",
      "San Miguel de Tucumán",
    );
    const paciente: Paciente = new Paciente(
      cuil,
      "Juan",
      "Perez",
      email,
      afiliado,
      domicilio,
    );
    expect(paciente.Cuil.Valor).to.equal("23123456789");
  });

  it("deberia permitir nombres con espacios", () => {
    const cuil: Cuil = new Cuil("23123456789");
    const email: Email = new Email("juan@example.com");
    const obraSocial: ObraSocial = new ObraSocial("1", "OSDE");
    const afiliado: Afiliado = new Afiliado(obraSocial, "12345678");
    const domicilio: Domicilio = new Domicilio(
      "Av. Libertador",
      "1234",
      "San Miguel de Tucumán",
    );
    const paciente: Paciente = new Paciente(
      cuil,
      "Juan Carlos",
      "Perez Gonzalez",
      email,
      afiliado,
      domicilio,
    );
    expect(paciente).to.exist;
    expect(paciente.Nombre).to.equal("Juan Carlos");
    expect(paciente.Apellido).to.equal("Perez Gonzalez");
  });

  it("deberia permitir obras sociales con espacios", () => {
    const cuil: Cuil = new Cuil("23123456789");
    const email: Email = new Email("juan@example.com");
    const obraSocial: ObraSocial = new ObraSocial("1", "Swiss Medical");
    const afiliado: Afiliado = new Afiliado(obraSocial, "12345678");
    const domicilio: Domicilio = new Domicilio(
      "Av. Libertador",
      "1234",
      "San Miguel de Tucumán",
    );
    const paciente: Paciente = new Paciente(
      cuil,
      "Juan",
      "Perez",
      email,
      afiliado,
      domicilio,
    );
    expect(paciente).to.exist;
    expect(paciente.Afiliado.ObraSocial.Nombre).to.equal("Swiss Medical");
  });
});
