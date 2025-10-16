import { describe, it } from "node:test";
import { expect } from "chai";
import { FrecuenciaCardiaca } from "../../../src/models/valueobjects/frecuenciaCardiaca.js";

describe("FrecuenciaCardiaca", () => {
  it("deberia crear frecuencia cardiaca con valor valido", () => {
    const frecuencia: FrecuenciaCardiaca = new FrecuenciaCardiaca(70);
    expect(frecuencia).to.exist;
  });

  it("deberia lanzar error cuando el valor es negativo", () => {
    expect(() => new FrecuenciaCardiaca(-70))
      .to.throw("La frecuencia cardíaca no puede ser negativa");
  });

  it("deberia lanzar error cuando el valor esta por debajo del rango medico", () => {
    expect(() => new FrecuenciaCardiaca(10))
      .to.throw("La frecuencia cardíaca se encuentra fuera de rango");
  });

  it("deberia lanzar error cuando el valor esta por encima del rango medico", () => {
    expect(() => new FrecuenciaCardiaca(300))
      .to.throw("La frecuencia cardíaca se encuentra fuera de rango");
  });

  it("deberia aceptar valor en limite inferior del rango medico", () => {
    const frecuencia: FrecuenciaCardiaca = new FrecuenciaCardiaca(40);
    expect(frecuencia).to.exist;
  });

  it("deberia aceptar valor en limite superior del rango medico", () => {
    const frecuencia: FrecuenciaCardiaca = new FrecuenciaCardiaca(200);
    expect(frecuencia).to.exist;
  });
});

