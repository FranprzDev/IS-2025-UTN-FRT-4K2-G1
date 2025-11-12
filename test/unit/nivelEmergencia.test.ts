import { describe, it } from "node:test";
import { expect } from "chai";
import { NivelEmergencia } from "../../src/models/nivelEmergencia.js";

describe("NivelEmergencia", () => {
  describe("compararCon", () => {
    it("deberia devolver negativo cuando this tiene mayor prioridad que otro", () => {
      const resultado: number = NivelEmergencia.CRITICA.compararCon(NivelEmergencia.EMERGENCIA);
      expect(resultado).to.be.lessThan(0);
    });

    it("deberia devolver positivo cuando otro tiene mayor prioridad que this", () => {
      const resultado: number = NivelEmergencia.EMERGENCIA.compararCon(NivelEmergencia.CRITICA);
      expect(resultado).to.be.greaterThan(0);
    });

    it("deberia devolver cero cuando tienen la misma prioridad", () => {
      const resultado: number = NivelEmergencia.EMERGENCIA.compararCon(NivelEmergencia.EMERGENCIA);
      expect(resultado).to.equal(0);
    });

    it("deberia ordenar correctamente todos los niveles de prioridad", () => {
      const niveles = [
        NivelEmergencia.SIN_URGENCIA,
        NivelEmergencia.URGENCIA_MENOR,
        NivelEmergencia.URGENCIA,
        NivelEmergencia.EMERGENCIA,
        NivelEmergencia.CRITICA,
      ];

      for (let i = 0; i < niveles.length - 1; i++) {
        const resultado: number = niveles[i]!.compararCon(niveles[i + 1]!);
        expect(resultado).to.be.greaterThan(0, `Nivel ${niveles[i]!.descripcion} debería tener menor prioridad que ${niveles[i + 1]!.descripcion}`);
      } 
    });
  });

  describe("tieneNombre", () => {
    it("deberia devolver true cuando el nombre coincide", () => {
      const resultado: boolean = NivelEmergencia.CRITICA.tieneNombre("Critica");
      expect(resultado).to.be.true;
    });

    it("deberia devolver false cuando el nombre no coincide", () => {
      const resultado: boolean = NivelEmergencia.CRITICA.tieneNombre("Emergencia");
      expect(resultado).to.be.false;
    });

    it("deberia ser case sensitive", () => {
      const resultado: boolean = NivelEmergencia.CRITICA.tieneNombre("critica");
      expect(resultado).to.be.false;
    });
  });

  describe("constantes", () => {
    it("deberia tener todas las constantes definidas con los codigos correctos", () => {
      expect(NivelEmergencia.CRITICA.codigo).to.equal(1);
      expect(NivelEmergencia.EMERGENCIA.codigo).to.equal(2);
      expect(NivelEmergencia.URGENCIA.codigo).to.equal(3);
      expect(NivelEmergencia.URGENCIA_MENOR.codigo).to.equal(4);
      expect(NivelEmergencia.SIN_URGENCIA.codigo).to.equal(5);
    });

    it("deberia tener todas las constantes con las descripciones correctas", () => {
      expect(NivelEmergencia.CRITICA.descripcion).to.equal("Critica");
      expect(NivelEmergencia.EMERGENCIA.descripcion).to.equal("Emergencia");
      expect(NivelEmergencia.URGENCIA.descripcion).to.equal("Urgencia");
      expect(NivelEmergencia.URGENCIA_MENOR.descripcion).to.equal("Urgencia Menor");
      expect(NivelEmergencia.SIN_URGENCIA.descripcion).to.equal("Sin Urgencia");
    });
  });
});
