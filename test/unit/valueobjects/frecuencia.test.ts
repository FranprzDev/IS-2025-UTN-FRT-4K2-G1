import { describe, it } from "node:test";
import { expect } from "chai";
import { Frecuencia } from "../../../src/models/valueobjects/frecuencia.js";

// Creamos una clase concreta para poder testear la clase abstracta
class FrecuenciaTest extends Frecuencia {
  public constructor(valor: number, rangoMinimo?: number, rangoMaximo?: number) {
    super("frecuencia test", valor, rangoMinimo, rangoMaximo);
  }
}

describe("Frecuencia (abstract)", () => {
  describe("assertValorNoNegativo", () => {
    it("deberia aceptar valores positivos", () => {
      const frecuencia: FrecuenciaTest = new FrecuenciaTest(10);
      expect(frecuencia).to.exist;
    });

    it("deberia aceptar cero", () => {
      const frecuencia: FrecuenciaTest = new FrecuenciaTest(0);
      expect(frecuencia).to.exist;
    });

    it("deberia lanzar error cuando el valor es negativo", () => {
      expect(() => new FrecuenciaTest(-1)).to.throw("La frecuencia test no puede ser negativa");
    });
  });

  describe("assertValorEnRango", () => {
    it("deberia aceptar valores dentro del rango", () => {
      const frecuencia: FrecuenciaTest = new FrecuenciaTest(10, 5, 15);
      expect(frecuencia).to.exist;
    });

    it("deberia aceptar valores en los limites del rango", () => {
      expect(() => new FrecuenciaTest(5, 5, 15)).to.not.throw();
      expect(() => new FrecuenciaTest(15, 5, 15)).to.not.throw();
    });

    it("deberia lanzar error cuando el valor esta por debajo del rango minimo", () => {
      expect(() => new FrecuenciaTest(4, 5, 15)).to.throw("La frecuencia test se encuentra fuera de rango");
    });

    it("deberia lanzar error cuando el valor esta por encima del rango maximo", () => {
      expect(() => new FrecuenciaTest(16, 5, 15)).to.throw("La frecuencia test se encuentra fuera de rango");
    });

    it("deberia no validar rango cuando no se especifica rango", () => {
      const frecuencia: FrecuenciaTest = new FrecuenciaTest(1000); // Sin rango especificado
      expect(frecuencia).to.exist;
    });
  });
});
