import { describe, it } from "node:test";
import { expect } from "chai";
import { Temperatura } from "../../../src/models/valueobjects/temperatura.js";

describe("Temperatura", () => {
  it("deberia crear temperatura con valor valido", () => {
    const temperatura: Temperatura = new Temperatura(37);
    expect(temperatura).to.exist;
  });

  it("deberia lanzar error cuando el valor esta por debajo del rango medico", () => {
    expect(() => new Temperatura(20))
      .to.throw("La temperatura se encuentra fuera de rango");
  });

  it("deberia lanzar error cuando el valor esta por encima del rango medico", () => {
    expect(() => new Temperatura(50))
      .to.throw("La temperatura se encuentra fuera de rango");
  });

  it("deberia aceptar valor en limite inferior del rango medico", () => {
    const temperatura: Temperatura = new Temperatura(30);
    expect(temperatura).to.exist;
  });

  it("deberia aceptar valor en limite superior del rango medico", () => {
    const temperatura: Temperatura = new Temperatura(45);
    expect(temperatura).to.exist;
  });
});

