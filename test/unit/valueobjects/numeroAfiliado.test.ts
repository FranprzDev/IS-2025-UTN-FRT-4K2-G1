import { describe, it } from "node:test";
import { expect } from "chai";
import { NumeroAfiliado } from "../../../src/models/valueobjects/numeroAfiliado.js";
import { InvalidValueError } from "../../../src/models/valueobjects/errors/InvalidValueError.js";

describe("NumeroAfiliado", () => {
  it("deberia crear numero de afiliado con valor valido", () => {
    const numeroAfiliado: NumeroAfiliado = new NumeroAfiliado("12345678");
    expect(numeroAfiliado).to.exist;
    expect(numeroAfiliado.Valor).to.equal("12345678");
  });

  it("deberia lanzar error cuando el numero de afiliado esta vacio", () => {
    expect(() => new NumeroAfiliado(""))
      .to.throw(InvalidValueError, "El número de afiliado no puede estar vacío");
  });

  it("deberia lanzar error cuando el numero de afiliado es null", () => {
    expect(() => new NumeroAfiliado(null as any))
      .to.throw(InvalidValueError, "El número de afiliado no puede estar vacío");
  });

  it("deberia lanzar error cuando el numero de afiliado es undefined", () => {
    expect(() => new NumeroAfiliado(undefined as any))
      .to.throw(InvalidValueError, "El número de afiliado no puede estar vacío");
  });

  it("deberia aceptar numeros de afiliado con diferentes formatos", () => {
    const numero1: NumeroAfiliado = new NumeroAfiliado("12345678");
    const numero2: NumeroAfiliado = new NumeroAfiliado("ABC12345");
    const numero3: NumeroAfiliado = new NumeroAfiliado("123-456-789");

    expect(numero1.Valor).to.equal("12345678");
    expect(numero2.Valor).to.equal("ABC12345");
    expect(numero3.Valor).to.equal("123-456-789");
  });
});

