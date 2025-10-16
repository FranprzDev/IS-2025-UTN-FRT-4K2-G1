import { describe, it } from "node:test";
import { expect } from "chai";
import { FrecuenciaDiastolica } from "../../../src/models/valueobjects/frecuenciaDiastolica.js";

describe("FrecuenciaDiastolica", () => {
  it("deberia crear frecuencia diastolica con valor valido", () => {
    const frecuencia: FrecuenciaDiastolica = new FrecuenciaDiastolica(80);
    expect(frecuencia).to.exist;
  });

  it("deberia lanzar error cuando el valor es negativo", () => {
    expect(() => new FrecuenciaDiastolica(-80)).to.throw("La frecuencia diastolica no puede ser negativa");
  });

  it("deberia lanzar error cuando el valor esta por debajo del rango medico", () => {
    expect(() => new FrecuenciaDiastolica(30)).to.throw("La frecuencia diastolica se encuentra fuera de rango");
  });

  it("deberia lanzar error cuando el valor esta por encima del rango medico", () => {
    expect(() => new FrecuenciaDiastolica(130)).to.throw("La frecuencia diastolica se encuentra fuera de rango");
  });

  it("deberia aceptar valor en limite inferior del rango medico", () => {
    const frecuencia: FrecuenciaDiastolica = new FrecuenciaDiastolica(40);
    expect(frecuencia).to.exist;
  });

  it("deberia aceptar valor en limite superior del rango medico", () => {
    const frecuencia: FrecuenciaDiastolica = new FrecuenciaDiastolica(120);
    expect(frecuencia).to.exist;
  });
});
