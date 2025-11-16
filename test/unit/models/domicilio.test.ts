import { describe, it } from "node:test";
import { expect } from "chai";
import { Domicilio } from "../../../src/models/domicilio.js";
import { InvalidValueError } from "../../../src/models/valueobjects/errors/InvalidValueError.js";

describe("Domicilio", () => {
  it("deberia crear domicilio con calle, numero y localidad", () => {
    const domicilio: Domicilio = new Domicilio(
      "Av. Libertador",
      "1234",
      "San Miguel de Tucumán",
    );

    expect(domicilio).to.exist;
    expect(domicilio.Calle).to.equal("Av. Libertador");
    expect(domicilio.Numero).to.equal("1234");
    expect(domicilio.Localidad).to.equal("San Miguel de Tucumán");
  });

  it("deberia lanzar error cuando la calle esta vacia", () => {
    expect(() => new Domicilio("", "1234", "San Miguel de Tucumán"))
      .to.throw(InvalidValueError, "La calle no puede estar vacía");
  });

  it("deberia lanzar error cuando el numero esta vacio", () => {
    expect(() => new Domicilio("Av. Libertador", "", "San Miguel de Tucumán"))
      .to.throw(InvalidValueError, "El número no puede estar vacío");
  });

  it("deberia lanzar error cuando la localidad esta vacia", () => {
    expect(() => new Domicilio("Av. Libertador", "1234", ""))
      .to.throw(InvalidValueError, "La localidad no puede estar vacía");
  });
});

