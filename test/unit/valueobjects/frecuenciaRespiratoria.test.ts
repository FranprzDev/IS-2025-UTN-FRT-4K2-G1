import { describe, it } from "node:test";
import { expect } from "chai";
import { FrecuenciaRespiratoria } from "../../../src/models/valueobjects/frecuenciaRespiratoria.js";

describe("FrecuenciaRespiratoria", () => {
  it("deberia crear frecuencia respiratoria con valor valido", () => {
    const frecuencia: FrecuenciaRespiratoria = new FrecuenciaRespiratoria(15);
    expect(frecuencia).to.exist;
  });

  it("deberia lanzar error cuando el valor es negativo", () => {
    expect(() => new FrecuenciaRespiratoria(-15))
      .to.throw("La frecuencia respiratoria no puede ser negativa");
  });

  it("deberia lanzar error cuando el valor esta por debajo del rango medico", () => {
    expect(() => new FrecuenciaRespiratoria(120))
      .to.throw("La frecuencia respiratoria se encuentra fuera de rango");
  });

  it("deberia lanzar error cuando el valor esta por encima del rango medico", () => {
    expect(() => new FrecuenciaRespiratoria(150))
      .to.throw("La frecuencia respiratoria se encuentra fuera de rango");
  });

  it("deberia aceptar valor en limite inferior del rango medico", () => {
    const frecuencia: FrecuenciaRespiratoria = new FrecuenciaRespiratoria(8);
    expect(frecuencia).to.exist;
  });

  it("deberia aceptar valor en limite superior del rango medico", () => {
    const frecuencia: FrecuenciaRespiratoria = new FrecuenciaRespiratoria(60);
    expect(frecuencia).to.exist;
  });
});

