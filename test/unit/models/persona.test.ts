import { describe, it } from "node:test";
import { expect } from "chai";
import { Persona } from "../../../src/models/persona.js";
import { Email } from "../../../src/models/valueobjects/email.js";
import { Cuil } from "../../../src/models/valueobjects/cuil.js";

describe("Persona", () => {
  it("deberia crear persona con datos validos", () => {
    const cuil: Cuil = new Cuil("20123456789");
    const email: Email = new Email("test@example.com");
    const persona: Persona = new Persona(
      cuil,
      "Juan",
      "Pérez",
      email,
    );

    expect(persona).to.exist;
    expect(persona.Cuil.Valor).to.equal("20123456789");
    expect(persona.Nombre).to.equal("Juan");
    expect(persona.Apellido).to.equal("Pérez");
    expect(persona.Email.Valor).to.equal("test@example.com");
  });
});

