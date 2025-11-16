import { describe, it } from "node:test";
import { expect } from "chai";
import { Paciente } from "../../../src/models/paciente.js";
import { Email } from "../../../src/models/valueobjects/email.js";
import { Cuil } from "../../../src/models/valueobjects/cuil.js";
import { Afiliado } from "../../../src/models/afiliado.js";
import { ObraSocial } from "../../../src/models/obraSocial.js";
import { Domicilio } from "../../../src/models/domicilio.js";

describe("Paciente", () => {
  it("deberia crear paciente con afiliado", () => {
    const cuil: Cuil = new Cuil("20123456789");
    const email: Email = new Email("paciente@example.com");
    const obraSocial: ObraSocial = new ObraSocial("1", "OSDE");
    const afiliado: Afiliado = new Afiliado(obraSocial, "12345678");
    const domicilio: Domicilio = new Domicilio(
      "Av. Libertador",
      "1234",
      "San Miguel de Tucumán",
    );
    const paciente: Paciente = new Paciente(
      cuil,
      "Pedro",
      "Martínez",
      email,
      afiliado,
      domicilio,
    );

    expect(paciente).to.exist;
    expect(paciente.Cuil.Valor).to.equal("20123456789");
    expect(paciente.Nombre).to.equal("Pedro");
    expect(paciente.Apellido).to.equal("Martínez");
    expect(paciente.Email.Valor).to.equal("paciente@example.com");
    expect(paciente.Afiliado).to.exist;
    expect(paciente.Afiliado?.ObraSocial.Nombre).to.equal("OSDE");
    expect(paciente.Domicilio.Calle).to.equal("Av. Libertador");
  });

  it("deberia crear paciente sin afiliado", () => {
    const cuil: Cuil = new Cuil("20123456789");
    const email: Email = new Email("paciente@example.com");
    const domicilio: Domicilio = new Domicilio(
      "Av. Libertador",
      "1234",
      "San Miguel de Tucumán",
    );
    const paciente: Paciente = new Paciente(
      cuil,
      "Pedro",
      "Martínez",
      email,
      null,
      domicilio,
    );

    expect(paciente).to.exist;
    expect(paciente.Cuil.Valor).to.equal("20123456789");
    expect(paciente.Nombre).to.equal("Pedro");
    expect(paciente.Apellido).to.equal("Martínez");
    expect(paciente.Email.Valor).to.equal("paciente@example.com");
    expect(paciente.Afiliado).to.be.null;
    expect(paciente.Domicilio.Calle).to.equal("Av. Libertador");
  });
});
