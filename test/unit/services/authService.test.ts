import { describe, it, beforeEach } from "node:test";
import { expect } from "chai";
import { AuthService } from "../../../src/app/service/authService.js";
import { InMemoryUsuariosRepo } from "../../../mocks/inMemoryUsuariosRepo.js";
import { BcryptPasswordHasher } from "../../../src/app/service/bcryptPasswordHasher.js";
import { JwtService } from "../../../src/app/service/jwtService.js";
import { AuthError } from "../../../src/app/service/errors/authError.js";
import { InvalidValueError } from "../../../src/models/valueobjects/errors/InvalidValueError.js";

describe("AuthService", () => {
  let authService: AuthService;
  let repoUsuarios: InMemoryUsuariosRepo;
  let passwordHasher: BcryptPasswordHasher;
  let jwtService: JwtService;

  beforeEach(() => {
    repoUsuarios = new InMemoryUsuariosRepo();
    passwordHasher = new BcryptPasswordHasher();
    jwtService = new JwtService("test-secret-key");
    authService = new AuthService(
      repoUsuarios,
      passwordHasher,
      jwtService,
    );
    repoUsuarios.limpiar();
  });

  it("deberia registrar un usuario exitosamente", async () => {
    const usuario = await authService.registrarUsuario(
      "test@example.com",
      "password123",
      "medico",
    );

    expect(usuario).to.exist;
    expect(usuario.Email.Valor).to.equal("test@example.com");
    expect(usuario.Rol).to.equal("medico");
    expect(usuario.PasswordHash).to.not.equal("password123");
  });

  it("deberia lanzar error al registrar usuario con email duplicado", async () => {
    await authService.registrarUsuario(
      "test@example.com",
      "password123",
      "medico",
    );

    try {
      await authService.registrarUsuario(
        "test@example.com",
        "password456",
        "enfermero",
      );
      expect.fail("Deberia haber lanzado un error");
    } catch (error) {
      expect(error).to.be.instanceOf(InvalidValueError);
      expect((error as Error).message).to.equal("Email ya registrado");
    }
  });

  it("deberia lanzar error al registrar usuario con contraseña corta", async () => {
    try {
      await authService.registrarUsuario("test@example.com", "short", "medico");
      expect.fail("Deberia haber lanzado un error");
    } catch (error) {
      expect(error).to.be.instanceOf(InvalidValueError);
      expect((error as Error).message).to.equal(
        "La contraseña debe tener al menos 8 caracteres",
      );
    }
  });

  it("deberia iniciar sesion exitosamente con credenciales validas", async () => {
    await authService.registrarUsuario(
      "test@example.com",
      "password123",
      "medico",
    );

    const resultado = await authService.iniciarSesion(
      "test@example.com",
      "password123",
    );

    expect(resultado.token).to.exist;
    expect(resultado.token.split(".")).to.have.lengthOf(3);
  });

  it("deberia lanzar error al iniciar sesion con email inexistente", async () => {
    try {
      await authService.iniciarSesion("nonexistent@example.com", "password123");
      expect.fail("Deberia haber lanzado un error");
    } catch (error) {
      expect(error).to.be.instanceOf(AuthError);
      expect((error as Error).message).to.equal("Usuario o contraseña inválidos");
    }
  });

  it("deberia lanzar error al iniciar sesion con contraseña incorrecta", async () => {
    await authService.registrarUsuario(
      "test@example.com",
      "password123",
      "medico",
    );

    try {
      await authService.iniciarSesion("test@example.com", "wrongpassword");
      expect.fail("Deberia haber lanzado un error");
    } catch (error) {
      expect(error).to.be.instanceOf(AuthError);
      expect((error as Error).message).to.equal("Usuario o contraseña inválidos");
    }
  });

  it("deberia generar token con informacion correcta del usuario", async () => {
    await authService.registrarUsuario(
      "test@example.com",
      "password123",
      "enfermero",
    );

    const resultado = await authService.iniciarSesion(
      "test@example.com",
      "password123",
    );

    const decoded = jwtService.verify(resultado.token);
    expect(decoded.email).to.equal("test@example.com");
    expect(decoded.rol).to.equal("enfermero");
    expect(decoded.sub).to.exist;
  });
});

