import { describe, it } from "node:test";
import { expect } from "chai";
import { Enfermera } from "../../src/models/enfermera.js";
import { Email } from "../../src/models/valueobjects/email.js";
import { Cuil } from "../../src/models/valueobjects/cuil.js";

describe("Enfermera", () => {
  it("deberia crear enfermera con datos validos", () => {
    const cuil: Cuil = new Cuil("27123456789");
    const email: Email = new Email("maria@example.com");
    const enfermera: Enfermera = new Enfermera(
      cuil,
      "Maria",
      "Gonzalez",
      email,
      "ENF12345",
    );
    expect(enfermera).to.exist;
    expect(enfermera.Nombre).to.equal("Maria");
    expect(enfermera.Apellido).to.equal("Gonzalez");
    expect(enfermera.Matricula).to.equal("ENF12345");
  });

  it("deberia permitir nombres con espacios", () => {
    const cuil: Cuil = new Cuil("27123456789");
    const email: Email = new Email("maria@example.com");
    const enfermera: Enfermera = new Enfermera(
      cuil,
      "Maria del Carmen",
      "Gonzalez Rodriguez",
      email,
      "ENF12345",
    );
    expect(enfermera).to.exist;
    expect(enfermera.Nombre).to.equal("Maria del Carmen");
    expect(enfermera.Apellido).to.equal("Gonzalez Rodriguez");
  });
});
