import { describe, it } from "node:test";
import { expect } from "chai";
import { Enfermera } from "../../src/models/enfermera.js";

describe("Enfermera", () => {
  it("deberia crear enfermera con datos validos", () => {
    const enfermera: Enfermera = new Enfermera("Maria", "Gonzalez");
    expect(enfermera).to.exist;
  });

  it("deberia permitir nombres con espacios", () => {
    const enfermera: Enfermera = new Enfermera("Maria del Carmen", "Gonzalez Rodriguez");
    expect(enfermera).to.exist;
  });
});
