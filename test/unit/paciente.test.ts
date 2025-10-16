import { describe, it } from "node:test";
import { expect } from "chai";
import { Paciente } from "../../src/models/paciente.js";

describe("Paciente", () => {
  it("deberia crear paciente con datos validos", () => {
    const paciente: Paciente = new Paciente("Juan", "Perez", "23-12345678-9", "OSDE");
    expect(paciente).to.exist;
  });

  it("deberia devolver el cuil correcto", () => {
    const cuil: string = "23-12345678-9";
    const paciente: Paciente = new Paciente("Juan", "Perez", cuil, "OSDE");
    expect(paciente.Cuil).to.equal(cuil);
  });

  it("deberia permitir nombres con espacios", () => {
    const paciente: Paciente = new Paciente("Juan Carlos", "Perez Gonzalez", "23-12345678-9", "OSDE");
    expect(paciente).to.exist;
    expect(paciente.Cuil).to.equal("23-12345678-9");
  });

  it("deberia permitir obras sociales con espacios", () => {
    const paciente: Paciente = new Paciente("Juan", "Perez", "23-12345678-9", "Swiss Medical");
    expect(paciente).to.exist;
    expect(paciente.Cuil).to.equal("23-12345678-9");
  });
});
