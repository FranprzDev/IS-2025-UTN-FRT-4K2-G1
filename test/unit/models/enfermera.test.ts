import { describe, it } from "node:test";
import { expect } from "chai";
import { Enfermera } from "../../../src/models/enfermera.js";
import { Email } from "../../../src/models/valueobjects/email.js";
import { Cuil } from "../../../src/models/valueobjects/cuil.js";

describe("Enfermera", () => {
  it("deberia crear enfermera con datos validos", () => {
    const cuil: Cuil = new Cuil("27123456789");
    const email: Email = new Email("enfermera@example.com");
    const enfermera: Enfermera = new Enfermera(
      cuil,
      "María",
      "López",
      email,
      "ENF67890",
    );

    expect(enfermera).to.exist;
    expect(enfermera.Cuil.Valor).to.equal("27123456789");
    expect(enfermera.Nombre).to.equal("María");
    expect(enfermera.Apellido).to.equal("López");
    expect(enfermera.Email.Valor).to.equal("enfermera@example.com");
    expect(enfermera.Matricula).to.equal("ENF67890");
  });
});

