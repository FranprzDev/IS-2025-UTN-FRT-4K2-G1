import { describe, it } from "node:test";
import { expect } from "chai";
import { Email } from "../../../src/models/valueobjects/email.js";
import { InvalidValueError } from "../../../src/models/valueobjects/errors/InvalidValueError.js";

describe("Email", () => {
  it("deberia crear email con formato valido", () => {
    const email: Email = new Email("test@example.com");
    expect(email).to.exist;
    expect(email.Valor).to.equal("test@example.com");
  });

  it("deberia lanzar error cuando el email no tiene arroba", () => {
    expect(() => new Email("testexample.com"))
      .to.throw(InvalidValueError, "El email no tiene un formato válido");
  });

  it("deberia lanzar error cuando el email no tiene dominio", () => {
    expect(() => new Email("test@"))
      .to.throw(InvalidValueError, "El email no tiene un formato válido");
  });

  it("deberia lanzar error cuando el email no tiene extension", () => {
    expect(() => new Email("test@example"))
      .to.throw(InvalidValueError, "El email no tiene un formato válido");
  });

  it("deberia aceptar email con formato complejo valido", () => {
    const email: Email = new Email("usuario.nombre+tag@dominio.co.uk");
    expect(email).to.exist;
    expect(email.Valor).to.equal("usuario.nombre+tag@dominio.co.uk");
  });
});

