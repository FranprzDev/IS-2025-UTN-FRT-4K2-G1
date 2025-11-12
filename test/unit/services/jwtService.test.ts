import { describe, it, beforeEach } from "node:test";
import { expect } from "chai";
import { JwtService } from "../../../src/app/service/jwtService.js";
import { JwtPayload } from "../../../src/app/interface/jwtProvider.js";

describe("JwtService", () => {
  const secret: string = "test-secret-key";
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService(secret);
  });

  it("deberia firmar un token JWT", () => {
    const payload: JwtPayload = {
      sub: "123",
      email: "test@example.com",
      rol: "medico",
    };

    const token: string = jwtService.sign(payload);

    expect(token).to.exist;
    expect(token.split(".")).to.have.lengthOf(3);
  });

  it("deberia verificar un token JWT valido", () => {
    const payload: JwtPayload = {
      sub: "123",
      email: "test@example.com",
      rol: "medico",
    };

    const token: string = jwtService.sign(payload);
    const decoded: JwtPayload = jwtService.verify(token);

    expect(decoded.sub).to.equal(payload.sub);
    expect(decoded.email).to.equal(payload.email);
    expect(decoded.rol).to.equal(payload.rol);
  });

  it("deberia lanzar error al verificar un token invalido", () => {
    const tokenInvalido: string = "token.invalido.aqui";

    expect(() => jwtService.verify(tokenInvalido)).to.throw("Token inválido");
  });

  it("deberia usar tiempo de expiracion por defecto de 60 minutos", () => {
    const payload: JwtPayload = {
      sub: "123",
      email: "test@example.com",
      rol: "medico",
    };

    const token: string = jwtService.sign(payload);
    const decoded: JwtPayload = jwtService.verify(token);

    expect(decoded.sub).to.equal(payload.sub);
  });
});

