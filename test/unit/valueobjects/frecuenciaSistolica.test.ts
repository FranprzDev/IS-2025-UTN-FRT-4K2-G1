import { describe, it } from "node:test";
import { expect } from "chai";
import { FrecuenciaSistolica } from "../../../src/models/valueobjects/frecuenciaSistolica.js";

describe("FrecuenciaSistolica", () => {
  it("deberia crear frecuencia sistolica con valor valido", () => {
    const frecuencia: FrecuenciaSistolica = new FrecuenciaSistolica(120);
    expect(frecuencia).to.exist;
  });

  it("deberia lanzar error cuando el valor es negativo", () => {
    expect(() => new FrecuenciaSistolica(-120)).to.throw("La frecuencia sistolica no puede ser negativa");
  });

  it("deberia lanzar error cuando el valor esta por debajo del rango medico", () => {
    expect(() => new FrecuenciaSistolica(50)).to.throw("La frecuencia sistolica se encuentra fuera de rango");
  });

  it("deberia lanzar error cuando el valor esta por encima del rango medico", () => {
    expect(() => new FrecuenciaSistolica(190)).to.throw("La frecuencia sistolica se encuentra fuera de rango");
  });

  it("deberia aceptar valor en limite inferior del rango medico", () => {
    const frecuencia: FrecuenciaSistolica = new FrecuenciaSistolica(60);
    expect(frecuencia).to.exist;
  });

  it("deberia aceptar valor en limite superior del rango medico", () => {
    const frecuencia: FrecuenciaSistolica = new FrecuenciaSistolica(180);
    expect(frecuencia).to.exist;
  });
});
