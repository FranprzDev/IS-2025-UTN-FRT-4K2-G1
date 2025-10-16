import { describe, it } from "node:test";
import { expect } from "chai";
import { TensionArterial } from "../../../src/models/valueobjects/tensionArterial.js";

describe("TensionArterial", () => {
  it("deberia crear tension arterial con valores validos", () => {
    const tension: TensionArterial = new TensionArterial(120, 80);
    expect(tension).to.exist;
  });

  it("deberia lanzar error cuando la sistolica esta por encima del rango medico", () => {
    expect(() => new TensionArterial(200, 80))
      .to.throw("La tensión arterial se encuentra fuera de rango");
  });

  it("deberia lanzar error cuando la diastolica esta por encima del rango medico", () => {
    expect(() => new TensionArterial(120, 160))
      .to.throw("La tensión arterial se encuentra fuera de rango");
  });

  it("deberia lanzar error cuando ambas presiones estan por encima del rango medico", () => {
    expect(() => new TensionArterial(200, 160))
      .to.throw("La tensión arterial se encuentra fuera de rango");
  });

  it("deberia aceptar valores en el limite superior del rango medico", () => {
    const tension: TensionArterial = new TensionArterial(180, 120);
    expect(tension).to.exist;
  });

  it("deberia aceptar valores en el limite inferior del rango medico", () => {
    const tension: TensionArterial = new TensionArterial(60, 40);
    expect(tension).to.exist;
  });
});

