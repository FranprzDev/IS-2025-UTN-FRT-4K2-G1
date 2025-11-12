import { describe, it } from "node:test";
import { expect } from "chai";
import { Cuil } from "../../../src/models/valueobjects/cuil.js";
import { InvalidValueError } from "../../../src/models/valueobjects/errors/InvalidValueError.js";

describe("Cuil", () => {
  it("deberia crear cuil con formato valido", () => {
    const cuil: Cuil = new Cuil("20123456789");
    expect(cuil).to.exist;
    expect(cuil.Valor).to.equal("20123456789");
  });

  it("deberia lanzar error cuando el cuil tiene menos de 11 caracteres", () => {
    expect(() => new Cuil("2012345678"))
      .to.throw(InvalidValueError, "El CUIL debe tener 11 caracteres");
  });

  it("deberia lanzar error cuando el cuil tiene mas de 11 caracteres", () => {
    expect(() => new Cuil("201234567890"))
      .to.throw(InvalidValueError, "El CUIL debe tener 11 caracteres");
  });

  it("deberia lanzar error cuando el cuil contiene letras", () => {
    expect(() => new Cuil("2012345678A"))
      .to.throw(InvalidValueError, "El CUIL debe contener solo números");
  });

  it("deberia lanzar error cuando el cuil esta vacio", () => {
    expect(() => new Cuil(""))
      .to.throw(InvalidValueError, "El CUIL debe tener 11 caracteres");
  });
});

